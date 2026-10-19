import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AlertDetail from './pages/AlertDetail'
import Tasks from './pages/Tasks'
import Verification from './pages/Verification'
import Audit from './pages/Audit'
import Upload from './pages/Upload'
import Reports from './pages/Reports'
import HowItWorks from './pages/HowItWorks'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { getUser, logout } from './api'

export default function App() {
  const [user, setUser] = useState(getUser())

  if (!user) return <Login onLogin={setUser} />

  const role = user.role

  function handleLogout() {
    logout()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="print:hidden bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-semibold">
          🔍 Resource Waste Detective
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/verification">Verification</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/audit">Audit</Link>
          <span className="bg-slate-700 rounded px-2 py-1">
            {user.name} ({role})
          </span>
          <button onClick={handleLogout} className="border border-slate-500 rounded px-2 py-1">
            Logout
          </button>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts/:id" element={<AlertDetail role={role} />} />
          <Route path="/tasks" element={<Tasks role={role} />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/settings" element={<Settings role={role} />} />
          <Route path="/audit" element={<Audit />} />
        </Routes>
      </main>
    </div>
  )
}