// Single dashboard metric: large number, label, and an icon whose
// color hints at meaning (e.g. red-tinted icon for High Risk) without
// relying on color alone — the label text always carries the meaning.
export default function StatCard({ label, value, icon: Icon, tone = 'default' }) {
  const toneStyles = {
    default: 'bg-primary/10 text-primary',
    risk: 'bg-risk-high/10 text-risk-high',
    accent: 'bg-accent-blue/10 text-accent-blue',
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-wide uppercase text-steel mb-1.5">
            {label}
          </p>
          <p className="text-3xl font-bold text-ink tabular-nums leading-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-control shrink-0 ${toneStyles[tone]}`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  )
}
