// Shared placeholder used by every page in this step — routing/layout
// only. Real page content is built in later steps.
export default function Placeholder({ title, description }) {
  return (
    <div className="bg-surface border border-border rounded-card p-8 max-w-2xl">
      <p className="text-[11px] font-semibold tracking-wide uppercase text-steel mb-2">
        Placeholder
      </p>
      <h2 className="text-xl font-semibold text-ink mb-2">{title}</h2>
      <p className="text-sm text-steel">{description}</p>
    </div>
  )
}
