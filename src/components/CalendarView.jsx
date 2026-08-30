import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CALENDAR_EVENT_TYPES } from '../services/mockData'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Builds a fixed 6-week (42 cell) grid for the given month, filled
// out with the trailing days of the previous month and the leading
// days of the next so the grid never has ragged/partial rows.
function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = 0; i < startOffset; i++) {
    const day = daysInPrevMonth - startOffset + i + 1
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    cells.push({ day, dateStr: toDateStr(prevYear, prevMonth, day), inMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dateStr: toDateStr(year, month, day), inMonth: true })
  }

  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  let nextDay = 1
  while (cells.length < 42) {
    cells.push({ day: nextDay, dateStr: toDateStr(nextYear, nextMonth, nextDay), inMonth: false })
    nextDay++
  }

  return cells
}

// Presentational month grid — Calendar.jsx owns the year/month and
// selectedDate state and passes everything in, so this component has
// no data-fetching or interactive-state concerns of its own.
export default function CalendarView({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) {
  const cells = buildMonthGrid(year, month)
  // Local date, not UTC (see the matching comment in Calendar.jsx's
  // todayStr) — otherwise the "today" highlight can land on the
  // wrong grid cell near midnight in timezones ahead of UTC.
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const eventsByDate = new Map()
  for (const e of events) {
    if (!eventsByDate.has(e.date)) eventsByDate.set(e.date, [])
    eventsByDate.get(e.date).push(e)
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink">
          {MONTH_LABELS[month]} {year}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToday}
            className="h-8 px-3 rounded-control border border-border text-xs font-medium text-ink hover:bg-app-bg transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="flex items-center justify-center w-8 h-8 rounded-control border border-border text-steel hover:bg-app-bg hover:text-ink transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex items-center justify-center w-8 h-8 rounded-control border border-border text-steel hover:bg-app-bg hover:text-ink transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[11px] font-semibold uppercase tracking-wide text-steel py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const dayEvents = eventsByDate.get(cell.dateStr) ?? []
          const types = [...new Set(dayEvents.map((e) => e.type))]
          const isToday = cell.dateStr === todayStr
          const isSelected = cell.dateStr === selectedDate

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onSelectDate(cell.dateStr)}
              className={`aspect-square sm:aspect-auto sm:h-20 flex flex-col items-start p-1.5 rounded-control border text-left transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-transparent hover:bg-app-bg'
              } ${!cell.inMonth ? 'opacity-40' : ''}`}
            >
              <span
                className={`text-xs font-medium ${
                  isToday
                    ? 'flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white'
                    : 'text-ink'
                }`}
              >
                {cell.day}
              </span>
              {types.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-auto pt-1">
                  {types.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className={`w-1.5 h-1.5 rounded-full ${
                        CALENDAR_EVENT_TYPES[type]?.dot ?? 'bg-steel'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                  {types.length > 3 && (
                    <span className="text-[9px] leading-none text-steel">
                      +{types.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-border">
        {Object.entries(CALENDAR_EVENT_TYPES).map(([type, cfg]) => (
          <span key={type} className="flex items-center gap-1.5 text-[11px] text-steel">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  )
}
