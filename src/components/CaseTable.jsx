import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

// Compact case table. Horizontally scrollable on narrow viewports
// rather than collapsing to cards, so column alignment (and the
// scanning habit vets rely on) is preserved at every width.
export default function CaseTable({ cases }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            {['Case ID', 'Animal', 'Species', 'Risk', 'Status', 'Location', 'Date', ''].map(
              (heading) => (
                <th
                  key={heading}
                  className="text-left text-[11px] font-semibold tracking-wide uppercase text-steel px-4 py-2.5"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr
              key={c.id}
              className="border-b border-border last:border-0 hover:bg-app-bg"
            >
              <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                #{c.id}
              </td>
              <td className="px-4 py-3 text-ink whitespace-nowrap">
                {c.animal.name}
              </td>
              <td className="px-4 py-3 text-steel whitespace-nowrap">
                {c.animal.species}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <RiskBadge level={c.risk_level} percent={c.risk_percent} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3 text-steel whitespace-nowrap">
                {c.location}
              </td>
              <td className="px-4 py-3 text-steel whitespace-nowrap">
                {formatDate(c.created_at)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  to={`/cases/${c.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                >
                  View
                  <ArrowRight size={13} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
