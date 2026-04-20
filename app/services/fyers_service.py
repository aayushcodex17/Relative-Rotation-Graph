"""
Fyers API data service.
Fetches OHLCV history for NSE/BSE symbols and indices.
Falls back gracefully when a symbol isn't available on Fyers.
"""

import os
import pandas as pd
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional, List, Tuple, Dict
from dotenv import load_dotenv

load_dotenv()

# ── Symbol mapping: yfinance → Fyers ──────────────────────────────────────────

_INDEX_MAP: Dict[str, Optional[str]] = {
    "^NSEI":       "NSE:NIFTY50-INDEX",
    "^NSEBANK":    "NSE:NIFTYBANK-INDEX",
    "^NSMIDCP":    "NSE:NIFTYNXT50-INDEX",
    "^NSEMDCP50":  "NSE:NIFTYMIDCAP50-INDEX",
    "^CNXSC":      "NSE:NIFTYSMLCAP100-INDEX",
    "^CRSLDX":     "NSE:NIFTY500-INDEX",
    "^BSESN":      "BSE:SENSEX-INDEX",
    "^CNXIT":      "NSE:CNXIT-INDEX",
    "^CNXAUTO":    "NSE:CNXAUTO-INDEX",
    "^CNXPHARMA":  "NSE:CNXPHARMA-INDEX",
    "^CNXFMCG":    "NSE:CNXFMCG-INDEX",
    "^CNXMETAL":   "NSE:CNXMETAL-INDEX",
    "^CNXREALTY":  "NSE:CNXREALTY-INDEX",
    "^CNXENERGY":  "NSE:CNXENERGY-INDEX",
    "^CNXINFRA":   "NSE:CNXINFRA-INDEX",
    "^CNXPSUBANK": "NSE:CNXPSUBANK-INDEX",
    "^CNXFINANCE": "NSE:CNXFINANCE-INDEX",
    "^CNXMEDIA":   "NSE:CNXMEDIA-INDEX",
    "^CNXMNC":     "NSE:CNXMNC-INDEX",
    "^CNXPSE":     "NSE:CNXPSE-INDEX",
    "^CNXSERVICE": "NSE:CNXSERVICE-INDEX",
    # US indices — not on Fyers, triggers yfinance fallback
    "^GSPC": None,
    "^IXIC": None,
}

# Tickers that don't follow the simple .NS → -EQ rule
_EQUITY_OVERRIDES: Dict[str, str] = {
    "ZOMATO.NS":     "NSE:ETERNAL-EQ",   # Zomato rebranded to Eternal
    "MCDOWELL-N.NS": "NSE:UNITDSPR-EQ",  # United Spirits (old McDowell ticker retired)
}

_MAX_DAYS_PER_REQUEST = 365


def to_fyers_symbol(yf_symbol: str) -> Optional[str]:
    """Convert yfinance ticker to Fyers symbol. Returns None if not on Fyers."""
    if yf_symbol in _EQUITY_OVERRIDES:
        return _EQUITY_OVERRIDES[yf_symbol]
    if yf_symbol in _INDEX_MAP:
        return _INDEX_MAP[yf_symbol]
    if yf_symbol.endswith(".NS"):
        return f"NSE:{yf_symbol[:-3]}-EQ"
    if yf_symbol.endswith(".BO"):
        return f"BSE:{yf_symbol[:-3]}-A"
    return None


def is_fyers_available() -> bool:
    """True when a valid access token exists in the environment."""
    return bool(os.getenv("FYERS_ACCESS_TOKEN", "").strip())


def _get_client():
    from fyers_apiv3 import fyersModel
    return fyersModel.FyersModel(
        client_id=os.getenv("FYERS_CLIENT_ID"),
        is_async=False,
        token=os.getenv("FYERS_ACCESS_TOKEN"),
        log_path="",
    )


def _date_chunks(total_days: int) -> List[Tuple[str, str]]:
    """Split period into ≤365-day chunks (Fyers API limit). Returns oldest-first."""
    today = datetime.today()
    chunks = []
    end = today
    remaining = total_days
    while remaining > 0:
        chunk = min(remaining, _MAX_DAYS_PER_REQUEST)
        start = end - timedelta(days=chunk)
        chunks.append((start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")))
        end = start - timedelta(days=1)
        remaining -= chunk
    return list(reversed(chunks))


def _fetch_one(client, yf_symbol: str, resolution: str,
               date_from: str, date_to: str) -> Tuple[str, Optional[pd.Series]]:
    """Fetch close series for one symbol over one date chunk."""
    fyers_sym = to_fyers_symbol(yf_symbol)
    if fyers_sym is None:
        return yf_symbol, None
    try:
        resp = client.history(data={
            "symbol":      fyers_sym,
            "resolution":  resolution,
            "date_format": "1",
            "range_from":  date_from,
            "range_to":    date_to,
            "cont_flag":   "1",
        })
    except Exception:
        return yf_symbol, None

    if resp.get("s") != "ok" or not resp.get("candles"):
        return yf_symbol, None

    df = pd.DataFrame(resp["candles"],
                      columns=["timestamp", "open", "high", "low", "close", "volume"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="s").dt.normalize()
    df.set_index("date", inplace=True)
    return yf_symbol, df["close"].rename(yf_symbol)


def fetch_closing_prices(symbols: List[str], benchmark: str,
                         period: str, resolution: str) -> pd.DataFrame:
    """
    Fetch closing prices from Fyers for all symbols + benchmark.
    resolution: 'D' = daily, 'W' = weekly.
    Returns empty DataFrame if auth unavailable or all fetches fail.
    """
    if not is_fyers_available():
        return pd.DataFrame()

    period_days: Dict[str, int] = {
        "7d": 10, "14d": 20, "1mo": 35,
        "3mo": 100, "6mo": 200, "1y": 370, "2y": 740,
    }
    total_days = period_days.get(period, 370)
    chunks = _date_chunks(total_days)
    all_symbols = list(set(symbols + [benchmark]))
    client = _get_client()

    def fetch_symbol(yf_sym: str) -> Tuple[str, Optional[pd.Series]]:
        parts = []
        for date_from, date_to in chunks:
            _, series = _fetch_one(client, yf_sym, resolution, date_from, date_to)
            if series is not None:
                parts.append(series)
        if not parts:
            return yf_sym, None
        combined = pd.concat(parts).sort_index()
        combined = combined[~combined.index.duplicated(keep="last")]
        return yf_sym, combined

    frames: Dict[str, pd.Series] = {}
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {pool.submit(fetch_symbol, sym): sym for sym in all_symbols}
        for future in as_completed(futures):
            yf_sym, series = future.result()
            if series is not None and not series.empty:
                frames[yf_sym] = series

    if not frames:
        return pd.DataFrame()

    return pd.DataFrame(frames).sort_index().dropna(how="all")
