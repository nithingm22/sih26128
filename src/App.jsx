import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CaseList from './pages/CaseList'
import CaseDetail from './pages/CaseDetail'
import MapView from './pages/MapView'
import AdminDashboard from './pages/AdminDashboard'
import AdminVeterinarians from './pages/AdminVeterinarians'
import Calendar from './pages/Calendar'
import Tasks from './pages/Tasks'

export default function App() {
  return (
    <Routes>
      {/* Login has no sidebar/topbar chrome */}
      <Route path="/login" element={<Login />} />

      {/* Everything else lives inside the app shell */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cases" element={<CaseList />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/veterinarians" element={<AdminVeterinarians />} />
      </Route>

      {/* Default: send root to the dashboard for now (no auth gate yet) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
