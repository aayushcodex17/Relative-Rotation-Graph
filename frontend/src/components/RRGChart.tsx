import Plot from 'react-plotly.js'
import type { RRGResponse } from '../types'
import { QUADRANT_COLORS } from '../types'
import { useMemo } from 'react'

interface Props { data: RRGResponse }

export default function RRGChart({ data }: Props) {
  const { traces, axisRange } = useMemo(() => {
    const allRatio    = data.securities.flatMap(s => s.tail.map(p => p.rs_ratio))
    const allMomentum = data.securities.flatMap(s => s.tail.map(p => p.rs_momentum))
    const pad = 1.5
    const rMin = Math.min(98, Math.min(...allRatio)    - pad)
    const rMax = Math.max(102, Math.max(...allRatio)   + pad)
    const mMin = Math.min(98, Math.min(...allMomentum) - pad)
    const mMax = Math.max(102, Math.max(...allMomentum) + pad)

    const traces: Plotly.Data[] = []
    data.securities.forEach(sec => {
      const color = QUADRANT_COLORS[sec.quadrant]
      const xs = sec.tail.map(p => p.rs_ratio)
      const ys = sec.tail.map(p => p.rs_momentum)

      traces.push({ x: xs, y: ys, mode: 'lines', line: { color: color.trail, width: 1.5, dash: 'dot' }, showlegend: false, hoverinfo: 'skip' } as any)
      traces.push({ x: xs.slice(0,-1), y: ys.slice(0,-1), mode: 'markers', marker: { color: color.trail, size: 5 }, showlegend: false, hoverinfo: 'skip' } as any)
      traces.push({
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

    return { traces, axisRange: { rMin, rMax, mMin, mMax } }
  }, [data])

  const layout: Partial<Plotly.Layout> = {
    paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
    font: { family: 'Inter', color: '#94a3b8' },
    margin: { t: 20, r: 20, b: 50, l: 55 },
    xaxis: { title: { text: 'RS-Ratio →', font: { color: '#64748b', size: 12 } }, range: [axisRange.rMin, axisRange.rMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    yaxis: { title: { text: 'RS-Momentum →', font: { color: '#64748b', size: 12 } }, range: [axisRange.mMin, axisRange.mMax], gridcolor: '#1e2536', tickfont: { color: '#64748b', size: 10 }, showline: false },
    shapes: [
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: axisRange.rMax, y0: 100,            y1: axisRange.mMax, fillcolor: 'rgba(16,185,129,0.07)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: 100, x1: axisRange.rMax, y0: axisRange.mMin, y1: 100,            fillcolor: 'rgba(245,158,11,0.07)', line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: axisRange.rMin, x1: 100, y0: axisRange.mMin, y1: 100,            fillcolor: 'rgba(239,68,68,0.07)',  line: { width: 0 }, layer: 'below' },
      { type: 'rect', xref: 'x', yref: 'y', x0: axisRange.rMin, x1: 100, y0: 100,            y1: axisRange.mMax, fillcolor: 'rgba(59,130,246,0.07)',  line: { width: 0 }, layer: 'below' },
      { type: 'line', xref: 'x', yref: 'y', x0: 100, x1: 100, y0: axisRange.mMin, y1: axisRange.mMax, line: { color: '#374151', width: 1, dash: 'dash' } },
      { type: 'line', xref: 'x', yref: 'y', x0: axisRange.rMin, x1: axisRange.rMax, y0: 100, y1: 100, line: { color: '#374151', width: 1, dash: 'dash' } },
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

  return (
    <Plot
      data={traces} layout={layout}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
