import { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await login(username, password)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">🔍 Resource Waste Detective</h1>
          <p className="text-sm text-slate-500">Login karein</p>
        </div>

        <form onSubmit={submit} className="bg-white border rounded-lg p-4 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold">Username</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && (
            <div className="border border-red-300 bg-red-50 text-red-700 rounded p-2 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={busy || !username || !password}
            className="w-full bg-slate-900 text-white py-2 rounded disabled:opacity-40"
          >
            {busy ? 'Check ho raha hai...' : 'Login'}
          </button>
        </form>

        <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded p-3 text-xs space-y-1">
          <p className="font-semibold">Demo accounts (simulated system)</p>
          <p>manager / manager123: review, approve, settings</p>
          <p>ali / ali123: Technician, task complete karta hai</p>
          <p>auditor / auditor123: sirf dekh sakta hai</p>
        </div>
      </div>
    </div>
  )
}