import { useState, useEffect, useMemo } from 'react'
import Plot from './PlotWrapper'
import { getAllSectorRRG } from '../api/rrg'
import type { RRGResponse, RRGSecurity } from '../types'
import { QUADRANT_COLORS, SECTOR_GROUP_COLORS, PERIODS } from '../types'

const ALL_GROUPS = 'All Groups'

function calcSpread(values: number[], pad = 1.5) {
  if (!values.length) return 5
  const min = Math.min(...values)
  const max = Math.max(...values)
  return Math.ceil(Math.max(3, Math.max(100 - min, max - 100) + pad))
}

export default function SectorComparison() {
  const [data,         setData]         = useState<RRGResponse | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [period,       setPeriod]       = useState('1y')
  const [tailLength,   setTailLength]   = useState(5)
  const [activeGroup,  setActiveGroup]  = useState(ALL_GROUPS)
  const [xSpread,      setXSpread]      = useState(5)
  const [ySpread,      setYSpread]      = useState(5)

  const load = async (p: string, t: number) => {
    setLoading(true); setError(null)
    try   { setData(await getAllSectorRRG(p, t)) }
    catch (e: any) { setError(e?.response?.data?.detail || 'Failed to load sector data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load(period, tailLength) }, [])

  const groups = data
    ? [ALL_GROUPS, ...Array.from(new Set(data.securities.map(s => s.group ?? 'Other')))]
    : [ALL_GROUPS]

  const filtered: RRGSecurity[] = data
    ? (activeGroup === ALL_GROUPS ? data.securities : data.securities.filter(s => s.group === activeGroup))
    : []

  const autoSpread = useMemo(() => {
    const ratios    = filtered.flatMap(s => s.tail.map(p => p.rs_ratio))
    const momentums = filtered.flatMap(s => s.tail.map(p => p.rs_momentum))
    return { x: calcSpread(ratios), y: calcSpread(momentums) }
  }, [filtered])

  // Reset when new data or group filter changes
  useEffect(() => {
    setXSpread(autoSpread.x)
    setYSpread(autoSpread.y)
  }, [autoSpread.x, autoSpread.y])

  const rMin = 100 - xSpread
  const rMax = 100 + xSpread
  const mMin = 100 - ySpread
  const mMax = 100 + ySpread

  // Build Plotly traces
  const traces: Plotly.Data[] = []
  if (data) {
    filtered.forEach(sec => {
      const qColor  = QUADRANT_COLORS[sec.quadrant]
      const grpColor = SECTOR_GROUP_COLORS[sec.group ?? ''] ?? qColor.dot
      const xs = sec.tail.map(p => p.rs_ratio)
      const ys = sec.tail.map(p => p.rs_momentum)

      // Trail line
      traces.push({ x: xs, y: ys, mode: 'lines', line: { color: grpColor + '55', width: 1.5, dash: 'dot' }, showlegend: false, hoverinfo: 'skip' } as any)

      // Faded past dots
      traces.push({ x: xs.slice(0,-1), y: ys.slice(0,-1), mode: 'markers', marker: { color: grpColor + '44', size: 4 }, showlegend: false, hoverinfo: 'skip' } as any)

      // Current dot
      traces.push({
        x: [sec.current_rs_ratio],
        y: [sec.current_rs_momentum],
        mode: 'markers+text',
        name: sec.name ?? sec.symbol,
        text: [sec.name ?? sec.symbol],
        textposition: 'top center',
        textfont: { color: grpColor, size: 10, family: 'Inter' },
        marker: { color: grpColor, size: 13, line: { color: '#0b0f19', width: 2 } },
        customdata: [[sec.group, sec.quadrant, sec.current_rs_ratio, sec.current_rs_momentum]],
        hovertemplate:
          `<b>${sec.name ?? sec.symbol}</b><br>` +
          'Group: %{customdata[0]}<br>' +
          'Quadrant: <b>%{customdata[1]}</b><br>' +
          'RS-Ratio: %{customdata[2]:.2f}<br>' +
          'RS-Momentum: %{customdata[3]:.2f}<extra></extra>',
      } as any)
    })
  }

  const layout: Partial<Plotly.Layout> = {
    paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
    font: { family: 'Inter', color: '#94a3b8' },
    margin: { t: 10, r: 15, b: 45, l: 50 },
    xaxis: { title: { text: 'RS-Ratio →', font: { color: '#64748b', size: 11 } }, range: [rMin, rMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    yaxis: { title: { text: 'RS-Momentum →', font: { color: '#64748b', size: 11 } }, range: [mMin, mMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    shapes: [
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: rMax, y0: 100, y1: mMax,  fillcolor: 'rgba(16,185,129,0.06)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: rMax, y0: mMin, y1: 100,  fillcolor: 'rgba(245,158,11,0.06)', line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: rMin, x1: 100, y0: mMin, y1: 100,  fillcolor: 'rgba(239,68,68,0.06)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: rMin, x1: 100, y0: 100, y1: mMax,  fillcolor: 'rgba(59,130,246,0.06)', line: { width: 0 }, layer: 'below' },
      { type: 'line', xref: 'x', yref: 'y', x0: 100, x1: 100, y0: mMin, y1: mMax,  line: { color: '#374151', width: 1, dash: 'dash' } },
      { type: 'line', xref: 'x', yref: 'y', x0: rMin, x1: rMax, y0: 100, y1: 100,  line: { color: '#374151', width: 1, dash: 'dash' } },
    ],
    annotations: [
      { xref: 'paper', yref: 'paper', x: 0.98, y: 0.98, text: 'LEADING',   showarrow: false, font: { color: 'rgba(16,185,129,0.35)',  size: 12 }, xanchor: 'right', yanchor: 'top'    },
      { xref: 'paper', yref: 'paper', x: 0.98, y: 0.02, text: 'WEAKENING', showarrow: false, font: { color: 'rgba(245,158,11,0.35)', size: 12 }, xanchor: 'right', yanchor: 'bottom' },
      { xref: 'paper', yref: 'paper', x: 0.02, y: 0.02, text: 'LAGGING',   showarrow: false, font: { color: 'rgba(239,68,68,0.35)',  size: 12 }, xanchor: 'left',  yanchor: 'bottom' },
      { xref: 'paper', yref: 'paper', x: 0.02, y: 0.98, text: 'IMPROVING', showarrow: false, font: { color: 'rgba(59,130,246,0.35)', size: 12 }, xanchor: 'left',  yanchor: 'top'    },
    ],
    showlegend: false,
    hoverlabel: { bgcolor: '#1e2536', bordercolor: '#374151', font: { family: 'Inter', color: '#e2e8f0', size: 12 } },
  }

  const summary = data?.quadrant_summary

  return (
    <div className="flex flex-col gap-3 p-4">

      {/* Top bar: controls + quadrant summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Period:</span>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button key={p.value} onClick={() => { setPeriod(p.value); load(p.value, tailLength) }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${period === p.value ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1e2536] border-[#2d3748] text-slate-400 hover:border-slate-500'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {/* Trail */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Trail:</span>
            <input type="range" min={3} max={12} value={tailLength}
              onChange={e => setTailLength(Number(e.target.value))}
              onMouseUp={() => load(period, tailLength)}
              className="w-24 accent-indigo-500" />
            <span className="text-xs text-slate-400 w-6">{tailLength}w</span>
          </div>
          {/* Refresh */}
          <button onClick={() => load(period, tailLength)} disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white transition-colors flex items-center gap-1.5">
            {loading ? <span className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full inline-block"/> : '⟳'}
            Refresh
          </button>
        </div>

        {/* Quadrant summary pills */}
        {summary && (
          <div className="flex gap-2">
            {[
              { label: 'Leading',   count: summary.leading,   color: 'text-emerald-400 bg-emerald-900/30 border-emerald-800' },
              { label: 'Improving', count: summary.improving, color: 'text-blue-400 bg-blue-900/30 border-blue-800'         },
              { label: 'Weakening', count: summary.weakening, color: 'text-amber-400 bg-amber-900/30 border-amber-800'       },
              { label: 'Lagging',   count: summary.lagging,   color: 'text-red-400 bg-red-900/30 border-red-800'             },
            ].map(q => (
              <div key={q.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${q.color}`}>
                <span className="text-base leading-none font-bold">{q.count}</span>
                <span className="opacity-70">{q.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {groups.map(g => {
          const color = SECTOR_GROUP_COLORS[g]
          const isActive = activeGroup === g
          return (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${isActive ? 'text-white border-transparent' : 'bg-[#1e2536] text-slate-400 border-[#2d3748] hover:border-slate-500'}`}
              style={isActive ? { background: color ?? '#6366f1', borderColor: color ?? '#6366f1' } : {}}>
              {g}
            </button>
          )
        })}
      </div>

      {/* Chart — always half the viewport height */}
      <div className="card h-[50vh] min-h-[360px] flex-shrink-0 relative flex flex-col">
        {/* Axis range sliders */}
        <div className="flex items-center gap-5 px-1 pt-1 pb-1 flex-shrink-0">
          {/* X-axis */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-slate-500 whitespace-nowrap">X-Axis ±</span>
            <input
              type="range" min={2} max={20} step={0.5} value={xSpread}
              onChange={e => setXSpread(Number(e.target.value))}
              className="flex-1 accent-indigo-500 h-1"
            />
            <span className="text-xs font-mono text-slate-400 w-14 text-right">
              [{(100 - xSpread).toFixed(1)}, {(100 + xSpread).toFixed(1)}]
            </span>
          </div>
          {/* Y-axis */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-slate-500 whitespace-nowrap">Y-Axis ±</span>
            <input
              type="range" min={2} max={20} step={0.5} value={ySpread}
              onChange={e => setYSpread(Number(e.target.value))}
              className="flex-1 accent-indigo-500 h-1"
            />
            <span className="text-xs font-mono text-slate-400 w-14 text-right">
              [{(100 - ySpread).toFixed(1)}, {(100 + ySpread).toFixed(1)}]
            </span>
          </div>
          {/* Reset */}
          {(xSpread !== autoSpread.x || ySpread !== autoSpread.y) && (
            <button
              onClick={() => { setXSpread(autoSpread.x); setYSpread(autoSpread.y) }}
              className="text-xs px-2.5 py-1 rounded-md bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap">
              ↺ Auto-fit
            </button>
          )}
        </div>

        {/* Plot area */}
        <div className="flex-1 min-h-0 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111827]/80 rounded-xl z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"/>
                <p className="text-sm text-slate-400">Fetching all sector data…</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {filtered.length > 0 && (
            <Plot data={traces} layout={layout} config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }} useResizeHandler />
          )}
        </div>
      </div>

      {/* Sector table */}
      {filtered.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f2937]">
                {['Sector','Group','Quadrant','RS-Ratio','RS-Momentum'].map(h => (
                  <th key={h} className={`py-2 px-3 font-semibold text-slate-500 uppercase tracking-wider ${['RS-Ratio','RS-Momentum'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...filtered]
                .sort((a,b) => ['Leading','Improving','Weakening','Lagging'].indexOf(a.quadrant) - ['Leading','Improving','Weakening','Lagging'].indexOf(b.quadrant))
                .map(sec => (
                <tr key={sec.symbol} className="border-b border-[#1f2937]/50 hover:bg-[#1e2536]/50 transition-colors">
                  <td className="py-2 px-3 font-medium text-slate-200">{sec.name ?? sec.symbol}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: (SECTOR_GROUP_COLORS[sec.group ?? ''] ?? '#6366f1') + '22', color: SECTOR_GROUP_COLORS[sec.group ?? ''] ?? '#6366f1' }}>
                      {sec.group ?? '—'}
                    </span>
                  </td>
                  <td className="py-2 px-3"><span className={`badge badge-${sec.quadrant.toLowerCase()}`}>{sec.quadrant}</span></td>
                  <td className={`py-2 px-3 text-right font-mono ${sec.current_rs_ratio >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>{sec.current_rs_ratio.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-right font-mono ${sec.current_rs_momentum >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>{sec.current_rs_momentum.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
