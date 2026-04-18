from fastapi import APIRouter, HTTPException
from app.models.schemas import RRGRequest, RRGResponse
from app.services.rrg_service import compute_rrg

router = APIRouter(prefix="/rrg", tags=["Relative Rotation Graph"])

# Preset watchlists for Indian markets
NIFTY_50_SECTORS = {
    "Nifty Bank":        "^NSEBANK",
    "Nifty IT":          "^CNXIT",
    "Nifty Auto":        "^CNXAUTO",
    "Nifty Pharma":      "^CNXPHARMA",
    "Nifty FMCG":        "^CNXFMCG",
    "Nifty Metal":       "^CNXMETAL",
    "Nifty Realty":      "^CNXREALTY",
    "Nifty Energy":      "^CNXENERGY",
    "Nifty Infra":       "^CNXINFRA",
    "Nifty Media":       "^CNXMEDIA",
}


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
    if len(request.symbols) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 symbols allowed per request.")

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


@router.post("/sectors/india", response_model=RRGResponse, summary="RRG for Nifty sector indices")
def sectors_india(period: str = "1y", tail_length: int = 5):
    """
    Pre-built RRG for all major Nifty sector indices vs Nifty 50.
    No input needed — just call and get sector rotation data.
    """
    symbols = list(NIFTY_50_SECTORS.values())
    try:
        result = compute_rrg(
            symbols=symbols,
            benchmark="^NSEI",
            period=period,
            tail_length=tail_length
        )
        # Attach human-readable names
        name_map = {v: k for k, v in NIFTY_50_SECTORS.items()}
        for sec in result.securities:
            sec.name = name_map.get(sec.symbol, sec.symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute sector RRG: {str(e)}")

    return result


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
