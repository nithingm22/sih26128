import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUp, ArrowDown, ArrowUpDown, SearchX } from 'lucide-react'
import RiskBadge from './RiskBadge'
import StatusBadge from './StatusBadge'
import { getVetName } from '../services/mockData'

// Left-edge accent bar per row — makes high-risk cases noticeable
// while scanning without tinting the whole row (per brief: no
// bright-red rows). Same three hues as RiskBadge/RiskChart.
const RISK_BORDER = {
  low: 'border-risk-low',
  medium: 'border-risk-medium',
  high: 'border-risk-high',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SortHeader({ label, field, sortBy, sortDir, onSortChange }) {
  const active = sortBy === field
  const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <button
      type="button"
      onClick={() => onSortChange(field)}
      aria-label={`Sort by ${label}`}
      className={`flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase transition-colors ${
        active ? 'text-ink' : 'text-steel hover:text-ink'
      }`}
    >
      {label}
      <Icon size={12} />
    </button>
  )
}

function ColumnHeading({ children }) {
  return (
    <span className="text-[11px] font-semibold tracking-wide uppercase text-steel">
      {children}
    </span>
  )
}

export default function CaseListTable({ cases, sortBy, sortDir, onSortChange, onClearFilters }) {
  if (cases.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-card p-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-app-bg text-steel mb-3">
          <SearchX size={20} />
        </div>
        <p className="text-sm font-semibold text-ink mb-1">No matching cases</p>
        <p className="text-xs text-steel mb-4">
          Try adjusting or clearing your filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="h-9 px-4 rounded-control border border-border text-sm font-medium text-ink hover:bg-app-bg transition-colors"
        >
          Clear Filters
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden">
      {/* Desktop / tablet: full table, horizontally scrollable if the
          viewport is narrower than the min table width. */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3">
                <ColumnHeading>Case ID</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Animal</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Species</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader
                  label="Risk"
                  field="risk"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Status</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Location</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <SortHeader
                  label="Reported"
                  field="date"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Assigned Vet</ColumnHeading>
              </th>
              <th className="px-4 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr
                key={c.id}
                className={`border-b border-border last:border-0 border-l-[3px] ${RISK_BORDER[c.risk_level]} hover:bg-app-bg`}
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
                <td className="px-4 py-3 text-steel whitespace-nowrap">
                  {getVetName(c.assigned_vet_id)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    to={`/cases/${c.id}`}
                    aria-label={`View case ${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                  >
                    View Case
                    <ArrowRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: compact stacked cards instead of a squeezed table —
          keeps every field readable at ~375px instead of shrinking
          nine columns into one screen. */}
      <ul className="md:hidden divide-y divide-border">
        {cases.map((c) => (
          <li key={c.id} className={`border-l-[3px] ${RISK_BORDER[c.risk_level]} p-4`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  #{c.id} · {c.animal.name}
                </p>
                <p className="text-xs text-steel truncate">
                  {c.animal.species} · {c.location}
                </p>
              </div>
              <RiskBadge level={c.risk_level} percent={c.risk_percent} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge status={c.status} />
              <span className="text-xs text-steel">{formatDate(c.created_at)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-steel truncate">
                Vet: {getVetName(c.assigned_vet_id)}
              </span>
              <Link
                to={`/cases/${c.id}`}
                aria-label={`View case ${c.id}`}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
              >
                View Case
                <ArrowRight size={13} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
