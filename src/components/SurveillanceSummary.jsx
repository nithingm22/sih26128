import { ClipboardList, AlertTriangle, Activity, MapPinned } from 'lucide-react'

const STATS = [
  { key: 'total', label: 'Total Cases', icon: ClipboardList, tone: 'default' },
  { key: 'highRisk', label: 'High Risk', icon: AlertTriangle, tone: 'risk' },
  { key: 'activeUnderReview', label: 'Active / Under Review', icon: Activity, tone: 'accent' },
  { key: 'districtsAffected', label: 'Districts Affected', icon: MapPinned, tone: 'default' },
]

const TONE_STYLES = {
  default: 'bg-primary/10 text-primary',
  risk: 'bg-risk-high/10 text-risk-high',
  accent: 'bg-accent-blue/10 text-accent-blue',
}

// Compact stat grid for the Map page — same visual language as the
// Dashboard's StatCard, condensed to fit alongside the map.
export default function SurveillanceSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map(({ key, label, icon: Icon, tone }) => (
        <div
          key={key}
          className="bg-surface border border-border rounded-card p-3.5"
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-control mb-2 ${TONE_STYLES[tone]}`}
          >
            <Icon size={16} />
          </div>
          <p className="text-2xl font-bold text-ink tabular-nums leading-tight">
            {summary[key]}
          </p>
          <p className="text-[11px] font-medium text-steel mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
