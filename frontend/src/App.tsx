import { useEffect } from 'react'
import RRGChart       from './components/RRGChart'
import ControlPanel   from './components/ControlPanel'
import SecuritiesTable from './components/SecuritiesTable'
import QuadrantLegend  from './components/QuadrantLegend'
import { useRRG } from './hooks/useRRG'
import { NIFTY_PRESETS } from './types'

export default function App() {
  const { data, loading, error, fetch, fetchSectors } = useRRG()

  // Load default on mount
  useEffect(() => {
    fetch({
      symbols: NIFTY_PRESETS['Nifty Top 10'],
      benchmark: '^NSEI',
      period: '1y',
      tail_length: 5,
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">

      {/* Header */}
      <header className="border-b border-[#1f2937] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-none">Relative Rotation Graph</h1>
            <p className="text-xs text-slate-500 mt-0.5">Sector & stock momentum vs benchmark</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {data && (
            <span>
              Last updated: {new Date(data.generated_at).toLocaleTimeString()}
              <span className="mx-2 text-slate-700">·</span>
              Benchmark: <span className="text-slate-300">{data.benchmark}</span>
            </span>
          )}
          <span className="px-2 py-1 rounded-md bg-emerald-900/30 text-emerald-400 border border-emerald-900 text-xs">
            Live Data
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-[#1f2937] p-4 overflow-y-auto flex flex-col gap-5">
          <ControlPanel onFetch={fetch} onFetchSectors={fetchSectors} loading={loading} />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quadrant Guide</p>
            <QuadrantLegend />
          </div>
          <div className="mt-auto pt-4 border-t border-[#1f2937]">
            <p className="text-xs text-slate-600 leading-relaxed">
              RRG uses <span className="text-slate-500">JdK RS-Ratio</span> and <span className="text-slate-500">RS-Momentum</span> with a 10-week smoothing period.
              Securities rotate <span className="text-slate-500">clockwise</span> through quadrants.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Chart area */}
          <div className="flex-1 p-4 min-h-0">
            <div className="card h-full relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#111827]/80 rounded-xl z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Fetching market data…</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="text-red-400 font-medium mb-1">Failed to load</p>
                    <p className="text-slate-500 text-sm">{error}</p>
                  </div>
                </div>
              )}
              {data && !error ? (
                <RRGChart data={data} />
              ) : !loading && !error ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                  Configure symbols and click Generate RRG
                </div>
              ) : null}
            </div>
          </div>

          {/* Table */}
          {data && (
            <div className="border-t border-[#1f2937] mx-4 mb-4">
              <div className="card mt-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Securities — {data.securities.length} symbols
                  </p>
                  <div className="flex gap-2 text-xs text-slate-600">
                    <span className="text-emerald-500">{data.securities.filter(s => s.quadrant === 'Leading').length} Leading</span>
                    <span>·</span>
                    <span className="text-amber-500">{data.securities.filter(s => s.quadrant === 'Weakening').length} Weakening</span>
                    <span>·</span>
                    <span className="text-red-500">{data.securities.filter(s => s.quadrant === 'Lagging').length} Lagging</span>
                    <span>·</span>
                    <span className="text-blue-500">{data.securities.filter(s => s.quadrant === 'Improving').length} Improving</span>
                  </div>
                </div>
                <SecuritiesTable securities={data.securities} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
