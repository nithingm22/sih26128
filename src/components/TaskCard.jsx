import { Link } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'
import PriorityBadge from './PriorityBadge'
import TaskStatusBadge from './TaskStatusBadge'
import { getVetName, getAssignableVets } from '../services/mockData'

// Pending -> In Progress -> Completed, one step per click. A task
// that has been computed as 'overdue' (see getTaskStatus) can still
// be advanced — moving it to 'in_progress' or 'completed' overrides
// the overdue read since it's no longer stuck pending.
const NEXT_STATUS = { pending: 'in_progress', in_progress: 'completed' }

function formatDueDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

// `onAdvanceStatus` is optional — Dashboard's "My Pending Tasks"
// list displays tasks read-only, while Tasks.jsx and Case Detail's
// Actions section pass a handler backed by local component state
// (frontend-only; no PATCH /tasks/:id endpoint exists yet).
// `onReassign` is likewise optional and, when passed, swaps the
// assigned-vet text for a dropdown of active veterinarians — no
// second user-management system, per the brief. Deactivated vets
// aren't offered for a *new* reassignment, but a task already
// assigned to one still shows/keeps that vet selected.
export default function TaskCard({ task, onAdvanceStatus, onReassign }) {
  const displayStatus = task.status === 'overdue' ? 'pending' : task.status
  const next = NEXT_STATUS[displayStatus]

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-control border ${
        task.status === 'overdue'
          ? 'border-risk-high/30 bg-risk-high/5'
          : 'border-border bg-app-bg'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{task.task}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-steel">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            Due {formatDueDate(task.dueDate)}
          </span>
          {onReassign ? (
            <select
              value={task.assignedVetId ?? ''}
              onChange={(e) =>
                onReassign(task.id, e.target.value === '' ? null : Number(e.target.value))
              }
              onClick={(e) => e.stopPropagation()}
              aria-label="Reassign veterinarian"
              className="h-6 px-1.5 rounded-control border border-border bg-surface text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="">Unassigned</option>
              {getAssignableVets(task.assignedVetId).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{getVetName(task.assignedVetId)}</span>
          )}
          {task.caseId && (
            <Link
              to={`/cases/${task.caseId}`}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Case #{task.caseId}
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <TaskStatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {onAdvanceStatus && next && (
          <button
            type="button"
            onClick={() => onAdvanceStatus(task.id, next)}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-hover mt-0.5"
          >
            Move to {next === 'in_progress' ? 'In Progress' : 'Completed'}
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  )
}
