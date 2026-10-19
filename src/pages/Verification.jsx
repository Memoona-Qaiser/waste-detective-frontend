import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { fetchAlerts, fetchVerifications } from '../api'
import { Badge } from '../labels'

export default function Verification() {
  const [alerts, setAlerts] = useState([])
  const [verif, setVerif] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAlerts(), fetchVerifications()])
      .then(([a, v]) => {
        setAlerts(a)
        setVerif(v)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Verification</h1>
      <p className="text-sm text-slate-500 mb-4">
        Estimated aur verified savings alag rakhe gaye hain. Verification tabhi hoti hai
        jab technician kaam complete kare. Illustrative simulated data.
      </p>

      <div className="space-y-6">
        {alerts.map((alert) => {
          const v = verif[alert.id]
          const icon = alert.resource === 'water' ? '💧' : '⚡'

          if (!v) {
            return (
              <div key={alert.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{icon} {alert.building}: {alert.title}</p>
                  <Badge state={alert.state} />
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Verification pending. Pehle review, approval aur technician ka kaam complete hona zaroori hai.
                </p>
              </div>
            )
          }

          if (v.insufficient) {
            return (
              <div key={alert.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{icon} {alert.building}: {alert.title}</p>
                  <Badge state={alert.state} />
                </div>
                <div className="mt-2 text-sm bg-amber-50 border border-amber-200 rounded p-3 text-amber-800">
                  <p className="font-medium mb-1">Verified savings: Rs 0 (abhi confirm nahi)</p>
                  <p>{v.message}</p>
                  <p className="text-xs mt-1">
                    Ab tak {v.nights_after} raatein, zaroorat {v.required_nights}.
                  </p>
                </div>
              </div>
            )
          }

          const label = v.period === 'din' ? 'Din' : 'Raat'
          const data = v.before.map((b, i) => ({
            period: `${label} ${i + 1}`,
            before: b,
            after: v.after[i],
            expected: v.expected,
          }))

          return (
            <div key={alert.id} className="bg-white border rounded-lg p-4">
              <p className="font-semibold mb-4">{icon} {alert.building}: {alert.title}</p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                <Box label={`Estimated savings (per ${v.period})`} value={`Rs ${v.estimated_per_night_rs.toLocaleString()}`} />
                <Box label={`Verified savings (per ${v.period})`} value={`Rs ${v.verified_per_night_rs.toLocaleString()}`} highlight />
                <Box label="Measured reduction" value={`${v.reduction_per_hour} ${v.unit}`} />
                <Box label={`Verified total (${v.nights_after} ${v.period_plural})`} value={`Rs ${v.verified_total_rs.toLocaleString()}`} highlight />
              </div>

              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis unit={` ${v.total_unit}`} domain={[0, 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="before" name="Action se pehle" stroke="#dc2626" />
                    <Line type="monotone" dataKey="after" name="Action ke baad" stroke="#2563eb" />
                    <Line type="monotone" dataKey="expected" name="Expected" stroke="#16a34a" strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="font-medium text-sm mb-1">Comparison checks</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {v.checks.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Box({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'bg-green-50 border-green-300' : ''}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}