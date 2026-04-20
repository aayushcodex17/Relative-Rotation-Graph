import pandas as pd
import numpy as np
from datetime import datetime
from typing import List

from app.models.schemas import RRGPoint, RRGSecurity, RRGResponse, QuadrantSummary
from app.services.data_service import fetch_closing_prices, get_period_config

RS_RATIO_CENTER   = 100.0
RS_MOMENTUM_CENTER = 100.0


def _ewm(series: pd.Series, span: int) -> pd.Series:
    """Exponential weighted mean — uses all available data from the first point,
    so it introduces zero NaN beyond what's already present in the input."""
    return series.ewm(span=span, adjust=False).mean()


def _calculate_rs_ratio(prices: pd.DataFrame, symbol: str, benchmark: str, smooth: int) -> pd.Series:
    """
    RS-Ratio: measures relative strength of symbol vs benchmark.
    Uses EWM smoothing so only `smooth` rows are consumed (from the shift),
    not the 5×smooth rows that chained SMA rolling windows would consume.
    """
    relative = (prices[symbol] / prices[benchmark]) * 100
    smoothed  = _ewm(relative, smooth)
    # Normalize: each value expressed as % of its own smoothed baseline → centred at 100
    rs_ratio  = (smoothed / _ewm(smoothed, smooth)) * RS_RATIO_CENTER
    return rs_ratio


def _calculate_rs_momentum(rs_ratio: pd.Series, smooth: int) -> pd.Series:
    """
    RS-Momentum: rate-of-change of RS-Ratio, smoothed and normalised to 100.
    The only hard NaN source is the shift(smooth) — EWM itself starts from row 0.
    """
    roc         = (rs_ratio / rs_ratio.shift(smooth)) * 100
    smoothed    = _ewm(roc, smooth)
    rs_momentum = (smoothed / _ewm(smoothed, smooth)) * RS_MOMENTUM_CENTER
    return rs_momentum


def _determine_quadrant(rs_ratio: float, rs_momentum: float) -> str:
    """
    Four quadrants based on position relative to (100, 100) center:

        Improving  | Leading
        -----------+-----------
        Lagging    | Weakening

    X-axis = RS-Ratio  (>100 = right)
    Y-axis = RS-Momentum (>100 = top)
    """
    if rs_ratio >= RS_RATIO_CENTER and rs_momentum >= RS_MOMENTUM_CENTER:
        return "Leading"
    elif rs_ratio >= RS_RATIO_CENTER and rs_momentum < RS_MOMENTUM_CENTER:
        return "Weakening"
    elif rs_ratio < RS_RATIO_CENTER and rs_momentum < RS_MOMENTUM_CENTER:
        return "Lagging"
    else:
        return "Improving"


def compute_rrg(symbols: List[str], benchmark: str, period: str, tail_length: int) -> RRGResponse:
    """
    Main function: computes RRG data for all symbols against the benchmark.
    The smoothing window and data interval are chosen automatically from the period.
    """
    _, smooth = get_period_config(period)
    prices = fetch_closing_prices(symbols, benchmark, period)

    securities = []

    for symbol in symbols:
        if symbol not in prices.columns:
            continue

        # Drop rows where either symbol or benchmark has NaN
        valid = prices[[symbol, benchmark]].dropna()

        # With EWM the only hard NaN source is shift(smooth) in RS-Momentum.
        # Require at least smooth + 1 rows so we get at least one valid point.
        if len(valid) < smooth + 1:
            continue

        rs_ratio    = _calculate_rs_ratio(valid, symbol, benchmark, smooth)
        rs_momentum = _calculate_rs_momentum(rs_ratio, smooth)

        combined = pd.DataFrame({
            "rs_ratio":    rs_ratio,
            "rs_momentum": rs_momentum,
        }).dropna()

        if combined.empty:
            continue

        # Cap tail to however many valid points exist — never silently drop a symbol
        actual_tail = min(tail_length, len(combined))
        tail_data   = combined.tail(actual_tail)
        tail = [
            RRGPoint(
                date=str(idx.date()),
                rs_ratio=round(row["rs_ratio"], 4),
                rs_momentum=round(row["rs_momentum"], 4)
            )
            for idx, row in tail_data.iterrows()
        ]

        latest = combined.iloc[-1]
        current_rs_ratio = round(float(latest["rs_ratio"]), 4)
        current_rs_momentum = round(float(latest["rs_momentum"]), 4)
        quadrant = _determine_quadrant(current_rs_ratio, current_rs_momentum)

        securities.append(RRGSecurity(
            symbol=symbol,
            quadrant=quadrant,
            tail=tail,
            current_rs_ratio=current_rs_ratio,
            current_rs_momentum=current_rs_momentum
        ))

    summary = QuadrantSummary(
        leading=sum(1 for s in securities if s.quadrant == "Leading"),
        weakening=sum(1 for s in securities if s.quadrant == "Weakening"),
        lagging=sum(1 for s in securities if s.quadrant == "Lagging"),
        improving=sum(1 for s in securities if s.quadrant == "Improving"),
    )

    return RRGResponse(
        benchmark=benchmark,
        securities=securities,
        quadrant_summary=summary,
        generated_at=datetime.utcnow().isoformat()
    )
