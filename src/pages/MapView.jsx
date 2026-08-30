import { useMemo, useState } from 'react'
import { RotateCcw, X, Info, SearchX } from 'lucide-react'
import SurveillanceMap from '../components/SurveillanceMap'
import MapLegend from '../components/MapLegend'
import SurveillanceSummary from '../components/SurveillanceSummary'
import {
  getFilteredCases,
  getCaseMapMarkers,
  getMapSummary,
  getDistrictSummary,
  RISK_LEVELS,
  CASE_STATUSES,
} from '../services/mockData'
import { STATUS_LABELS } from '../components/StatusBadge'

const DEFAULT_FILTERS = { risk: 'all', status: 'all' }

// All data below comes from services/mockData.js, same pattern as
// Dashboard/CaseList. Once FastAPI is wired in, only the mockData
// functions (getFilteredCases, getCaseMapMarkers, getMapSummary,
// getDistrictSummary) need to become real GET /cases + GET /clusters
// calls — this page's structure does not need to change.
export default function MapView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [resetSignal, setResetSignal] = useState(0)
  const [activeDistrict, setActiveDistrict] = useState('all')

  const hasActiveFilters = filters.risk !== 'all' || filters.status !== 'all'

  // Summary + district panels always reflect the full case set (not
  // the current filter) — they're a fixed overview, same as the
  // Dashboard's stat cards not changing when Case List is filtered.
  const summary = useMemo(() => getMapSummary(), [])
  const districts = useMemo(() => getDistrictSummary(), [])

  const filteredCases = useMemo(() => {
    const results = getFilteredCases({ risk: filters.risk, status: filters.status })
    if (activeDistrict === 'all') return results
    return results.filter((c) => c.location === activeDistrict)
  }, [filters, activeDistrict])

  const markers = useMemo(() => getCaseMapMarkers(filteredCases), [filteredCases])

  function update(key, value) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
    setActiveDistrict('all')
  }

  function handleResetView() {
    setResetSignal((n) => n + 1)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Surveillance Map</h2>
          <p className="text-sm text-steel mt-1">
            Geographic distribution of reported livestock cases and risk levels.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-2 h-10 px-4 rounded-control border border-border bg-surface text-sm font-medium text-ink hover:bg-app-bg transition-colors"
        >
          <RotateCcw size={15} />
          Reset View
        </button>
      </div>

      {/* Summary stat cards — always full dataset, not filter-dependent */}
      <SurveillanceSummary summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Map column */}
        <div className="space-y-4 min-w-0">
          {/* Filter toolbar */}
          <div className="bg-surface border border-border rounded-card p-4">
            <div className="flex flex-wrap items-end gap-3">
              <FilterSelect
                label="Risk"
                id="map-filter-risk"
                value={filters.risk}
                onChange={(v) => update('risk', v)}
                options={[{ value: 'all', label: 'All' }, ...RISK_LEVELS]}
              />
              <FilterSelect
                label="Status"
                id="map-filter-status"
                value={filters.status}
                onChange={(v) => update('status', v)}
                options={[
                  { value: 'all', label: 'All' },
                  ...CASE_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
                ]}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 h-10 px-3 rounded-control border border-border text-sm font-medium text-steel hover:bg-app-bg hover:text-ink transition-colors"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}

              <p className="ml-auto text-xs text-steel self-center" aria-live="polite">
                {markers.length} case{markers.length === 1 ? '' : 's'} shown
              </p>
            </div>
          </div>

          {/* Map or empty state */}
          {markers.length > 0 ? (
            <SurveillanceMap cases={markers} resetSignal={resetSignal} />
          ) : (
            <div className="h-[420px] md:h-[560px] rounded-card border border-border bg-surface flex flex-col items-center justify-center text-center p-6">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-app-bg text-steel mb-3">
                <SearchX size={20} />
              </div>
              <p className="text-sm font-semibold text-ink mb-1">No cases found</p>
              <p className="text-xs text-steel mb-4">
                No cases match the selected filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="h-9 px-4 rounded-control border border-border text-sm font-medium text-ink hover:bg-app-bg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          <MapLegend />

          {/* AI safety / data disclaimer */}
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
            <Info size={15} className="text-accent-blue shrink-0 mt-0.5" />
            <p className="text-xs text-steel leading-relaxed">
              Risk levels shown on this map are AI-assisted estimates of
              possible conditions and are not confirmed diagnoses.
              Veterinary review is required.
            </p>
          </div>
        </div>

        {/* Risk by District panel */}
        <div className="bg-surface border border-border rounded-card p-4 h-fit">
          <p className="text-[11px] font-semibold tracking-wide uppercase text-steel mb-3">
            Risk by District
          </p>
          <ul className="space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => setActiveDistrict('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-control text-sm transition-colors ${
                  activeDistrict === 'all'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-ink hover:bg-app-bg'
                }`}
              >
                <span>All Districts</span>
                <span className="text-xs text-steel">{summary.total}</span>
              </button>
            </li>
            {districts.map((d) => (
              <li key={d.location}>
                <button
                  type="button"
                  onClick={() => setActiveDistrict(d.location)}
                  aria-pressed={activeDistrict === d.location}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-control text-sm transition-colors ${
                    activeDistrict === d.location
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-ink hover:bg-app-bg'
                  }`}
                >
                  <span className="truncate text-left">{d.location}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-steel">{d.total}</span>
                    {d.highRisk > 0 && <HighRiskCount count={d.highRisk} />}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function HighRiskCount({ count }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-risk-high">
      <span className="w-1.5 h-1.5 rounded-full bg-risk-high" aria-hidden="true" />
      {count}
    </span>
  )
}

function FilterSelect({ label, id, value, onChange, options }) {
  return (
    <div className="w-[160px]">
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold tracking-wide uppercase text-steel mb-1.5"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
