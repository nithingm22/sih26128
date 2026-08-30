import { Users } from 'lucide-react'

// Compact workload table: one row per vet plus a trailing
// "Unassigned" row (see getVeterinarianWorkload in mockData.js).
// Empty state only fires when literally no case anywhere has an
// assignment — a genuine "nothing to show" case, not just a vet
// with zero cases (that vet still shows a row with 0s).
export default function VeterinarianWorkload({ workload }) {
  const totalAssigned = workload.reduce((sum, row) => sum + row.assignedCount, 0)

  if (totalAssigned === 0) {
    return (
      <div className="bg-surface border border-border rounded-card p-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-app-bg text-steel mb-3">
          <Users size={20} />
        </div>
        <p className="text-sm font-semibold text-ink">No assignments yet</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3">
                <ColumnHeading>Veterinarian</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Assigned Cases</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>High Risk</ColumnHeading>
              </th>
              <th className="text-left px-4 py-3">
                <ColumnHeading>Awaiting Review</ColumnHeading>
              </th>
            </tr>
          </thead>
          <tbody>
            {workload.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-app-bg"
              >
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-ink whitespace-nowrap tabular-nums">
                  {row.assignedCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                  <span className={row.highRiskCount > 0 ? 'text-risk-high font-semibold' : 'text-steel'}>
                    {row.highRiskCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-steel whitespace-nowrap tabular-nums">
                  {row.awaitingReviewCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ColumnHeading({ children }) {
  return (
    <span className="text-[11px] font-semibold tracking-wide uppercase text-steel">
      {children}
    </span>
  )
}
