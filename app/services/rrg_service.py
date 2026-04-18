import pandas as pd
import numpy as np
from datetime import datetime
from typing import List

from app.models.schemas import RRGPoint, RRGSecurity, RRGResponse
from app.services.data_service import fetch_closing_prices


# JdK RS-Ratio & RS-Momentum smoothing period (standard: 10 weeks)
SMOOTH_PERIOD = 10
RS_RATIO_CENTER = 100.0
RS_MOMENTUM_CENTER = 100.0


def _calculate_rs_ratio(prices: pd.DataFrame, symbol: str, benchmark: str) -> pd.Series:
    """
    RS-Ratio: measures relative strength of symbol vs benchmark.
    Formula: smoothed(symbol / benchmark * 100) normalized to 100-center.
    """
    relative = (prices[symbol] / prices[benchmark]) * 100
    smoothed = relative.rolling(window=SMOOTH_PERIOD).mean()

    # Normalize around 100
    rs_ratio = (smoothed / smoothed.rolling(window=SMOOTH_PERIOD).mean()) * RS_RATIO_CENTER
    return rs_ratio


def _calculate_rs_momentum(rs_ratio: pd.Series) -> pd.Series:
    """
    RS-Momentum: rate of change of RS-Ratio.
    Formula: smoothed(RS-Ratio / RS-Ratio[N periods ago]) normalized to 100-center.
    """
    roc = (rs_ratio / rs_ratio.shift(SMOOTH_PERIOD)) * 100
    smoothed = roc.rolling(window=SMOOTH_PERIOD).mean()

    rs_momentum = (smoothed / smoothed.rolling(window=SMOOTH_PERIOD).mean()) * RS_MOMENTUM_CENTER
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
    """
    prices = fetch_closing_prices(symbols, benchmark, period)

    securities = []

    for symbol in symbols:
        if symbol not in prices.columns:
            continue

        # Drop rows where either symbol or benchmark has NaN
        valid = prices[[symbol, benchmark]].dropna()

        if len(valid) < SMOOTH_PERIOD * 2 + tail_length:
            continue

        rs_ratio = _calculate_rs_ratio(valid, symbol, benchmark)
        rs_momentum = _calculate_rs_momentum(rs_ratio)

        combined = pd.DataFrame({
            "rs_ratio": rs_ratio,
            "rs_momentum": rs_momentum
        }).dropna()

        if combined.empty:
            continue

        # Build tail — last N points
        tail_data = combined.tail(tail_length)
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

    return RRGResponse(
        benchmark=benchmark,
        securities=securities,
        generated_at=datetime.utcnow().isoformat()
    )
