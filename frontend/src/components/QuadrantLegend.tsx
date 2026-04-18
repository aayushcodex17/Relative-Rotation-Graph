const quadrants = [
  { name: 'Leading',   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  desc: 'Outperforming + momentum rising'    },
  { name: 'Weakening', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'Outperforming + momentum fading'    },
  { name: 'Lagging',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  desc: 'Underperforming + momentum falling'  },
  { name: 'Improving', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'Underperforming + momentum rising'   },
]

export default function QuadrantLegend() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {quadrants.map(q => (
        <div key={q.name} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: q.bg }}>
          <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: q.color }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: q.color }}>{q.name}</p>
            <p className="text-xs text-slate-500 leading-tight">{q.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
