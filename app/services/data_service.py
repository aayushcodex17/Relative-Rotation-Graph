import yfinance as yf
import pandas as pd
from typing import List


def fetch_closing_prices(symbols: List[str], benchmark: str, period: str) -> pd.DataFrame:
    """
    Fetch weekly closing prices for all symbols + benchmark.
    Returns a DataFrame with symbols as columns.
    """
    all_symbols = list(set(symbols + [benchmark]))
    raw = yf.download(all_symbols, period=period, interval="1wk", auto_adjust=True, progress=False)

    if isinstance(raw.columns, pd.MultiIndex):
        prices = raw["Close"]
    else:
        prices = raw[["Close"]]
        prices.columns = all_symbols

    prices = prices.dropna(how="all")
    return prices
