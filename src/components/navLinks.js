import {
  LayoutDashboard,
  ClipboardList,
  Map as MapIcon,
  ShieldCheck,
  CalendarDays,
  ListChecks,
  UserCog,
} from 'lucide-react'

// Flat list, used by the mobile drawer.
export const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases', label: 'All Cases', icon: ClipboardList },
  { to: '/map', label: 'Disease Map', icon: MapIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
  { to: '/admin/veterinarians', label: 'Veterinarian Management', icon: UserCog },
]

// Grouped by section, used by the desktop Sidebar.
export const NAV_SECTIONS = [
  { label: 'Overview', items: [NAV_LINKS[0]] },
  { label: 'Cases', items: [NAV_LINKS[1]] },
  { label: 'Surveillance', items: [NAV_LINKS[2]] },
  { label: 'Planning', items: [NAV_LINKS[3], NAV_LINKS[4]] },
  { label: 'Administration', items: [NAV_LINKS[5], NAV_LINKS[6]] },
]
