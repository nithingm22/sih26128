import { Link } from 'react-router-dom'
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  Stethoscope,
  Radar,
  MapPinned,
  TrendingUp,
  ArrowRight,
  Info,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import PriorityCaseRow from '../components/PriorityCaseRow'
import CaseTable from '../components/CaseTable'
import RiskChart from '../components/RiskChart'
import DeadlineCard from '../components/DeadlineCard'
import ReminderCard from '../components/ReminderCard'
import TaskCard from '../components/TaskCard'
import {
  getDashboardSummary,
  getPriorityCases,
  getRecentCases,
  getRiskDistribution,
  getSurveillanceSnapshot,
  getUpcomingDeadlines,
  getTodayReminders,
  getMyPendingTasks,
} from '../services/mockData'

// All data below comes from services/mockData.js — synthetic for
// this step. Once FastAPI is wired in, only that module's functions
// need to be swapped for real GET /dashboard/summary, GET /cases,
// and GET /clusters calls; this page does not need to change.
export default function Dashboard() {
  const summary = getDashboardSummary()
  const priorityCases = getPriorityCases()
  const recentCases = getRecentCases()
  const riskDistribution = getRiskDistribution()
  const surveillance = getSurveillanceSnapshot()
  const upcomingDeadlines = getUpcomingDeadlines(3)
  const todayReminders = getTodayReminders()
  const pendingTasks = getMyPendingTasks(3)

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">Vet Dashboard</h2>
        <p className="text-sm text-steel mt-1">
          Good morning — here's what needs your attention today.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Cases" value={summary.total} icon={ClipboardList} />
        <StatCard
          label="High Risk Cases"
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
        <StatCard
          label="Referred Cases"
          value={summary.referred}
          icon={Stethoscope}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority cases */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">
              Needs Attention
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

          {priorityCases.length > 0 ? (
            <ul className="space-y-2.5">
              {priorityCases.map((c) => (
                <PriorityCaseRow key={c.id} caseItem={c} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-steel py-6 text-center">
              No high-risk cases requiring attention right now.
            </p>
          )}

          {/* AI safety notice — applies to every risk figure shown
              on this dashboard, so it is placed once, clearly, near
              the risk-heavy content rather than buried in a footer. */}
          <div className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
            <Info size={15} className="text-accent-blue shrink-0 mt-0.5" />
            <p className="text-xs text-steel leading-relaxed">
              Risk levels shown are an AI-assisted estimate of a
              possible condition, not a confirmed diagnosis. Every
              high-risk case requires veterinary review.
            </p>
          </div>
        </div>

        {/* Risk overview chart */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent cases table */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">
              Recent Cases
            </h3>
            <Link
              to="/cases"
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-steel mb-3">
            Most recently reported cases across all districts
          </p>
          <CaseTable cases={recentCases} />
        </div>

        {/* Quick surveillance summary */}
        <div className="bg-surface border border-border rounded-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Radar size={16} className="text-cluster" />
            <h3 className="text-base font-semibold text-ink">
              Surveillance Summary
            </h3>
          </div>
          <p className="text-xs text-steel mb-4">
            Snapshot of possible disease clustering
          </p>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-control bg-cluster/10">
              <span className="text-sm text-ink">Active possible clusters</span>
              <span className="text-sm font-semibold text-cluster">
                {surveillance.activeClusters}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-control bg-app-bg">
              <span className="text-sm text-ink">Cases in surveillance area</span>
              <span className="text-sm font-semibold text-ink">
                {surveillance.casesInSurveillanceArea}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-control bg-app-bg">
              <span className="text-sm text-ink">Recent high-risk reports</span>
              <span className="text-sm font-semibold text-ink">
                {surveillance.recentHighRiskReports}
              </span>
            </div>

            {surveillance.leadCluster && (
              <div className="px-3 py-2.5 rounded-control border border-dashed border-cluster/40">
                <p className="text-[11px] font-semibold tracking-wide uppercase text-cluster mb-1 flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  Possible cluster
                </p>
                <p className="text-sm text-ink">
                  {surveillance.leadCluster.disease_name}
                </p>
                <p className="text-xs text-steel mt-0.5">
                  {surveillance.leadCluster.case_count} nearby cases ·{' '}
                  {surveillance.leadCluster.location}
                </p>
              </div>
            )}
          </div>

          <Link
            to="/map"
            className="mt-4 w-full h-10 rounded-control bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
          >
            <MapPinned size={16} />
            View Surveillance Map
          </Link>
        </div>
      </div>

      {/* Planning: upcoming deadlines, today's reminders, my pending tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">Upcoming Deadlines</h3>
            <Link
              to="/calendar"
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-steel mb-4">Next deadlines across all cases</p>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2.5">
              {upcomingDeadlines.map((d) => (
                <DeadlineCard key={d.id} deadline={d} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel text-center py-6">No upcoming deadlines.</p>
          )}
        </div>

        <div className="bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">Today's Reminders</h3>
            <Link
              to="/calendar"
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-steel mb-4">Reminders scheduled for today</p>
          {todayReminders.length > 0 ? (
            <div className="space-y-2.5">
              {todayReminders.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel text-center py-6">No reminders due today.</p>
          )}
        </div>

        <div className="bg-surface border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-ink">My Pending Tasks</h3>
            <Link
              to="/tasks"
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-xs text-steel mb-4">Action items awaiting completion</p>
          {pendingTasks.length > 0 ? (
            <div className="space-y-2.5">
              {pendingTasks.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel text-center py-6">No pending tasks.</p>
          )}
        </div>
      </div>
    </div>
  )
}
