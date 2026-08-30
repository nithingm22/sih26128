import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import TaskStatusBadge from './TaskStatusBadge'
import { getVetName } from '../services/mockData'

function formatDueDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

// Compact row for a single deadline — used on the Dashboard
// ("Upcoming Deadlines"), the Calendar page's day-details panel, and
// Case Detail's Actions section. `status` on the deadline object is
// always the already-computed value from getDeadlines()/getDeadlineById,
// so this component never re-derives it.
export default function DeadlineCard({ deadline }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-control border ${
        deadline.status === 'overdue'
          ? 'border-risk-high/30 bg-risk-high/5'
          : 'border-border bg-app-bg'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{deadline.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-steel">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDueDate(deadline.dueDate)} · {deadline.dueTime}
          </span>
          <span>{getVetName(deadline.assignedVetId)}</span>
          {deadline.caseId && (
            <Link
              to={`/cases/${deadline.caseId}`}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Case #{deadline.caseId}
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <TaskStatusBadge status={deadline.status} />
        <PriorityBadge priority={deadline.priority} />
      </div>
    </div>
  )
}
