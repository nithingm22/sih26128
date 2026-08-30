import { Search, X } from 'lucide-react'
import { RISK_LEVELS, CASE_STATUSES } from '../services/mockData'
import { STATUS_LABELS } from './StatusBadge'

// Case List's filter toolbar. All filters combine (AND, not OR) —
// the actual combining logic lives in mockData.getFilteredCases so
// this component only ever renders state and reports changes up.
export default function CaseFilters({
  filters,
  onFilterChange,
  onClear,
  speciesOptions,
  locationOptions,
  dateRangeOptions,
}) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.risk !== 'all' ||
    filters.status !== 'all' ||
    filters.species !== 'all' ||
    filters.location !== 'all' ||
    filters.dateRange !== 'all'

  function update(key, value) {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label
            htmlFor="case-search"
            className="block text-[11px] font-semibold tracking-wide uppercase text-steel mb-1.5"
          >
            Search Cases
          </label>
          <div className="flex items-center gap-2 h-10 px-3 rounded-control border border-border bg-app-bg text-steel focus-within:border-primary transition-colors">
            <Search size={16} className="shrink-0" />
            <input
              id="case-search"
              type="text"
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
              placeholder="Case ID, animal, species, location..."
              className="bg-transparent outline-none text-sm placeholder:text-steel w-full text-ink"
            />
            {filters.search !== '' && (
              <button
                type="button"
                onClick={() => update('search', '')}
                aria-label="Clear search"
                className="shrink-0 text-steel hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <FilterSelect
          label="Risk"
          id="filter-risk"
          value={filters.risk}
          onChange={(v) => update('risk', v)}
          options={[{ value: 'all', label: 'All' }, ...RISK_LEVELS]}
        />

        <FilterSelect
          label="Status"
          id="filter-status"
          value={filters.status}
          onChange={(v) => update('status', v)}
          options={[
            { value: 'all', label: 'All' },
            ...CASE_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
          ]}
        />

        <FilterSelect
          label="Species"
          id="filter-species"
          value={filters.species}
          onChange={(v) => update('species', v)}
          options={[
            { value: 'all', label: 'All' },
            ...speciesOptions.map((s) => ({ value: s, label: s })),
          ]}
        />

        <FilterSelect
          label="Location"
          id="filter-location"
          value={filters.location}
          onChange={(v) => update('location', v)}
          options={[
            { value: 'all', label: 'All' },
            ...locationOptions.map((l) => ({ value: l, label: l })),
          ]}
        />

        <FilterSelect
          label="Date"
          id="filter-date"
          value={filters.dateRange}
          onChange={(v) => update('dateRange', v)}
          options={dateRangeOptions}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 h-10 px-3 rounded-control border border-border text-sm font-medium text-steel hover:bg-app-bg hover:text-ink transition-colors"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ label, id, value, onChange, options }) {
  return (
    <div className="w-[150px]">
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
