import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, Clock, ListTodo } from 'lucide-react'
import { getNotifications } from '../services/mockData'

const KIND_ICON = {
  deadline_overdue: { icon: AlertTriangle, color: 'text-risk-high' },
  deadline_upcoming: { icon: Clock, color: 'text-risk-medium' },
  reminder_due: { icon: Bell, color: 'text-accent-blue' },
  task_overdue: { icon: ListTodo, color: 'text-risk-high' },
}

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Frontend/mock-only notification feed — there's no real push or
// email delivery yet (see getNotifications in mockData.js). Read/
// unread is tracked in this component's local state only, so it
// resets on page reload; that's expected until a backend exists to
// persist it.
export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => new Set())
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const notifications = useMemo(() => getNotifications(), [])
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  useEffect(() => {
    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleSelect(notification) {
    setReadIds((current) => new Set(current).add(notification.id))
    setIsOpen(false)
    navigate(notification.link)
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)))
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center justify-center w-9 h-9 rounded-control text-steel hover:bg-app-bg relative"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-risk-high text-white text-[10px] font-semibold leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 max-h-96 overflow-y-auto rounded-card border border-border bg-surface shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-ink">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-primary hover:text-primary-hover"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-sm text-steel text-center">No notifications right now.</p>
          ) : (
            <ul>
              {notifications.map((n) => {
                const unread = !readIds.has(n.id)
                const { icon: Icon, color } = KIND_ICON[n.kind] ?? { icon: Bell, color: 'text-steel' }
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border last:border-b-0 hover:bg-app-bg transition-colors ${
                        unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <Icon size={16} className={`shrink-0 mt-0.5 ${color}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm truncate ${unread ? 'font-semibold text-ink' : 'text-steel'}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-steel mt-0.5">{formatWhen(n.at)}</p>
                      </div>
                      {unread && (
                        <span
                          className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
