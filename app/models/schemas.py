from pydantic import BaseModel
from typing import List, Optional


class RRGPoint(BaseModel):
    date: str
    rs_ratio: float
    rs_momentum: float


class RRGSecurity(BaseModel):
    symbol: str
    name: Optional[str] = None
    quadrant: str                  # Leading, Weakening, Lagging, Improving
    tail: List[RRGPoint]           # Last N weeks of positions (the trail)
    current_rs_ratio: float
    current_rs_momentum: float


class RRGResponse(BaseModel):
    benchmark: str
    securities: List[RRGSecurity]
    generated_at: str


class RRGRequest(BaseModel):
    symbols: List[str]
    benchmark: str = "^NSEI"       # Default: Nifty 50
    period: str = "1y"             # Data period
    tail_length: int = 5           # Weeks of tail to show


class HealthResponse(BaseModel):
    status: str
    message: str
