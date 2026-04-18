import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { BENCHMARKS, PERIODS, NIFTY_PRESETS } from '../types'
import type { RRGRequest } from '../types'

interface Props {
  onFetch:        (req: RRGRequest) => void
  onFetchSectors: (period: string, tail: number) => void
  loading:        boolean
}

export default function ControlPanel({ onFetch, onFetchSectors, loading }: Props) {
  const [symbols,    setSymbols]    = useState<string[]>(['RELIANCE.NS','TCS.NS','HDFCBANK.NS','INFY.NS','ICICIBANK.NS'])
  const [input,      setInput]      = useState('')
  const [benchmark,  setBenchmark]  = useState('^NSEI')
  const [period,     setPeriod]     = useState('1y')
  const [tailLength, setTailLength] = useState(5)

  const addSymbol = () => {
    const s = input.trim().toUpperCase()
    if (s && !symbols.includes(s) && symbols.length < 20) { setSymbols(p => [...p, s]); setInput('') }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(NIFTY_PRESETS).map(([label, syms]) => (
            <button key={label} onClick={() => setSymbols(syms)} className="text-xs px-2.5 py-1 rounded-md bg-[#1e2536] hover:bg-[#2d3748] text-slate-300 border border-[#2d3748] hover:border-slate-500 transition-colors">{label}</button>
          ))}
          <button onClick={() => onFetchSectors(period, tailLength)} className="text-xs px-2.5 py-1 rounded-md bg-indigo-900/40 hover:bg-indigo-800/40 text-indigo-300 border border-indigo-800 transition-colors">Nifty Sectors</button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Benchmark</label>
        <select value={benchmark} onChange={e => setBenchmark(e.target.value)} className="w-full bg-[#1e2536] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
          {BENCHMARKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Period</label>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full bg-[#1e2536] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
            {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Trail — {tailLength}w</label>
          <input type="range" min={3} max={12} value={tailLength} onChange={e => setTailLength(Number(e.target.value))} className="w-full mt-2 accent-indigo-500" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Symbols <span className="text-slate-600 normal-case font-normal">({symbols.length}/20)</span></label>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSymbol()} placeholder="e.g. SBIN.NS" className="flex-1 bg-[#1e2536] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
          <button onClick={addSymbol} className="px-3 py-2 rounded-lg bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-slate-300 text-sm">＋</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2 max-h-28 overflow-y-auto">
          {symbols.map(s => (
            <span key={s} className="flex items-center gap-1 text-xs bg-[#1e2536] border border-[#2d3748] text-slate-300 px-2 py-0.5 rounded-md">
              {s}<button onClick={() => setSymbols(p => p.filter(x => x !== s))} className="text-slate-500 hover:text-red-400 ml-0.5">×</button>
            </span>
          ))}
        </div>
      </div>

      <button onClick={() => symbols.length && onFetch({ symbols, benchmark, period, tail_length: tailLength })} disabled={loading || !symbols.length} className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-indigo-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
        {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"/>Fetching…</> : '⟳  Generate RRG'}
      </button>
    </div>
  )
}
