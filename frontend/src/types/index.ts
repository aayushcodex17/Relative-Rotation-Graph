export interface RRGPoint {
  date: string
  rs_ratio: number
  rs_momentum: number
}

export interface RRGSecurity {
  symbol: string
  name: string | null
  group: string | null
  quadrant: 'Leading' | 'Weakening' | 'Lagging' | 'Improving'
  tail: RRGPoint[]
  current_rs_ratio: number
  current_rs_momentum: number
}

export interface QuadrantSummary {
  leading: number
  weakening: number
  lagging: number
  improving: number
}

export interface RRGResponse {
  benchmark: string
  securities: RRGSecurity[]
  quadrant_summary: QuadrantSummary | null
  generated_at: string
}

export const SECTOR_GROUP_COLORS: Record<string, string> = {
  'Banking & Finance':     '#818cf8',
  'Technology':            '#34d399',
  'Consumption & Cyclical':'#fb923c',
  'Healthcare & Defensive':'#f472b6',
  'Commodities & Infra':   '#fbbf24',
  'PSU & Government':      '#60a5fa',
  'Services':              '#a78bfa',
}

export interface RRGRequest {
  symbols: string[]
  benchmark: string
  period: string
  tail_length: number
}

export const QUADRANT_COLORS = {
  Leading:   { dot: '#10b981', trail: 'rgba(16,185,129,0.5)',  bg: 'rgba(16,185,129,0.06)',  label: '#10b981' },
  Weakening: { dot: '#f59e0b', trail: 'rgba(245,158,11,0.5)', bg: 'rgba(245,158,11,0.06)', label: '#f59e0b' },
  Lagging:   { dot: '#ef4444', trail: 'rgba(239,68,68,0.5)',  bg: 'rgba(239,68,68,0.06)',  label: '#ef4444' },
  Improving: { dot: '#3b82f6', trail: 'rgba(59,130,246,0.5)', bg: 'rgba(59,130,246,0.06)', label: '#3b82f6' },
}

export const NIFTY_PRESETS: Record<string, string[]> = {
  'Nifty Top 10': [
    'RELIANCE.NS','TCS.NS','HDFCBANK.NS','BHARTIARTL.NS','ICICIBANK.NS',
    'INFY.NS','SBIN.NS','HINDUNILVR.NS','ITC.NS','KOTAKBANK.NS'
  ],
  'Nifty IT': [
    'TCS.NS','INFY.NS','WIPRO.NS','HCLTECH.NS','TECHM.NS','LTIM.NS','MPHASIS.NS'
  ],
  'Nifty Banking': [
    'HDFCBANK.NS','ICICIBANK.NS','SBIN.NS','KOTAKBANK.NS','AXISBANK.NS',
    'INDUSINDBK.NS','BANDHANBNK.NS','FEDERALBNK.NS'
  ],
  'Nifty Sectors': [
    '^NSEBANK','^CNXIT','^CNXAUTO','^CNXPHARMA','^CNXFMCG',
    '^CNXMETAL','^CNXREALTY','^CNXENERGY'
  ],
}

export const BENCHMARKS = [
  { label: 'Nifty 50',      value: '^NSEI'      },
  { label: 'Nifty Next 50', value: '^NSMIDCP'   },
  { label: 'Midcap 50',     value: '^NSEMDCP50' },
  { label: 'Smallcap 100',  value: '^CNXSC'     },
  { label: 'Sensex',        value: '^BSESN'     },
  { label: 'Bank Nifty',    value: '^NSEBANK'   },
  { label: 'Nifty 500',     value: '^CRSLDX'    },
  { label: 'S&P 500',       value: '^GSPC'      },
  { label: 'Nasdaq',        value: '^IXIC'      },
]

export const PERIODS = [
  { label: '7 Days',   value: '7d'  },
  { label: '14 Days',  value: '14d' },
  { label: '1 Month',  value: '1mo' },
  { label: '3 Months', value: '3mo' },
  { label: '6 Months', value: '6mo' },
  { label: '1 Year',   value: '1y'  },
  { label: '2 Years',  value: '2y'  },
]

// Trail = number of data points shown in the tail on the chart
export const TRAIL_OPTIONS = [
  { label: '1d',  value: 1  },
  { label: '3d',  value: 3  },
  { label: '5d',  value: 5  },
  { label: '1w',  value: 7  },
  { label: '2w',  value: 14 },
]
