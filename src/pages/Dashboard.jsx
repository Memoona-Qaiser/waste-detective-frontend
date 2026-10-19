import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAlerts, fetchVerifications, fetchOverview } from '../api'
import { Badge } from '../labels'

const fmt = (n) => Number(n).toLocaleString()

// Savings range backend se aayegi. Na aaye to purani single cost istemal hoti hai.
const rangeOf = (a) => [
  a.savings_min_rs ?? a.potential_cost_rs,
  a.savings_max_rs ?? a.potential_cost_rs,
]

export default function Dashboard() {
  const [alerts, setAlerts] = useState([])
  const [verif, setVerif] = useState({})
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAlerts(), fetchVerifications(), fetchOverview()])
      .then(([a, v, o]) => {
        setAlerts(a)
        setVerif(v)
        setOverview(o)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error)
    return (
      <p className="text-red-600">
        {error}. Check karein ke backend (uvicorn) chal raha hai.
      </p>
    )

  const open = alerts.filter((a) => !['completed', 'false_alarm'].includes(a.state))
  const totalExcess = open.reduce((s, a) => s + a.potential_cost_rs, 0)
  const totalMin = open.reduce((s, a) => s + rangeOf(a)[0], 0)
  const totalMax = open.reduce((s, a) => s + rangeOf(a)[1], 0)
  const totalVerified = Object.values(verif).reduce((s, v) => s + (v.verified_total_rs || 0), 0)

  const confColor = (c) =>
    c === 'High' ? 'text-green-700' : c === 'Medium' ? 'text-amber-700' : 'text-red-700'

  return (
    <div>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-4">
        Illustrative simulated data, actual building measurements nahi hain.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Stat label="Buildings monitored" value={overview.monitored} />
        <Stat label="Open alerts" value={open.length} />
        <Stat
          label="Potential savings (range)"
          value={`Rs ${fmt(totalMin)} - ${fmt(totalMax)}`}
          note={`Excess cost: Rs ${fmt(totalExcess)}`}
          small
        />
        <Stat label="Verified savings" value={`Rs ${fmt(totalVerified)}`} />
      </div>

      <h2 className="text-lg font-semibold">Priority alerts</h2>
      <p className="text-xs text-slate-500 mb-3">
        Priority = potential cost aur confidence ko mila kar. Zyada cost aur zyada confidence wala alert upar.
      </p>

      <div className="space-y-3">
        {alerts.map((a) => {
          const [lo, hi] = rangeOf(a)
          return (
            <Link
              key={a.id}
              to={`/alerts/${a.id}`}
              className="block bg-white rounded-lg border p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">
                    {a.rank}
                  </span>
                  <div>
                    <p className="font-medium">{a.resource === 'water' ? '💧' : '⚡'} {a.building}</p>
                    <p className="text-sm text-slate-500">{a.title}</p>
                    <p className={`text-xs ${confColor(a.confidence)}`}>
                      Confidence: {a.confidence} ({a.confidence_score}/100)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Excess cost</p>
                  <p className="font-semibold">Rs {fmt(a.potential_cost_rs)}</p>
                  <p className="text-xs text-green-700">Bachat range: Rs {fmt(lo)} - {fmt(hi)}</p>
                  <div className="mt-1">
                    <Badge state={a.state} />
                  </div>
                  {a.state === 'new' && a.status.startsWith('Uncertain') && (
                    <p className="text-xs text-red-700 mt-1">Uncertain: mazeed data chahiye</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {overview.normal.length > 0 && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2 mt-4">
          Normal usage: {overview.normal.join(', ')}. Koi unusual usage nahi mili.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, note, small }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`${small ? 'text-lg' : 'text-2xl'} font-bold mt-1`}>{value}</p>
      {note && <p className="text-xs text-slate-500 mt-1">{note}</p>}
    </div>
  )
}