# Relative Rotation Graph (RRG)

> A REST API that computes Relative Rotation Graphs for Indian and global markets — identifying sector rotation and stock momentum relative to a benchmark.

---

## What is an RRG?

A **Relative Rotation Graph** is a visualization tool used in technical analysis to compare the **relative strength** and **momentum** of multiple securities against a single benchmark (e.g. Nifty 50).

Each security is plotted on a 2D chart across four quadrants:

```
          RS-Momentum (Y-axis)
               ▲
               │
  IMPROVING    │    LEADING
  (Early opp.) │  (Best zone)
               │
  ─────────────┼────────────── RS-Ratio (X-axis)
               │        100
  LAGGING      │    WEAKENING
  (Avoid)      │  (Watch exit)
               │
```

| Quadrant | RS-Ratio | RS-Momentum | Meaning |
|---|---|---|---|
| **Leading** | > 100 | > 100 | Outperforming, momentum rising. Best zone. |
| **Weakening** | > 100 | < 100 | Outperforming, but momentum fading. |
| **Lagging** | < 100 | < 100 | Underperforming, momentum declining. Avoid. |
| **Improving** | < 100 | > 100 | Underperforming, but momentum picking up. Early entry. |

> Securities typically rotate **clockwise**: Leading → Weakening → Lagging → Improving → Leading

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.9+ |
| Framework | FastAPI |
| Data | yfinance (Yahoo Finance) |
| Analysis | Pandas, NumPy |
| Visualization | Plotly |
| Server | Uvicorn |
| Validation | Pydantic v2 |

---

## Project Structure

```
Relative-Rotation-Graph/
├── app/
│   ├── main.py                  # FastAPI app + middleware
│   ├── routers/
│   │   └── rrg.py               # API endpoints
│   ├── services/
│   │   ├── data_service.py      # yfinance data fetching
│   │   └── rrg_service.py       # JdK RS-Ratio & RS-Momentum calculation
│   └── models/
│       └── schemas.py           # Pydantic request/response models
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## API Reference

Base URL: `http://localhost:8000`

### `POST /rrg/compute`
Compute RRG for any list of symbols vs a benchmark.

**Request:**
```json
{
  "symbols": ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"],
  "benchmark": "^NSEI",
  "period": "1y",
  "tail_length": 5
}
```

**Response:**
```json
{
  "benchmark": "^NSEI",
  "generated_at": "2026-04-18T10:00:00",
  "securities": [
    {
      "symbol": "RELIANCE.NS",
      "quadrant": "Leading",
      "current_rs_ratio": 102.45,
      "current_rs_momentum": 101.12,
      "tail": [
        { "date": "2026-04-11", "rs_ratio": 101.80, "rs_momentum": 100.90 },
        { "date": "2026-04-18", "rs_ratio": 102.45, "rs_momentum": 101.12 }
      ]
    }
  ]
}
```

### `POST /rrg/sectors/india`
Pre-built RRG for all **Nifty sector indices** vs Nifty 50. No input needed.

**Query params:**
- `period` (default: `1y`)
- `tail_length` (default: `5`)

**Sectors included:**
Nifty Bank, IT, Auto, Pharma, FMCG, Metal, Realty, Energy, Infra, Media

### `GET /rrg/quadrants`
Returns quadrant definitions and rotation explanation.

### `GET /health`
Health check endpoint.

---

## How the Calculation Works

### 1. RS-Ratio (Relative Strength)
Measures how strongly a security is performing vs the benchmark.

```
Relative  = (Symbol Price / Benchmark Price) × 100
RS-Ratio  = Smoothed(Relative) / Smoothed(Relative, longer period) × 100
```
- Value **> 100** → outperforming the benchmark
- Value **< 100** → underperforming the benchmark

### 2. RS-Momentum
Measures the **rate of change** of RS-Ratio — is relative strength improving or deteriorating?

```
RS-Momentum = Smoothed(RS-Ratio / RS-Ratio[10 weeks ago]) × 100
```
- Value **> 100** → RS-Ratio is improving
- Value **< 100** → RS-Ratio is deteriorating

Both use a **10-week smoothing period** (JdK standard).

---

## Getting Started

### Prerequisites
- Python 3.9+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/aayushcodex17/Relative-Rotation-Graph.git
cd Relative-Rotation-Graph

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI: `http://localhost:8000/docs`

---

## Example Use Cases

| Use Case | Endpoint |
|---|---|
| Which Nifty sectors are leading right now? | `POST /rrg/sectors/india` |
| Compare specific stocks vs Nifty 50 | `POST /rrg/compute` with `.NS` suffixed symbols |
| Compare vs a sector benchmark | `POST /rrg/compute` with custom `benchmark` |
| S&P 500 sector rotation | `POST /rrg/compute` with US sector ETFs, benchmark `^GSPC` |

---

## Symbol Format

| Market | Format | Example |
|---|---|---|
| NSE (India) | `TICKER.NS` | `RELIANCE.NS`, `TCS.NS` |
| BSE (India) | `TICKER.BO` | `RELIANCE.BO` |
| Nifty Indices | `^NSEI`, `^NSEBANK` | — |
| US Stocks | `TICKER` | `AAPL`, `MSFT` |
| US Indices | `^GSPC`, `^DJI` | — |

---

## License

Open source under the [MIT License](LICENSE).
