import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  ClipboardList,
  AlertTriangle,
  Clock,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import CaseFilters from '../components/CaseFilters'
import CaseListTable from '../components/CaseListTable'
import NewCaseModal from '../components/NewCaseModal'
import {
  getCaseListSummary,
  getFilteredCases,
  getUniqueSpecies,
  getUniqueLocations,
  CASE_DATE_RANGES,
} from '../services/mockData'

const DEFAULT_FILTERS = {
  search: '',
  risk: 'all',
  status: 'all',
  species: 'all',
  location: 'all',
  dateRange: 'all',
}

const VALID_RISK_VALUES = ['low', 'medium', 'high']

// All data below comes from services/mockData.js, same pattern as
// the Dashboard. Once FastAPI is wired in, only getFilteredCases /
// getCaseListSummary / getUniqueSpecies / getUniqueLocations need to
// become real GET /cases calls — this page's structure doesn't
// change.
export default function CaseList() {
  // Supports the Dashboard's "Needs Attention → View all" link,
  // which points to /cases?risk=high.
  const [searchParams] = useSearchParams()
  const riskFromUrl = searchParams.get('risk')
  const initialRisk = VALID_RISK_VALUES.includes(riskFromUrl) ? riskFromUrl : 'all'

  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, risk: initialRisk })
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [modalOpen, setModalOpen] = useState(false)

  const summary = getCaseListSummary()
  const speciesOptions = useMemo(() => getUniqueSpecies(), [])
  const locationOptions = useMemo(() => getUniqueLocations(), [])

  const cases = useMemo(
    () => getFilteredCases({ ...filters, sortBy, sortDir }),
    [filters, sortBy, sortDir],
  )

  function handleSortChange(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">All Cases</h2>
          <p className="text-sm text-steel mt-1">
            Animal health reports and cases requiring veterinary review.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Cases" value={summary.total} icon={ClipboardList} />
        <StatCard
          label="High Risk"
          value={summary.highRisk}
          icon={AlertTriangle}
          tone="risk"
        />
        <StatCard
          label="Awaiting Review"
          value={summary.awaitingReview}
          icon={Clock}
          tone="accent"
        />
        <StatCard label="Referred" value={summary.referred} icon={Stethoscope} />
        <StatCard label="Resolved" value={summary.resolved} icon={CheckCircle2} />
      </div>

      <CaseFilters
        filters={filters}
        onFilterChange={setFilters}
        onClear={handleClearFilters}
        speciesOptions={speciesOptions}
        locationOptions={locationOptions}
        dateRangeOptions={CASE_DATE_RANGES}
      />

      <p className="text-xs text-steel" aria-live="polite">
        {cases.length} case{cases.length === 1 ? '' : 's'} found
      </p>

      <CaseListTable
        cases={cases}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      <NewCaseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
