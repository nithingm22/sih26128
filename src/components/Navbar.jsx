import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import CaseSearch from './CaseSearch'
import NotificationPanel from './NotificationPanel'

// Maps route path -> page title shown in the topbar breadcrumb.
// Kept simple (exact + prefix match) since routes are shallow.
const PAGE_TITLES = [
  { match: '/dashboard', title: 'Dashboard' },
  { match: '/cases/', title: 'Case Detail' },
  { match: '/cases', title: 'All Cases' },
  { match: '/map', title: 'Disease Surveillance Map' },
  { match: '/calendar', title: 'Calendar' },
  { match: '/tasks', title: 'My Tasks' },
  { match: '/admin/veterinarians', title: 'Veterinarian Management' },
  { match: '/admin', title: 'Admin Dashboard' },
  { match: '/login', title: 'Sign In' },
]

function resolveTitle(pathname) {
  const found = PAGE_TITLES.find(({ match }) => pathname.startsWith(match))
  return found ? found.title : 'Livestock Surveillance'
}

// Icon shown is the mode a click will switch TO — light mode shows
// the Moon (click to go dark), dark mode shows the Sun (click to go
// light) — per the approved toggle behavior.
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className="relative flex items-center justify-center w-9 h-9 rounded-control text-steel hover:bg-app-bg hover:text-ink transition-colors"
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-150 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-150 ${
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
    </button>
  )
}

export default function Navbar({ pathname, onMenuClick }) {
  const title = resolveTitle(pathname)

  return (
    <header className="h-15 shrink-0 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-control text-steel hover:bg-app-bg"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-ink truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <CaseSearch />

        <ThemeToggle />

        <NotificationPanel />

        <div className="flex items-center gap-2.5 pl-2 md:pl-3 border-l border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold shrink-0">
            V
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-ink">Dr. Vet User</p>
            <p className="text-[11px] text-steel">Veterinarian</p>
          </div>
        </div>
      </div>
    </header>
  )
}
