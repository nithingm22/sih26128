// Priority indicator reused across Deadline/Reminder/Task cards and
// the Case Detail action form. Same visual language as RiskBadge
// (dot + label) since "priority" and "risk" both read as severity.
const PRIORITY_STYLES = {
  high: { label: 'High', dot: 'bg-risk-high', text: 'text-risk-high', bg: 'bg-risk-high/10' },
  medium: {
    label: 'Medium',
    dot: 'bg-risk-medium',
    text: 'text-risk-medium',
    bg: 'bg-risk-medium/10',
  },
  low: { label: 'Low', dot: 'bg-risk-low', text: 'text-risk-low', bg: 'bg-risk-low/10' },
}

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  )
}
