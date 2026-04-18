import type { RRGSecurity } from '../types'

interface Props { securities: RRGSecurity[] }

const ICON: Record<string, string> = { Leading: '▲', Weakening: '▼', Lagging: '▼', Improving: '▲' }

export default function SecuritiesTable({ securities }: Props) {
  const sorted = [...securities].sort((a, b) =>
    ['Leading','Improving','Weakening','Lagging'].indexOf(a.quadrant) - ['Leading','Improving','Weakening','Lagging'].indexOf(b.quadrant)
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1f2937]">
            {['Symbol','Quadrant','RS-Ratio','RS-Momentum'].map(h => (
              <th key={h} className={`py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h.startsWith('RS') ? 'text-right' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(sec => (
            <tr key={sec.symbol} className="border-b border-[#1f2937]/50 hover:bg-[#1e2536]/50 transition-colors">
              <td className="py-2.5 px-3 font-medium text-slate-200">
                {sec.name ?? sec.symbol.replace('.NS','').replace('.BO','')}
                {sec.name && <div className="text-xs text-slate-500">{sec.symbol}</div>}
              </td>
              <td className="py-2.5 px-3">
                <span className={`badge badge-${sec.quadrant.toLowerCase()}`}>{ICON[sec.quadrant]} {sec.quadrant}</span>
              </td>
              <td className={`py-2.5 px-3 text-right font-mono text-sm ${sec.current_rs_ratio >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>{sec.current_rs_ratio.toFixed(2)}</td>
              <td className={`py-2.5 px-3 text-right font-mono text-sm ${sec.current_rs_momentum >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>{sec.current_rs_momentum.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
