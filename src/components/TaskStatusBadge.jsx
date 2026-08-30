// Status badge shared by Deadlines and Tasks. 'overdue' is always a
// COMPUTED value (see getDeadlineStatus/getTaskStatus in mockData.js)
// — never something written directly by a form — so this component
// only ever renders it, never lets it be selected.
const TASK_STATUS_STYLES = {
  pending: { label: 'Pending', text: 'text-steel', bg: 'bg-steel/10' },
  in_progress: { label: 'In Progress', text: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  completed: { label: 'Completed', text: 'text-risk-low', bg: 'bg-risk-low/10' },
  overdue: { label: 'Overdue', text: 'text-risk-high', bg: 'bg-risk-high/10' },
}

export default function TaskStatusBadge({ status }) {
  const style = TASK_STATUS_STYLES[status] ?? TASK_STATUS_STYLES.pending

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-control text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  )
}
