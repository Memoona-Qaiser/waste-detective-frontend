import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { fetchAlerts, reviewAlert, approveAlert } from '../api'
import { Badge } from '../labels'
import ModelPanel from '../ModelPanel'
import ExplainPanel from '../ExplainPanel'
import SavingsPanel from '../SavingsPanel'

export default function AlertDetail({ role }) {
  const { id } = useParams()
  const [a, setA] = useState(null)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [assignee, setAssignee] = useState('Ali (Technician)')
  const [priority, setPriority] = useState('High')
  const [due, setDue] = useState('2026-10-20')

  const load = () =>
    fetchAlerts()
      .then((list) => setA(list.find((x) => x.id === Number(id)) || null))
      .catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [id])

  const run = async (fn) => {
    setError('')
    try {
      await fn()
      setReason('')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (!a) return <p>{error || 'Loading...'}</p>

  const ratio = a.measured / a.expected
  const vsExpected =
    ratio > 10
      ? `${Math.round(ratio)} guna`
      : `${Math.round((a.excess_per_hour / a.expected) * 100)}%`
  const isManager = role === 'Manager'
  const icon = a.resource === 'water' ? '💧' : '⚡'

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600">← Dashboard</Link>
      <div className="flex items-center gap-3 mt-2">
        <h1 className="text-2xl font-bold">{icon} {a.building}</h1>
        <Badge state={a.state} />
      </div>
      <p className="text-slate-600">{a.title}</p>
      <p className="text-xs text-slate-500 mb-4">
        Illustrative simulated data, actual building measurements nahi hain.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Box label={`Expected (${a.unit})`} value={a.expected} />
        <Box label={`Measured (${a.unit})`} value={a.measured} />
        <Box label={`Excess (${a.unit})`} value={a.excess_per_hour} />
        <Box label="Excess vs expected" value={vsExpected} />
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6 h-72">
        <p className="text-sm text-slate-500 mb-2">Aakhri flagged raat ka ghante ke hisaab se usage</p>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={a.hourly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis unit={` ${a.total_unit}`} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expected" stroke="#16a34a" dot={false} />
            <Line type="monotone" dataKey="actual" stroke="#dc2626" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Section title="Evidence">
        <ul className="list-disc pl-5 space-y-1">
          {a.evidence.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
        <p className="text-sm text-slate-500 mt-2">
          Confidence: {a.confidence} ({a.confidence_score}/100). Method: {a.method}
        </p>
      </Section>

      <ModelPanel a={a} />
      <ExplainPanel id={a.id} />

      <Section title="Potential excess cost">
        <p>
          {a.nights_affected} raaton mein {a.total_excess.toLocaleString()} {a.total_unit} excess,{' '}
          {a.tariff_text} par potential excess cost <b>Rs {a.potential_cost_rs.toLocaleString()}</b>.
          Ye tabhi actual saving banegi jab masla confirm ho aur door ho sake.
        </p>
      </Section>

      <SavingsPanel a={a} />

      <Section title="Suggested next action">
        <p>{a.action}</p>
      </Section>

      <Section title="Manager review">
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {a.reason && (
          <p className="text-sm text-slate-600 mb-2">Wajah / note: {a.reason}</p>
        )}

        {!isManager && (
          <p className="text-sm text-slate-500">
            Review aur approval sirf Manager kar sakta hai. Upar se role badlein.
          </p>
        )}

        {isManager && (a.state === 'new' || a.state === 'needs_data') && (
          <div className="space-y-3">
            <input
              className="w-full border rounded p-2"
              placeholder="Wajah (False alarm aur Needs more data ke liye zaroori hai)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => run(() => reviewAlert(a.id, { decision: 'valid', reason, actor: role }))}
              >
                Valid issue
              </button>
              <button
                className="bg-slate-600 text-white px-4 py-2 rounded"
                onClick={() => run(() => reviewAlert(a.id, { decision: 'false_alarm', reason, actor: role }))}
              >
                False alarm
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={() => run(() => reviewAlert(a.id, { decision: 'needs_data', reason, actor: role }))}
              >
                Needs more data
              </button>
            </div>
          </div>
        )}

        {isManager && a.state === 'valid_issue' && (
          <div className="space-y-3">
            <p className="text-sm">Corrective action approve karein ya wajah ke saath defer karein.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select className="border rounded p-2" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option>Ali (Technician)</option>
                <option>Sara (Technician)</option>
              </select>
              <select className="border rounded p-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input type="date" className="border rounded p-2" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
            <input
              className="w-full border rounded p-2"
              placeholder="Defer ki wajah (sirf defer ke liye zaroori)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() =>
                  run(() =>
                    approveAlert(a.id, { approve: true, assignee, priority, due_date: due, actor: role })
                  )
                }
              >
                Approve aur task assign karein
              </button>
              <button
                className="bg-slate-600 text-white px-4 py-2 rounded"
                onClick={() => run(() => approveAlert(a.id, { approve: false, reason, actor: role }))}
              >
                Defer
              </button>
            </div>
          </div>
        )}

        {a.state === 'task_assigned' && (
          <p className="text-sm">Task assign ho chuka hai. Technician ke kaam complete karne ka intezar hai (Tasks page).</p>
        )}
        {a.state === 'completed' && (
          <p className="text-sm">
            Kaam complete ho chuka hai. <Link to="/verification" className="text-blue-600">Verification dekhein</Link>.
          </p>
        )}
        {(a.state === 'false_alarm' || a.state === 'deferred') && (
          <p className="text-sm text-slate-500">Is alert par koi aur action nahi hoga.</p>
        )}
      </Section>
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

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}