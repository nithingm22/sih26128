// Legend for the Surveillance Map's risk-colored markers. Uses the
// same CSS token classes as RiskBadge (bg-risk-low/medium/high) so
// the legend's dots are guaranteed to match the marker colors —
// no separate hex values to drift out of sync.
const LEGEND_ITEMS = [
  { level: 'low', label: 'Low risk', dot: 'bg-risk-low' },
  { level: 'medium', label: 'Medium risk', dot: 'bg-risk-medium' },
  { level: 'high', label: 'High risk', dot: 'bg-risk-high' },
]

export default function MapLegend() {
  return (
    <div className="bg-surface border border-border rounded-card p-4">
      <p className="text-[11px] font-semibold tracking-wide uppercase text-steel mb-3">
        Risk Level
      </p>
      <ul className="space-y-2">
        {LEGEND_ITEMS.map(({ level, label, dot }) => (
          <li key={level} className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full shrink-0 ${dot}`} aria-hidden="true" />
            <span className="text-sm text-ink">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
