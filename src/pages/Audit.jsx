import { useEffect, useState } from 'react'
import { fetchAudit, resetDemo } from '../api'

export default function Audit() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  const load = () => fetchAudit().then(setRows).catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const reset = async () => {
    if (!window.confirm('Demo data saaf karna hai? Sab alerts dobara "new" ho jayenge.')) return
    await resetDemo()
    await load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <button className="text-sm border rounded px-3 py-1" onClick={reset}>
          Demo reset
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {rows.length === 0 && <p className="text-slate-500">Abhi koi record nahi.</p>}

      <div className="bg-white border rounded-lg divide-y overflow-x-auto">
        {rows.map((r) => (
          <div key={r.id} className="p-3 text-sm">
            <div className="flex justify-between gap-3">
              <p className="font-medium">{r.event}</p>
              <p className="text-xs text-slate-500">{r.ts}</p>
            </div>
            <p className="text-slate-600">
              {r.actor}: {r.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}