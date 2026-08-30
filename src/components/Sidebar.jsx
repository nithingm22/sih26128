import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PawPrint, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { NAV_SECTIONS } from './navLinks'

// Sidebar is organized around the six approved core pages only —
// no High Risk / Under Review / Referred / Lab Pending / Resolved
// sub-pages; those are filters inside CaseList, not separate routes.

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-sidebar-bg text-white transition-[width] duration-150 ${
        collapsed ? 'w-16' : 'w-62'
      }`}
    >
      {/* Branding */}
      <div className="flex items-center gap-2.5 h-15 px-4 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-control bg-primary shrink-0">
          <PawPrint size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">
              Livestock Surveillance
            </p>
            <p className="text-[11px] text-white/45 leading-tight truncate">
              SIH26128
            </p>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold tracking-wide uppercase text-white/45">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-control text-sm font-medium border-l-[3px] transition-colors ${
                        isActive
                          ? 'bg-white/10 border-primary text-white'
                          : 'border-transparent text-white/75 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 px-4 py-3 text-white/60 hover:text-white text-xs border-t border-white/10"
      >
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  )
}
