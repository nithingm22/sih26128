import { useState } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { X, PawPrint } from 'lucide-react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { NAV_LINKS } from './navLinks'

export default function AppLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      {/* Mobile drawer nav — reuses the same link set as Sidebar */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 bg-sidebar-bg text-white flex flex-col">
            <div className="flex items-center justify-between h-15 px-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-control bg-primary shrink-0">
                  <PawPrint size={18} className="text-white" />
                </div>
                <p className="text-sm font-semibold truncate">
                  Livestock Surveillance
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <ul className="space-y-0.5">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end
                      onClick={() => setMobileNavOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-control text-sm font-medium border-l-[3px] ${
                          isActive
                            ? 'bg-white/10 border-primary text-white'
                            : 'border-transparent text-white/75'
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pathname={location.pathname}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-app-bg p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
