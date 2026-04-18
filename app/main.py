from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import rrg
from app.models.schemas import HealthResponse

app = FastAPI(
    title="Relative Rotation Graph API",
    description=(
        "REST API for computing Relative Rotation Graphs (RRG) for Indian and global markets. "
        "Identifies sector rotation and stock momentum relative to a benchmark using "
        "JdK RS-Ratio and RS-Momentum indicators."
    ),
    version="1.0.0",
    contact={"name": "Ayush", "url": "https://github.com/aayushcodex17"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rrg.router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(status="ok", message="Relative Rotation Graph API is running.")


@app.get("/", tags=["Health"])
def root():
    return {
        "app": "Relative Rotation Graph API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "compute_rrg":     "POST /rrg/compute",
            "india_sectors":   "POST /rrg/sectors/india",
            "quadrant_guide":  "GET  /rrg/quadrants",
        }
    }
