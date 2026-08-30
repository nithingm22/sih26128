import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Stethoscope,
  Info,
  ClipboardList,
  UserRound,
  FileWarning,
  ListChecks,
} from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import StatusBadge, { STATUS_LABELS } from '../components/StatusBadge'
import CaseWorkflowStepper from '../components/CaseWorkflowStepper'
import TaskCard from '../components/TaskCard'
import {
  getCaseById,
  getCaseActivity,
  getVetName,
  getWorkflowStageIndex,
  getTasksByCaseId,
  getAssignableVets,
  CASE_STATUSES,
  CASE_WORKFLOW_STAGES,
  CASE_TERMINAL_STATUSES,
  PRIORITY_LEVELS,
} from '../services/mockData'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OverviewRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wide uppercase text-steel mb-0.5">
        {label}
      </p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  )
}

// Every stage label the stepper can show, built from the same
// STATUS_LABELS the rest of the app uses — the last slot's label is
// resolved dynamically below since it depends on which terminal
// status (if any) the case has actually reached.
const WORKFLOW_STAGE_KEYS = [...CASE_WORKFLOW_STAGES, 'final']

export default function CaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const caseItem = getCaseById(id)

  // Frontend-only interaction state. None of this touches the
  // CASES mock array or any backend — it exists purely so the page
  // demonstrates what these actions will feel like once a real
  // PATCH /cases/:id endpoint exists.
  const [localStatus, setLocalStatus] = useState(caseItem?.status)
  const [localVetId, setLocalVetId] = useState(caseItem?.assigned_vet_id ?? null)
  const [noteDraft, setNoteDraft] = useState('')
  const [localNotes, setLocalNotes] = useState([])

  // Case Actions (deadlines/tasks scoped to this case). Seeded from
  // the shared TASKS mock data; adding a new action here only
  // updates this page's local state — there's no POST /tasks
  // endpoint yet.
  const [actions, setActions] = useState(() =>
    caseItem ? getTasksByCaseId(caseItem.id) : [],
  )
  const [newActionTitle, setNewActionTitle] = useState('')
  const [newActionVetId, setNewActionVetId] = useState('')
  const [newActionDueDate, setNewActionDueDate] = useState('')
  const [newActionPriority, setNewActionPriority] = useState('medium')

  if (!caseItem) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-surface border border-border rounded-card p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-app-bg text-steel mx-auto mb-4">
            <FileWarning size={22} />
          </div>
          <h2 className="text-lg font-semibold text-ink mb-1.5">Case not found</h2>
          <p className="text-sm text-steel mb-5">
            Case #{id} doesn't exist or may have been removed.
          </p>
          <Link
            to="/cases"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Cases
          </Link>
        </div>
      </div>
    )
  }

  const activity = getCaseActivity(caseItem)
  const stageIndex = getWorkflowStageIndex(localStatus)
  const stages = WORKFLOW_STAGE_KEYS.map((key) => {
    if (key !== 'final') return { key, label: STATUS_LABELS[key] }
    const isTerminal = CASE_TERMINAL_STATUSES.includes(localStatus)
    return {
      key: 'final',
      label: isTerminal ? STATUS_LABELS[localStatus] : 'Confirmed / Negative / Closed',
    }
  })

  function handleAddNote(e) {
    e.preventDefault()
    const text = noteDraft.trim()
    if (!text) return

    setLocalNotes((notes) => [
      ...notes,
      { id: `local-${Date.now()}`, author: 'Dr. Vet User', text, at: new Date().toISOString() },
    ])
    setNoteDraft('')
  }

  function handleAdvanceActionStatus(id, nextStatus) {
    setActions((current) =>
      current.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
    )
  }

  function handleReassignAction(id, vetId) {
    setActions((current) =>
      current.map((a) => (a.id === id ? { ...a, assignedVetId: vetId } : a)),
    )
  }

  function handleAddAction(e) {
    e.preventDefault()
    const title = newActionTitle.trim()
    if (!title || !newActionDueDate) return

    setActions((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        task: title,
        caseId: caseItem.id,
        assignedVetId: newActionVetId === '' ? null : Number(newActionVetId),
        createdDate: new Date().toISOString().slice(0, 10),
        dueDate: newActionDueDate,
        priority: newActionPriority,
        status: 'pending',
      },
    ])
    setNewActionTitle('')
    setNewActionVetId('')
    setNewActionDueDate('')
    setNewActionPriority('medium')
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => navigate('/cases')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-steel hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Cases
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-ink">Case #{caseItem.id}</h2>
            <p className="text-sm text-steel mt-1">
              {caseItem.animal.name} · {caseItem.animal.species}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-steel mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {caseItem.location}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={13} />
                {formatDateTime(caseItem.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge level={caseItem.risk_level} percent={caseItem.risk_percent} />
            <StatusBadge status={localStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case overview */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
              <ClipboardList size={16} className="text-primary" />
              Case Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
              <OverviewRow label="Case ID" value={`#${caseItem.id}`} />
              <OverviewRow label="Animal" value={caseItem.animal.name} />
              <OverviewRow label="Species" value={caseItem.animal.species} />
              <OverviewRow label="Location" value={caseItem.location} />
              <OverviewRow label="Reported" value={formatDateTime(caseItem.created_at)} />
              <OverviewRow label="Assigned Vet" value={getVetName(localVetId)} />
            </div>
          </div>

          {/* AI risk assessment */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1 flex items-center gap-2">
              <Stethoscope size={16} className="text-primary" />
              AI / Risk Assessment
            </h3>
            <p className="text-xs text-steel mb-4">
              Automated estimate from the reported symptoms and case details.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <RiskBadge level={caseItem.risk_level} percent={caseItem.risk_percent} />
              <span className="text-sm text-steel">
                {caseItem.risk_percent}% estimated risk confidence
              </span>
            </div>

            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
              <Info size={15} className="text-accent-blue shrink-0 mt-0.5" />
              <p className="text-xs text-steel leading-relaxed">
                <span className="font-semibold text-ink">
                  AI-assisted estimate only.
                </span>{' '}
                This is not a confirmed diagnosis and does not replace
                veterinary judgment.
              </p>
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-4">Case Workflow</h3>
            <CaseWorkflowStepper stages={stages} currentIndex={stageIndex} />
          </div>

          {/* Notes / activity */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1">
              Case Notes &amp; Activity
            </h3>
            <p className="text-xs text-steel mb-4">
              System activity for this case, plus any notes added below.
            </p>

            <ul className="space-y-3 mb-5">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{entry.label}</p>
                    <p className="text-xs text-steel">{entry.detail}</p>
                    <p className="text-[11px] text-steel/80 mt-0.5">
                      {formatDateTime(entry.at)}
                    </p>
                  </div>
                </li>
              ))}
              {localNotes.map((note) => (
                <li key={note.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cluster mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink">Note from {note.author}</p>
                    <p className="text-xs text-steel whitespace-pre-wrap">{note.text}</p>
                    <p className="text-[11px] text-steel/80 mt-0.5">
                      {formatDateTime(note.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddNote} className="space-y-2">
              <label htmlFor="new-note" className="block text-[13px] font-medium text-steel">
                Add a note
              </label>
              <textarea
                id="new-note"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={2}
                placeholder="Add an observation or update for this case..."
                className="w-full px-3 py-2 rounded-control border border-border bg-app-bg text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-steel">
                  Notes are kept in this browser session only — not saved to a backend yet.
                </p>
                <button
                  type="submit"
                  disabled={noteDraft.trim() === ''}
                  className="shrink-0 h-9 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Assigned veterinarian */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
              <UserRound size={16} className="text-primary" />
              Assigned Veterinarian
            </h3>
            {localVetId != null ? (
              <div>
                <p className="text-sm font-medium text-ink">{getVetName(localVetId)}</p>
                <p className="text-xs text-steel mt-1">Assigned to this case</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-steel">Unassigned</p>
                <p className="text-xs text-steel mt-1">
                  No veterinarian has been assigned yet.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1">Actions</h3>
            <p className="text-xs text-steel mb-4">
              Frontend-only for now — changes here aren't saved to a backend.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="update-status" className="block text-[13px] font-medium text-steel mb-1.5">
                  Update Status
                </label>
                <select
                  id="update-status"
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
                >
                  {CASE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="assign-vet" className="block text-[13px] font-medium text-steel mb-1.5">
                  Assign Veterinarian
                </label>
                <select
                  id="assign-vet"
                  value={localVetId ?? ''}
                  onChange={(e) =>
                    setLocalVetId(e.target.value === '' ? null : Number(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {getAssignableVets(localVetId).map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Case Actions — deadlines/tasks scoped to this case */}
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1 flex items-center gap-2">
              <ListChecks size={16} className="text-primary" />
              Case Actions
            </h3>
            <p className="text-xs text-steel mb-4">
              Frontend-only for now — not yet synced to a backend.
            </p>

            {actions.length > 0 ? (
              <div className="space-y-2.5 mb-4">
                {actions.map((action) => (
                  <TaskCard
                    key={action.id}
                    task={action}
                    onAdvanceStatus={handleAdvanceActionStatus}
                    onReassign={handleReassignAction}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-steel text-center py-4">
                No actions for this case yet.
              </p>
            )}

            <form onSubmit={handleAddAction} className="space-y-2.5 pt-3 border-t border-border">
              <input
                type="text"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
                placeholder="e.g. Veterinary review, Field visit, Lab follow-up"
                className="w-full h-9 px-3 rounded-control border border-border bg-app-bg text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newActionDueDate}
                  onChange={(e) => setNewActionDueDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
                />
                <select
                  value={newActionPriority}
                  onChange={(e) => setNewActionPriority(e.target.value)}
                  className="w-full h-9 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
                >
                  {PRIORITY_LEVELS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label} priority
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={newActionVetId}
                onChange={(e) => setNewActionVetId(e.target.value)}
                className="w-full h-9 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">Unassigned</option>
                {getAssignableVets().map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={newActionTitle.trim() === '' || !newActionDueDate}
                className="w-full h-9 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Action
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
