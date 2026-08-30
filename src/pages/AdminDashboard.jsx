import { Link } from 'react-router-dom'
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  Stethoscope,
  CheckCircle2,
  Users,
  ArrowRight,
  Info,
  SearchX,
  ListChecks,
  MapPinned,
  ShieldAlert,
  UserCog,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import RiskChart from '../components/RiskChart'
import StatusOverviewChart from '../components/StatusOverviewChart'
import VeterinarianWorkload from '../components/VeterinarianWorkload'
import RecentActivity from '../components/RecentActivity'
import RiskBadge from '../components/RiskBadge'
import StatusBadge from '../components/StatusBadge'
import {
  getAdminSummary,
  getStatusDistribution,
  getRiskDistribution,
  getVeterinarianWorkload,
  getPriorityCases,
  getRecentActivity,
  getVetName,
} from '../services/mockData'

// All data below comes from services/mockData.js, same pattern as
// Dashboard/CaseList/MapView. Once FastAPI is wired in, only the
// mockData functions need to become real API calls — this page's
// structure does not need to change.
export default function AdminDashboard() {
  const summary = getAdminSummary()
  const statusDistribution = getStatusDistribution()
  const riskDistribution = getRiskDistribution()
  const workload = getVeterinarianWorkload()
  const highRiskCases = getPriorityCases()
  const activity = getRecentActivity()

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">Admin Dashboard</h2>
        <p className="text-sm text-steel mt-1">
          System overview, case activity, and veterinary workload.
        </p>
      </div>

      {/* System summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <StatCard
          label="Active Vets"
          value={summary.activeVeterinarians}
          icon={Users}
          tone="accent"
        />
      </div>

      {/* Case status overview + risk overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-5">
          <h3 className="text-base font-semibold text-ink mb-1">
            Case Status Overview
          </h3>
          <p className="text-xs text-steel mb-3">
            Number of cases at each stage of the case lifecycle
          </p>
          <StatusOverviewChart data={statusDistribution} />
        </div>

        <div className="bg-surface border border-border rounded-card p-5">
          <h3 className="text-base font-semibold text-ink mb-1">
            Risk Overview
          </h3>
          <p className="text-xs text-steel mb-3">
            Case distribution by risk level
          </p>
          <RiskChart data={riskDistribution} />
        </div>
      </div>

      {/* Veterinarian workload */}
      <div className="bg-surface border border-border rounded-card p-5">
        <h3 className="text-base font-semibold text-ink mb-1">
          Veterinarian Workload
        </h3>
        <p className="text-xs text-steel mb-4">
          Case assignments across the veterinary team
        </p>
        <VeterinarianWorkload workload={workload} />
      </div>

      {/* High-risk cases + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">
              High-Risk Cases
            </h3>
            <Link
              to="/cases?risk=high"
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-steel mb-4">
            High-risk cases that have not yet been closed
          </p>

          {highRiskCases.length > 0 ? (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-border">
                    {['Case ID', 'Animal', 'Location', 'Risk', 'Status', 'Assigned Vet', ''].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="text-left text-[11px] font-semibold tracking-wide uppercase text-steel px-3 py-2.5"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {highRiskCases.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-app-bg"
                    >
                      <td className="px-3 py-2.5 font-medium text-ink whitespace-nowrap">
                        #{c.id}
                      </td>
                      <td className="px-3 py-2.5 text-ink whitespace-nowrap">
                        {c.animal.name}
                      </td>
                      <td className="px-3 py-2.5 text-steel whitespace-nowrap">
                        {c.location}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <RiskBadge level={c.risk_level} percent={c.risk_percent} />
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-3 py-2.5 text-steel whitespace-nowrap">
                        {getVetName(c.assigned_vet_id)}
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
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
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-app-bg text-steel mb-3">
                <SearchX size={20} />
              </div>
              <p className="text-sm font-semibold text-ink">No high-risk cases</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-surface border border-border rounded-card p-5">
          <h3 className="text-base font-semibold text-ink mb-1">
            Quick Actions
          </h3>
          <p className="text-xs text-steel mb-4">
            Jump to a common task
          </p>
          <div className="space-y-2">
            <QuickAction to="/cases" icon={ListChecks} label="View All Cases" />
            <QuickAction to="/map" icon={MapPinned} label="Surveillance Map" />
            <QuickAction
              to="/cases?risk=high"
              icon={ShieldAlert}
              label="Review High-Risk Cases"
            />
            <QuickAction
              to="/admin/veterinarians"
              icon={UserCog}
              label="Manage Veterinarians"
            />
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-surface border border-border rounded-card p-5">
        <h3 className="text-base font-semibold text-ink mb-1">
          Recent Activity
        </h3>
        <p className="text-xs text-steel mb-3">
          Latest case updates across the system
        </p>
        <RecentActivity activity={activity} />
      </div>

      {/* AI safety / data disclaimer */}
      <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
        <Info size={15} className="text-accent-blue shrink-0 mt-0.5" />
        <p className="text-xs text-steel leading-relaxed">
          Risk levels shown are AI-assisted estimates of possible
          conditions and are not confirmed diagnoses. Veterinary
          review is required.
        </p>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 h-11 px-3.5 rounded-control border border-border bg-app-bg text-sm font-medium text-ink hover:bg-surface transition-colors"
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} className="text-steel" />
        {label}
      </span>
      <ArrowRight size={14} className="text-steel" />
    </Link>
  )
}
