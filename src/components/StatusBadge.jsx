// Status labels/colors match the locked API contract's Case.status
// enum exactly: reported | ai_assessed | vet_review | field_visit |
// lab_pending | confirmed | negative | inconclusive | closed.
const STATUS_STYLES = {
  reported: { label: 'Reported', text: 'text-steel', bg: 'bg-steel/10' },
  ai_assessed: { label: 'AI Assessed', text: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  vet_review: { label: 'Vet Review', text: 'text-primary', bg: 'bg-primary/10' },
  field_visit: { label: 'Field Visit', text: 'text-risk-medium', bg: 'bg-risk-medium/10' },
  lab_pending: { label: 'Lab Pending', text: 'text-cluster', bg: 'bg-cluster/10' },
  confirmed: { label: 'Confirmed', text: 'text-risk-low', bg: 'bg-risk-low/10' },
  negative: { label: 'Negative', text: 'text-risk-low', bg: 'bg-risk-low/10' },
  inconclusive: { label: 'Inconclusive', text: 'text-risk-medium', bg: 'bg-risk-medium/10' },
  closed: { label: 'Closed', text: 'text-steel', bg: 'bg-steel/10' },
}

// Exported so filter UIs (e.g. Case List's status filter) can reuse
// the same labels instead of maintaining a second copy that could
// drift out of sync with the badge itself.
export const STATUS_LABELS = Object.fromEntries(
  Object.entries(STATUS_STYLES).map(([key, style]) => [key, style.label]),
)

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.reported

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-control text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  )
}
