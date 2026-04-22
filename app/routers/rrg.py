from fastapi import APIRouter, HTTPException
from app.models.schemas import RRGRequest, RRGResponse
from app.services.rrg_service import compute_rrg
from app.data.constituents import INDEX_CONSTITUENTS

router = APIRouter(prefix="/rrg", tags=["Relative Rotation Graph"])

# All 14 verified working NSE sectoral indices grouped by category
ALL_NSE_SECTORS: dict[str, dict] = {
    "^NSEBANK":    {"name": "Nifty Bank",        "group": "Banking & Finance"},
    "^CNXPSUBANK": {"name": "Nifty PSU Bank",     "group": "Banking & Finance"},
    "^CNXFINANCE": {"name": "Nifty Financial Svc","group": "Banking & Finance"},
    "^CNXIT":      {"name": "Nifty IT",           "group": "Technology"},
    "^CNXAUTO":    {"name": "Nifty Auto",         "group": "Consumption & Cyclical"},
    "^CNXFMCG":    {"name": "Nifty FMCG",         "group": "Consumption & Cyclical"},
    "^CNXREALTY":  {"name": "Nifty Realty",       "group": "Consumption & Cyclical"},
    "^CNXMEDIA":   {"name": "Nifty Media",        "group": "Consumption & Cyclical"},
    "^CNXMNC":     {"name": "Nifty MNC",          "group": "Consumption & Cyclical"},
    "^CNXPHARMA":  {"name": "Nifty Pharma",       "group": "Healthcare & Defensive"},
    "^CNXMETAL":   {"name": "Nifty Metal",        "group": "Commodities & Infra"},
    "^CNXENERGY":  {"name": "Nifty Energy",       "group": "Commodities & Infra"},
    "^CNXINFRA":   {"name": "Nifty Infra",        "group": "Commodities & Infra"},
    "^CNXPSE":     {"name": "Nifty PSE",          "group": "PSU & Government"},
    "^CNXSERVICE": {"name": "Nifty Services",     "group": "Services"},
}

# Subset used by old /sectors/india endpoint (kept for backward compat)
NIFTY_CORE_SECTORS = {k: v for k, v in ALL_NSE_SECTORS.items()
                      if k in {"^NSEBANK","^CNXIT","^CNXAUTO","^CNXPHARMA","^CNXFMCG",
                                "^CNXMETAL","^CNXREALTY","^CNXENERGY","^CNXINFRA","^CNXMEDIA"}}


@router.post("/compute", response_model=RRGResponse, summary="Compute RRG for given symbols")
def compute(request: RRGRequest):
    """
    Compute Relative Rotation Graph data for the provided symbols against a benchmark.

    - **symbols**: List of ticker symbols (e.g. ["RELIANCE.NS", "TCS.NS"])
    - **benchmark**: Benchmark ticker (default: ^NSEI — Nifty 50)
    - **period**: Data period (1y, 6mo, 2y etc.)
    - **tail_length**: Number of weekly data points to include in the trail (default: 5)
    """
    if not request.symbols:
        raise HTTPException(status_code=400, detail="At least one symbol is required.")
    if len(request.symbols) > 200:
        raise HTTPException(status_code=400, detail="Maximum 200 symbols allowed per request.")

    try:
        result = compute_rrg(
            symbols=request.symbols,
            benchmark=request.benchmark,
            period=request.period,
            tail_length=request.tail_length
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute RRG: {str(e)}")

    if not result.securities:
        raise HTTPException(status_code=404, detail="No valid data returned for the given symbols.")

    return result


@router.post("/sectors/india", response_model=RRGResponse, summary="RRG for core Nifty sector indices")
def sectors_india(period: str = "1y", tail_length: int = 5):
    """Pre-built RRG for 10 core Nifty sector indices vs Nifty 50."""
    return _build_sector_rrg(NIFTY_CORE_SECTORS, period, tail_length)


@router.post("/sectors/india/all", response_model=RRGResponse, summary="RRG for ALL NSE sectoral indices")
def sectors_india_all(period: str = "1y", tail_length: int = 5):
    """
    Compare ALL available NSE sectoral indices on a single RRG vs Nifty 50.

    Includes 15 sector indices across 5 groups:
    - **Banking & Finance**: Bank, PSU Bank, Financial Services
    - **Technology**: IT
    - **Consumption & Cyclical**: Auto, FMCG, Realty, Media, MNC
    - **Healthcare & Defensive**: Pharma
    - **Commodities & Infra**: Metal, Energy, Infra
    - **PSU & Government**: PSE
    - **Services**: Services Sector
    """
    return _build_sector_rrg(ALL_NSE_SECTORS, period, tail_length)


@router.get("/sectors/india/groups", summary="List all NSE sector groups and their indices")
def sector_groups():
    """Returns all sector indices grouped by category — useful for building filter UIs."""
    groups: dict[str, list] = {}
    for sym, meta in ALL_NSE_SECTORS.items():
        g = meta["group"]
        if g not in groups:
            groups[g] = []
        groups[g].append({"symbol": sym, "name": meta["name"]})
    return {"groups": groups, "total": len(ALL_NSE_SECTORS)}


@router.get("/quadrants", summary="Explanation of RRG quadrants")
def quadrants():
    """Returns a description of each RRG quadrant."""
    return {
        "center": {"rs_ratio": 100, "rs_momentum": 100},
        "quadrants": {
            "Leading":   {"rs_ratio": ">100", "rs_momentum": ">100", "meaning": "Outperforming benchmark with improving momentum. Best zone."},
            "Weakening": {"rs_ratio": ">100", "rs_momentum": "<100", "meaning": "Still outperforming but momentum is fading. Watch for exit."},
            "Lagging":   {"rs_ratio": "<100", "rs_momentum": "<100", "meaning": "Underperforming with declining momentum. Avoid."},
            "Improving": {"rs_ratio": "<100", "rs_momentum": ">100", "meaning": "Underperforming but momentum is picking up. Early opportunity."},
        },
        "rotation": "Securities typically rotate clockwise: Leading → Weakening → Lagging → Improving → Leading"
    }


@router.get("/constituents/{benchmark}", summary="Get constituent stocks for a benchmark index")
def get_constituents(benchmark: str):
    """
    Returns the list of constituent stocks for a given benchmark index symbol.
    Supported: ^NSEI, ^BSESN, ^NSEBANK, ^NSMIDCP, ^NSEMDCP50, ^CNXSC, ^CNXIT.
    """
    # URL-safe: '^NSEI' may arrive as '%5ENSEI' — decode handled by FastAPI automatically.
    entry = INDEX_CONSTITUENTS.get(benchmark)
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"No constituent data available for '{benchmark}'. "
                   f"Supported: {list(INDEX_CONSTITUENTS.keys())}"
        )
    return {
        "benchmark": benchmark,
        "label":     entry["label"],
        "count":     len(entry["symbols"]),
        "symbols":   entry["symbols"],
    }


# ── Internal helper ────────────────────────────────────────────────────────────

def _build_sector_rrg(sector_map: dict, period: str, tail_length: int) -> RRGResponse:
    symbols = list(sector_map.keys())
    try:
        result = compute_rrg(symbols=symbols, benchmark="^NSEI", period=period, tail_length=tail_length)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute sector RRG: {str(e)}")

    for sec in result.securities:
        meta = sector_map.get(sec.symbol, {})
        sec.name  = meta.get("name",  sec.symbol)
        sec.group = meta.get("group", None)

    return result
