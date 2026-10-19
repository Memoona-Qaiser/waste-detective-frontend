import { useEffect, useState } from 'react'
import { fetchAlerts, fetchVerifications, fetchTasks, fetchAudit } from '../api'
import { STATE } from '../labels'

export default function Reports() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchAlerts(), fetchVerifications(), fetchTasks(), fetchAudit()])
      .then(([alerts, verif, tasks, audit]) => setData({ alerts, verif, tasks, audit }))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-red-600">{error}</p>
  if (!data) return <p>Loading...</p>

  const { alerts, verif, tasks, audit } = data
  const estimated = alerts.reduce((s, a) => s + a.potential_cost_rs, 0)
  const verified = Object.values(verif).reduce((s, v) => s + (v.verified_total_rs || 0), 0)
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Resource Waste Report</h1>
          <p className="text-sm text-slate-500">
            Tareekh: {new Date().toLocaleDateString()} | Illustrative simulated data
          </p>
        </div>
        <button
          className="bg-slate-900 text-white px-4 py-2 rounded print:hidden"
          onClick={() => window.print()}
        >
          Print / PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Box label="Estimated avoidable cost" value={`Rs ${estimated.toLocaleString()}`} />
        <Box label="Verified savings" value={`Rs ${verified.toLocaleString()}`} />
        <Box label="Tasks complete" value={`${done} / ${tasks.length}`} />
      </div>
      <p className="text-xs text-slate-500 mb-6">
        Estimated aur verified savings alag hain. Estimated sirf excess consumption ka andaza hai,
        verified wo hai jo action ke baad data se naapi gayi.
      </p>

      <h2 className="font-semibold mb-2">Alerts</h2>
      <table className="w-full text-sm mb-6 bg-white border rounded">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="p-2">#</th>
            <th>Building</th>
            <th>Status</th>
            <th>Confidence</th>
            <th>Potential cost</th>
            <th>Verified savings</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => {
            const v = verif[a.id]
            return (
              <tr key={a.id} className="border-b">
                <td className="p-2">{a.rank}</td>
                <td>{a.building}</td>
                <td>{(STATE[a.state] || STATE.new).text}</td>
                <td>{a.confidence} ({a.confidence_score})</td>
                <td>Rs {a.potential_cost_rs.toLocaleString()}</td>
                <td>
                  {v
                    ? v.insufficient
                      ? 'Confirm nahi (data kam)'
                      : `Rs ${v.verified_total_rs.toLocaleString()}`
                    : 'Verify nahi hui'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h2 className="font-semibold mb-2">Maintenance tasks</h2>
      <table className="w-full text-sm mb-6 bg-white border rounded">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="p-2">Task</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr><td className="p-2 text-slate-500" colSpan={4}>Koi task nahi.</td></tr>
          )}
          {tasks.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-2">{t.title}</td>
              <td>{t.assignee}</td>
              <td>{t.priority}</td>
              <td>{t.status === 'done' ? 'Done' : 'Open'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-semibold mb-2">Audit trail (aakhri 10)</h2>
      <div className="bg-white border rounded divide-y text-sm">
        {audit.length === 0 && <p className="p-2 text-slate-500">Abhi koi record nahi.</p>}
        {audit.slice(0, 10).map((r) => (
          <p key={r.id} className="p-2">
            <span className="text-slate-500">{r.ts}</span> {r.actor}: {r.event}
          </p>
        ))}
      </div>
    </div>
  )
}

function Box({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}