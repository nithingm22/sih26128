// Single source of truth for risk color semantics — reused across
// Dashboard, Case List, Case Detail, and (later) the Map and charts.
// Only low/medium/high exist per the approved design system; a
// "critical" tier is intentionally not added here since it isn't
// part of the locked API contract (Case.status / vet_urgency).
const RISK_STYLES = {
  low: { label: 'Low risk', dot: 'bg-risk-low', text: 'text-risk-low', bg: 'bg-risk-low/10' },
  medium: {
    label: 'Medium risk',
    dot: 'bg-risk-medium',
    text: 'text-risk-medium',
    bg: 'bg-risk-medium/10',
  },
  high: { label: 'High risk', dot: 'bg-risk-high', text: 'text-risk-high', bg: 'bg-risk-high/10' },
}

export default function RiskBadge({ level, percent }) {
  const style = RISK_STYLES[level] ?? RISK_STYLES.low

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
      {typeof percent === 'number' && <span className="opacity-70">· {percent}%</span>}
    </span>
  )
}
