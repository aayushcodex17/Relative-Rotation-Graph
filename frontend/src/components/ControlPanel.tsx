import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { BENCHMARKS, PERIODS, TRAIL_OPTIONS, NIFTY_PRESETS } from '../types'
import type { RRGRequest } from '../types'
import { getConstituents } from '../api/rrg'

const CONSTITUENT_SUPPORTED = new Set(['^NSEI','^BSESN','^NSEBANK','^NSMIDCP','^NSEMDCP50','^CNXSC','^CNXIT'])

interface Props {
  onFetch:        (req: RRGRequest) => void
  onFetchSectors: (period: string, tail: number) => void
  loading:        boolean
}

export default function ControlPanel({ onFetch, onFetchSectors, loading }: Props) {
  const [symbols,         setSymbols]         = useState<string[]>([])
  const [input,           setInput]           = useState('')
  const [benchmark,       setBenchmark]       = useState('^NSEI')
  const [period,          setPeriod]          = useState('1y')
  const [tailLength,      setTailLength]      = useState(7)
  const [loadingConstits, setLoadingConstits] = useState(false)
  const [initialized,     setInitialized]     = useState(false)

  // On mount: auto-load Nifty 50 constituents and generate initial RRG
  useEffect(() => {
    const init = async () => {
      setLoadingConstits(true)
      try {
        const res = await getConstituents('^NSEI')
        setSymbols(res.symbols)
        onFetch({ symbols: res.symbols, benchmark: '^NSEI', period: '1y', tail_length: 5 })
      } catch {
        // fallback to a small default if backend is unreachable
        const fallback = ['RELIANCE.NS','TCS.NS','HDFCBANK.NS','INFY.NS','ICICIBANK.NS','BHARTIARTL.NS','SBIN.NS','ICICIBANK.NS','WIPRO.NS','HCLTECH.NS']
        setSymbols(fallback)
        onFetch({ symbols: fallback, benchmark: '^NSEI', period: '1y', tail_length: 5 })
      } finally {
        setLoadingConstits(false)
        setInitialized(true)
      }
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addSymbol = () => {
    const s = input.trim().toUpperCase()
    if (s && !symbols.includes(s) && symbols.length < 60) {
      setSymbols(p => [...p, s])
      setInput('')
    }
  }

  const removeSymbol = (s: string) => setSymbols(p => p.filter(x => x !== s))

  const handleLoadConstituents = async (bm = benchmark) => {
    setLoadingConstits(true)
    try {
      const res = await getConstituents(bm)
      setSymbols(res.symbols)
      onFetch({ symbols: res.symbols, benchmark: bm, period, tail_length: tailLength })
    } catch {
      // unsupported benchmark — no-op
    } finally {
      setLoadingConstits(false)
    }
  }

  const handleBenchmarkChange = (bm: string) => {
    setBenchmark(bm)
    // If the new benchmark has constituents, offer one-click load — don't auto-switch
  }

  const benchmarkLabel = BENCHMARKS.find(b => b.value === benchmark)?.label ?? benchmark

  return (
    <div className="flex flex-col gap-4">

      {/* Quick presets */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(NIFTY_PRESETS).map(([label, syms]) => (
            <button
              key={label}
              onClick={() => setSymbols(syms)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#1e2536] hover:bg-[#2d3748] text-slate-300 border border-[#2d3748] hover:border-slate-500 transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => onFetchSectors(period, tailLength)}
            className="text-xs px-2.5 py-1 rounded-md bg-indigo-900/40 hover:bg-indigo-800/40 text-indigo-300 border border-indigo-800 transition-colors"
          >
            Nifty Sectors
          </button>
        </div>
      </div>

      {/* Benchmark */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Benchmark</label>
        <select
          value={benchmark}
          onChange={e => handleBenchmarkChange(e.target.value)}
          className="w-full bg-[#1e2536] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          {BENCHMARKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>

        {CONSTITUENT_SUPPORTED.has(benchmark) && (
          <button
            onClick={() => handleLoadConstituents(benchmark)}
            disabled={loading || loadingConstits}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/50 disabled:opacity-50 text-indigo-300 border border-indigo-800 hover:border-indigo-600 transition-colors"
          >
            {loadingConstits
              ? <><span className="animate-spin w-3 h-3 border border-indigo-300/30 border-t-indigo-300 rounded-full inline-block" />Loading…</>
              : <>⊕ Load All {benchmarkLabel} Constituents</>
            }
          </button>
        )}
      </div>

      {/* Period */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Period</label>
        <div className="grid grid-cols-4 gap-1">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`text-xs py-1.5 rounded-md border transition-colors ${
                period === p.value
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-[#1e2536] border-[#2d3748] text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trail */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Trail Length</label>
        <div className="flex gap-1">
          {TRAIL_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => setTailLength(t.value)}
              className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                tailLength === t.value
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-[#1e2536] border-[#2d3748] text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Symbol editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Symbols
            <span className="text-slate-600 normal-case font-normal ml-1">
              {initialized ? `(${symbols.length}/60)` : ''}
            </span>
          </label>
          {symbols.length > 0 && (
            <button
              onClick={() => setSymbols([])}
              className="text-xs text-slate-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Add symbol input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSymbol()}
            placeholder="e.g. SBIN.NS"
            className="flex-1 bg-[#1e2536] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={addSymbol}
            className="px-3 py-2 rounded-lg bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-slate-300 text-sm"
          >
            ＋
          </button>
        </div>

        {/* Symbol tags */}
        <div className="flex flex-wrap gap-1.5 mt-2 max-h-40 overflow-y-auto pr-0.5">
          {loadingConstits && !initialized ? (
            <span className="text-xs text-slate-600 italic">Loading constituents…</span>
          ) : symbols.length === 0 ? (
            <span className="text-xs text-slate-600 italic">No symbols — add one above or load constituents</span>
          ) : symbols.map(s => (
            <span
              key={s}
              className="flex items-center gap-1 text-xs bg-[#1e2536] border border-[#2d3748] text-slate-300 px-2 py-0.5 rounded-md group"
            >
              {s.replace('.NS','').replace('.BO','')}
              <button
                onClick={() => removeSymbol(s)}
                className="text-slate-600 hover:text-red-400 transition-colors ml-0.5"
                title={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={() => symbols.length && onFetch({ symbols, benchmark, period, tail_length: tailLength })}
        disabled={loading || !symbols.length}
        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-indigo-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading
          ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />Fetching…</>
          : '⟳  Generate RRG'
        }
      </button>
    </div>
  )
}
