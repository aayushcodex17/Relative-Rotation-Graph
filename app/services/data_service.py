import yfinance as yf
import pandas as pd
from typing import List, Tuple

# Per-period: (yfinance interval, JdK smoothing window)
PERIOD_CONFIG: dict[str, Tuple[str, int]] = {
    "7d":  ("1d",  2),
    "14d": ("1d",  3),
    "1mo": ("1d",  5),
    "3mo": ("1d",  10),
    "6mo": ("1wk", 10),
    "1y":  ("1wk", 10),
    "2y":  ("1wk", 10),
}

# Fyers resolution string differs from yfinance interval string
_FYERS_RESOLUTION = {"1d": "D", "1wk": "W"}


def get_period_config(period: str) -> Tuple[str, int]:
    """Return (yfinance interval, smooth_period) for a given period string."""
    return PERIOD_CONFIG.get(period, ("1wk", 10))


def fetch_closing_prices(symbols: List[str], benchmark: str, period: str) -> pd.DataFrame:
    """
    Fetch closing prices for all symbols + benchmark.

    Data source priority:
      1. Fyers API  — when FYERS_ACCESS_TOKEN is set in .env (live broker data)
      2. yfinance   — automatic fallback when Fyers is unavailable or returns
                      no data for a symbol (e.g. US indices like ^GSPC)
    """
    yf_interval, _ = get_period_config(period)
    fyers_resolution = _FYERS_RESOLUTION.get(yf_interval, "D")

    # ── Try Fyers first ────────────────────────────────────────────────────────
    from app.services.fyers_service import fetch_closing_prices as fyers_fetch, is_fyers_available

    if is_fyers_available():
        fyers_df = fyers_fetch(symbols, benchmark, period, fyers_resolution)

        if not fyers_df.empty:
            all_needed = set(symbols + [benchmark])
            fyers_cols  = set(fyers_df.columns)
            missing     = all_needed - fyers_cols

            if not missing:
                # All symbols fetched from Fyers — return directly
                return fyers_df

            # Some symbols missing (e.g. US indices) — fill them from yfinance
            if missing:
                yf_df = _fetch_yfinance(list(missing), period, yf_interval)
                combined = pd.concat([fyers_df, yf_df], axis=1).sort_index().dropna(how="all")
                return combined

    # ── Full yfinance fallback ─────────────────────────────────────────────────
    return _fetch_yfinance(list(set(symbols + [benchmark])), period, yf_interval)


def _fetch_yfinance(symbols: List[str], period: str, interval: str) -> pd.DataFrame:
    """Fetch closing prices from yfinance for the given symbols."""
    raw = yf.download(symbols, period=period, interval=interval,
                      auto_adjust=True, progress=False)

    if isinstance(raw.columns, pd.MultiIndex):
        prices = raw["Close"]
    else:
        prices = raw[["Close"]]
        prices.columns = symbols

    return prices.dropna(how="all")
