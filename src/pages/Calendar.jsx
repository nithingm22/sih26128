import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, CalendarDays, MapPin } from 'lucide-react'
import CalendarView from '../components/CalendarView'
import DeadlineCard from '../components/DeadlineCard'
import ReminderCard from '../components/ReminderCard'
import { CALENDAR_EVENT_TYPES, REMINDER_TYPES, PRIORITY_LEVELS, getAssignableVets, getReminders, getCalendarEvents, getEventsForDate, getUpcomingDeadlines } from '../services/mockData'

// Local calendar date as 'YYYY-MM-DD' — deliberately NOT
// `new Date().toISOString().slice(0, 10)`, which reads the UTC date
// and can silently land on the wrong day near midnight in timezones
// ahead of UTC (e.g. IST, UTC+5:30). Every "today" comparison in this
// file (default reminder date, day-panel default) goes through this.
function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSelectedDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// Frontend-only "Add Reminder" form. There is no POST /reminders
// endpoint yet, so submitting appends to Calendar.jsx's local
// reminders state only — the same pattern NewCaseModal already uses
// for cases.
function AddReminderModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [caseId, setCaseId] = useState('')
  const [assignedVetId, setAssignedVetId] = useState('')
  const [date, setDate] = useState(todayStr())
  const [time, setTime] = useState('09:00')
  const [priority, setPriority] = useState('medium')
  const [type, setType] = useState('reminder')
  const titleId = useId()

  if (!open) return null

  function resetAndClose() {
    setTitle('')
    setCaseId('')
    setAssignedVetId('')
    setDate(todayStr())
    setTime('09:00')
    setPriority('medium')
    setType('reminder')
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      caseId: caseId === '' ? null : Number(caseId),
      assignedVetId: assignedVetId === '' ? null : Number(assignedVetId),
      date,
      time,
      priority,
      type,
      completed: false,
    })
    resetAndClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={resetAndClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold text-ink">
            Add Reminder
          </h2>
          <button type="button" onClick={resetAndClose} aria-label="Close" className="text-steel hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-steel mb-1.5">Reminder title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-steel mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-steel mb-1.5">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-steel mb-1.5">Reminder type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
            >
              {REMINDER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-steel mb-1.5">Related Case ID</label>
              <input
                type="number"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="Optional"
                className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-steel mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
              >
                {PRIORITY_LEVELS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-steel mb-1.5">Assigned to</label>
            <select
              value={assignedVetId}
              onChange={(e) => setAssignedVetId(e.target.value)}
              className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
            >
              <option value="">Unassigned</option>
              {getAssignableVets().map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-steel bg-app-bg border border-border rounded-control px-3 py-2.5">
            Reminders are kept in this browser session only — not sent or saved to a backend yet.
          </p>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={resetAndClose}
              className="h-10 px-4 rounded-control border border-border text-sm font-medium text-ink hover:bg-app-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Full-detail popup for a single calendar event — deliberately
// separate from the compact DeadlineCard/ReminderCard rows so
// clicking an event always shows everything about it in one place.
function EventDetailModal({ event, onClose }) {
  if (!event) return null
  const typeStyle = CALENDAR_EVENT_TYPES[event.type] ?? CALENDAR_EVENT_TYPES.reminder

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm bg-surface border border-border rounded-card p-6 shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-control text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeStyle.label}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="text-steel hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-ink mb-1">{event.title}</h2>
        {event.description && (
          <p className="text-sm text-steel mb-4">{event.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-steel">
            <CalendarDays size={14} />
            {event.date} · {event.time}
          </div>
          {event.caseId && (
            <div className="flex items-center gap-2 text-steel">
              <MapPin size={14} />
              <Link to={`/cases/${event.caseId}`} className="text-primary hover:text-primary-hover font-medium">
                View Case #{event.caseId}
              </Link>
            </div>
          )}
        </div>

        <p className="text-xs text-steel bg-app-bg border border-border rounded-control px-3 py-2.5 mt-4">
          {event.kind === 'deadline'
            ? 'Deadline details shown here are from local demo data — not yet synced with a backend.'
            : 'Reminder details shown here are kept in this browser session only.'}
        </p>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [reminders, setReminders] = useState(() => getReminders())
  const [addOpen, setAddOpen] = useState(false)
  const [detailEvent, setDetailEvent] = useState(null)

  const events = useMemo(() => getCalendarEvents(reminders), [reminders])
  const dayEvents = useMemo(
    () => getEventsForDate(selectedDate, reminders),
    [selectedDate, reminders],
  )
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(4), [])

  function goToMonth(delta) {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  function goToToday() {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setSelectedDate(todayStr())
  }

  function handleAddReminder(reminder) {
    setReminders((current) => [
      ...current,
      { ...reminder, id: current.length ? Math.max(...current.map((r) => r.id)) + 1 : 1 },
    ])
  }

  function handleToggleComplete(id) {
    setReminders((current) =>
      current.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    )
  }

  function handleDelete(id) {
    setReminders((current) => current.filter((r) => r.id !== id))
  }

  function openEventDetail(event) {
    setDetailEvent(event)
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Calendar</h2>
          <p className="text-sm text-steel mt-1">
            Deadlines, reminders, and scheduled follow-ups across all cases.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month grid */}
        <div className="lg:col-span-2">
          <CalendarView
            year={year}
            month={month}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevMonth={() => goToMonth(-1)}
            onNextMonth={() => goToMonth(1)}
            onToday={goToToday}
          />
        </div>

        {/* Sidebar: selected day + upcoming deadlines */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1">
              {formatSelectedDate(selectedDate)}
            </h3>
            <p className="text-xs text-steel mb-4">
              {dayEvents.length === 0
                ? 'No deadlines or reminders on this date.'
                : `${dayEvents.length} item${dayEvents.length > 1 ? 's' : ''} scheduled`}
            </p>

            <div className="space-y-2.5">
              {dayEvents.map((event) => (
                // A div (not a button/anchor) wrapper — ReminderCard
                // renders its own real buttons and a case Link inside,
                // and interactive elements can't be nested inside
                // <button>. Those inner controls stopPropagation() so
                // they don't also trigger this row's "open details".
                <div
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEventDetail(event)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openEventDetail(event)
                    }
                  }}
                  className="cursor-pointer"
                >
                  {event.kind === 'deadline' ? (
                    // Calendar events use the unified date/time field
                    // names (see getCalendarEvents in mockData.js);
                    // DeadlineCard expects dueDate/dueTime. Without
                    // this remap, deadline.dueDate is undefined and
                    // formatDueDate() renders "Invalid Date".
                    <DeadlineCard deadline={{ ...event, dueDate: event.date, dueTime: event.time }} />
                  ) : (
                    <ReminderCard
                      reminder={{ ...event, id: Number(event.id.replace('reminder-', '')) }}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-card p-5">
            <h3 className="text-base font-semibold text-ink mb-1">Upcoming Deadlines</h3>
            <p className="text-xs text-steel mb-4">Next deadlines across all cases</p>
            <div className="space-y-2.5">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((d) => <DeadlineCard key={d.id} deadline={d} />)
              ) : (
                <p className="text-sm text-steel text-center py-4">No upcoming deadlines.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddReminderModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAddReminder} />
      <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />
    </div>
  )
}
