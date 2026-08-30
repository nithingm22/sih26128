import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// High-risk case needing attention. Visually noticeable via the
// left accent bar (risk color) and badge — not via alarm-red
// backgrounds or motion, per the "noticeable but not alarming" brief.
export default function PriorityCaseRow({ caseItem }) {
  return (
    <li className="flex items-center gap-4 py-3 pl-3 pr-2 border-l-[3px] border-risk-high bg-risk-high/5 rounded-control">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-ink">
            Case #{caseItem.id}
          </span>
          <span className="text-sm text-steel">
            {caseItem.animal.name} · {caseItem.animal.species}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {caseItem.location}
          </span>
          <span>{formatDateTime(caseItem.created_at)}</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
        <RiskBadge level={caseItem.risk_level} percent={caseItem.risk_percent} />
        <StatusBadge status={caseItem.status} />
      </div>

      <Link
        to={`/cases/${caseItem.id}`}
        className="shrink-0 flex items-center gap-1 h-8 px-3 rounded-control border border-border bg-surface text-xs font-medium text-ink hover:bg-app-bg"
      >
        View
        <ArrowRight size={14} />
      </Link>
    </li>
  )
}
