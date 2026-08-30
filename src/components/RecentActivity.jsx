import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Renders the activity list from getRecentActivity(). Each entry is
// the case's current status presented as an event — see the comment
// on getRecentActivity in mockData.js for what this is (and isn't)
// derived from.
export default function RecentActivity({ activity }) {
  if (activity.length === 0) {
    return <p className="text-sm text-steel py-6 text-center">No recent activity.</p>
  }

  return (
    <ul className="divide-y divide-border">
      {activity.map((entry) => (
        <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-ink">{entry.label}</span>
              <StatusBadge status={entry.status} />
            </div>
            <p className="text-xs text-steel mt-0.5 truncate">
              Case #{entry.caseId} · {entry.detail}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-steel">
              {formatDateTime(entry.at)}
            </span>
            <Link
              to={`/cases/${entry.caseId}`}
              aria-label={`View case ${entry.caseId}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
            >
              View
              <ArrowRight size={13} />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
