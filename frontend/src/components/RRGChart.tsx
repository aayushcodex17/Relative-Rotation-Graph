import Plot from './PlotWrapper'
import type { RRGResponse, RRGSecurity } from '../types'
import { QUADRANT_COLORS } from '../types'
import { useMemo, useState, useEffect } from 'react'

interface Props { data: RRGResponse }

type Quadrant = RRGSecurity['quadrant']
const ALL_QUADRANTS: Quadrant[] = ['Leading', 'Weakening', 'Lagging', 'Improving']

function calcSpread(values: number[], pad = 1.5) {
  if (!values.length) return 5
  const min = Math.min(...values)
  const max = Math.max(...values)
  return Math.ceil(Math.max(3, Math.max(100 - min, max - 100) + pad))
}

export default function RRGChart({ data }: Props) {
  const [activeQuadrants, setActiveQuadrants] = useState<Set<Quadrant>>(new Set(ALL_QUADRANTS))

  const toggleQuadrant = (q: Quadrant) => {
    setActiveQuadrants(prev => {
      const next = new Set(prev)
      if (next.has(q)) {
        if (next.size === 1) return prev // keep at least one active
        next.delete(q)
      } else {
        next.add(q)
      }
      return next
    })
  }

  const visibleSecurities = useMemo(
    () => data.securities.filter(s => activeQuadrants.has(s.quadrant)),
    [data.securities, activeQuadrants]
  )

  const autoSpread = useMemo(() => {
    const ratios    = data.securities.flatMap(s => s.tail.map(p => p.rs_ratio))
    const momentums = data.securities.flatMap(s => s.tail.map(p => p.rs_momentum))
    return { x: calcSpread(ratios), y: calcSpread(momentums) }
  }, [data])

  const [xSpread, setXSpread] = useState(autoSpread.x)
  const [ySpread, setYSpread] = useState(autoSpread.y)

  // Reset when new data arrives
  useEffect(() => {
    setXSpread(autoSpread.x)
    setYSpread(autoSpread.y)
  }, [autoSpread.x, autoSpread.y])

  const rMin = 100 - xSpread
  const rMax = 100 + xSpread
  const mMin = 100 - ySpread
  const mMax = 100 + ySpread

  const traces = useMemo<Plotly.Data[]>(() => {
    const t: Plotly.Data[] = []
    visibleSecurities.forEach(sec => {
      const color = QUADRANT_COLORS[sec.quadrant]
      const xs = sec.tail.map(p => p.rs_ratio)
      const ys = sec.tail.map(p => p.rs_momentum)
      t.push({ x: xs, y: ys, mode: 'lines', line: { color: color.trail, width: 1.5, dash: 'dot' }, showlegend: false, hoverinfo: 'skip' } as any)
      t.push({ x: xs.slice(0,-1), y: ys.slice(0,-1), mode: 'markers', marker: { color: color.trail, size: 5 }, showlegend: false, hoverinfo: 'skip' } as any)
      t.push({
        x: [sec.current_rs_ratio], y: [sec.current_rs_momentum],
        mode: 'markers+text',
        name: sec.name ?? sec.symbol,
        text: [sec.name ?? sec.symbol.replace('.NS','').replace('.BO','')],
        textposition: 'top center',
        textfont: { color: color.dot, size: 11, family: 'Inter' },
        marker: { color: color.dot, size: 12, line: { color: '#0b0f19', width: 2 } },
        customdata: [[sec.symbol, sec.quadrant, sec.current_rs_ratio, sec.current_rs_momentum]],
        hovertemplate: '<b>%{text}</b><br>Quadrant: %{customdata[1]}<br>RS-Ratio: %{customdata[2]:.2f}<br>RS-Momentum: %{customdata[3]:.2f}<extra></extra>',
      } as any)
    })
    return t
  }, [visibleSecurities])

  const layout: Partial<Plotly.Layout> = {
    paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
    font: { family: 'Inter', color: '#94a3b8' },
    margin: { t: 10, r: 20, b: 50, l: 55 },
    xaxis: { title: { text: 'RS-Ratio →', font: { color: '#64748b', size: 12 } }, range: [rMin, rMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    yaxis: { title: { text: 'RS-Momentum →', font: { color: '#64748b', size: 12 } }, range: [mMin, mMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    shapes: [
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: rMax, y0: 100, y1: mMax, fillcolor: 'rgba(16,185,129,0.07)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: rMax, y0: mMin, y1: 100, fillcolor: 'rgba(245,158,11,0.07)', line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: rMin, x1: 100, y0: mMin, y1: 100, fillcolor: 'rgba(239,68,68,0.07)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: rMin, x1: 100, y0: 100, y1: mMax, fillcolor: 'rgba(59,130,246,0.07)', line: { width: 0 }, layer: 'below' },
      { type: 'line', xref: 'x', yref: 'y', x0: 100, x1: 100, y0: mMin, y1: mMax, line: { color: '#374151', width: 1, dash: 'dash' } },
      { type: 'line', xref: 'x', yref: 'y', x0: rMin, x1: rMax, y0: 100, y1: 100, line: { color: '#374151', width: 1, dash: 'dash' } },
    ],
    annotations: [
      { xref: 'paper', yref: 'paper', x: 0.98, y: 0.98, text: 'LEADING',   showarrow: false, font: { color: 'rgba(16,185,129,0.4)',  size: 13 }, xanchor: 'right', yanchor: 'top'    },
      { xref: 'paper', yref: 'paper', x: 0.98, y: 0.02, text: 'WEAKENING', showarrow: false, font: { color: 'rgba(245,158,11,0.4)', size: 13 }, xanchor: 'right', yanchor: 'bottom' },
      { xref: 'paper', yref: 'paper', x: 0.02, y: 0.02, text: 'LAGGING',   showarrow: false, font: { color: 'rgba(239,68,68,0.4)',  size: 13 }, xanchor: 'left',  yanchor: 'bottom' },
      { xref: 'paper', yref: 'paper', x: 0.02, y: 0.98, text: 'IMPROVING', showarrow: false, font: { color: 'rgba(59,130,246,0.4)', size: 13 }, xanchor: 'left',  yanchor: 'top'    },
    ],
    showlegend: false,
    hoverlabel: { bgcolor: '#1e2536', bordercolor: '#374151', font: { family: 'Inter', color: '#e2e8f0', size: 12 } },
  }

  const isModified = xSpread !== autoSpread.x || ySpread !== autoSpread.y

  return (
    <div className="flex flex-col h-full gap-2">

      {/* Quadrant filter */}
      <div className="flex items-center gap-2 px-1 pt-1">
        <span className="text-xs text-slate-500 whitespace-nowrap">Show:</span>
        {ALL_QUADRANTS.map(q => {
          const color = QUADRANT_COLORS[q]
          const active = activeQuadrants.has(q)
          return (
            <button
              key={q}
              onClick={() => toggleQuadrant(q)}
              style={active ? { borderColor: color.dot, color: color.dot, backgroundColor: color.bg } : {}}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                active
                  ? 'font-medium'
                  : 'border-[#2d3748] text-slate-600 bg-transparent line-through'
              }`}
            >
              {q}
            </button>
          )
        })}
      </div>

      {/* Axis range sliders */}
      <div className="flex items-center gap-5 px-1">
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

        {/* Reset to auto-fit */}
        {isModified && (
          <button
            onClick={() => { setXSpread(autoSpread.x); setYSpread(autoSpread.y) }}
            className="text-xs px-2.5 py-1 rounded-md bg-[#1e2536] hover:bg-[#2d3748] border border-[#2d3748] text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            ↺ Auto-fit
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <Plot
          data={traces} layout={layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  )
}
