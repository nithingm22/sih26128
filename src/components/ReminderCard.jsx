import { Link } from 'react-router-dom'
import { Clock, Check, Trash2 } from 'lucide-react'
import { CALENDAR_EVENT_TYPES, getVetName } from '../services/mockData'

// Compact row for a single reminder. `onToggleComplete`/`onDelete`
// are optional — pages that only display reminders (e.g. the
// Dashboard's "Today's Reminders" list) can omit them and the
// action buttons simply won't render. Calendar.jsx passes both,
// backed by its own local reminders state — frontend-only, no
// backend endpoint exists to actually send/persist these yet.
export default function ReminderCard({ reminder, onToggleComplete, onDelete }) {
  const typeStyle = CALENDAR_EVENT_TYPES[reminder.type] ?? CALENDAR_EVENT_TYPES.reminder

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-control border border-border ${
        reminder.completed ? 'bg-app-bg opacity-60' : 'bg-app-bg'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-control text-[11px] font-semibold ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeStyle.label}
          </span>
        </div>
        <p
          className={`text-sm font-medium text-ink truncate ${
            reminder.completed ? 'line-through decoration-steel/60' : ''
          }`}
        >
          {reminder.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-steel">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {reminder.date} · {reminder.time}
          </span>
          <span>{getVetName(reminder.assignedVetId)}</span>
          {reminder.caseId && (
            <Link
              to={`/cases/${reminder.caseId}`}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Case #{reminder.caseId}
            </Link>
          )}
        </div>
      </div>

      {(onToggleComplete || onDelete) && (
        <div className="flex items-center gap-1 shrink-0">
          {onToggleComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleComplete(reminder.id)
              }}
              aria-label={reminder.completed ? 'Mark as not completed' : 'Mark as completed'}
              aria-pressed={reminder.completed}
              className={`flex items-center justify-center w-7 h-7 rounded-control border transition-colors ${
                reminder.completed
                  ? 'border-risk-low bg-risk-low/10 text-risk-low'
                  : 'border-border text-steel hover:bg-surface-hover hover:text-ink'
              }`}
            >
              <Check size={14} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(reminder.id)
              }}
              aria-label="Delete reminder"
              className="flex items-center justify-center w-7 h-7 rounded-control border border-border text-steel hover:bg-risk-high/10 hover:text-risk-high hover:border-risk-high/30"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
