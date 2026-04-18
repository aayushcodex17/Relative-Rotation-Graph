export interface RRGPoint {
  date: string
  rs_ratio: number
  rs_momentum: number
}

export interface RRGSecurity {
  symbol: string
  name: string | null
  quadrant: 'Leading' | 'Weakening' | 'Lagging' | 'Improving'
  tail: RRGPoint[]
  current_rs_ratio: number
  current_rs_momentum: number
}

export interface RRGResponse {
  benchmark: string
  securities: RRGSecurity[]
  generated_at: string
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
  { label: 'Nifty 50',     value: '^NSEI'    },
  { label: 'Bank Nifty',   value: '^NSEBANK' },
  { label: 'Nifty 500',    value: '^CRSLDX'  },
  { label: 'S&P 500',      value: '^GSPC'    },
  { label: 'Nasdaq',       value: '^IXIC'    },
]

export const PERIODS = [
  { label: '6 Months', value: '6mo'  },
  { label: '1 Year',   value: '1y'   },
  { label: '2 Years',  value: '2y'   },
]
