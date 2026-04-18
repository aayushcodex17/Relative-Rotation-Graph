import yfinance as yf
import pandas as pd
from typing import List, Tuple

# Per-period: (yfinance interval, JdK smoothing window)
# Short periods use daily bars with a tighter smoothing window so the
# RRG calculation has enough data points to produce meaningful results.
PERIOD_CONFIG: dict[str, Tuple[str, int]] = {
    "7d":  ("1d",  2),
    "14d": ("1d",  3),
    "1mo": ("1d",  5),
    "3mo": ("1d",  10),
    "6mo": ("1wk", 10),
    "1y":  ("1wk", 10),
    "2y":  ("1wk", 10),
}


def get_period_config(period: str) -> Tuple[str, int]:
    """Return (yfinance interval, smooth_period) for a given period string."""
    return PERIOD_CONFIG.get(period, ("1wk", 10))


def fetch_closing_prices(symbols: List[str], benchmark: str, period: str) -> pd.DataFrame:
    """
    Fetch closing prices for all symbols + benchmark.
    Interval is chosen automatically based on the period:
      short periods (7d/14d/1mo/3mo) → daily bars
      longer periods (6mo/1y/2y)     → weekly bars
    """
    interval, _ = get_period_config(period)
    all_symbols = list(set(symbols + [benchmark]))
    raw = yf.download(all_symbols, period=period, interval=interval, auto_adjust=True, progress=False)

    if isinstance(raw.columns, pd.MultiIndex):
        prices = raw["Close"]
    else:
        prices = raw[["Close"]]
        prices.columns = all_symbols

    prices = prices.dropna(how="all")
    return prices
