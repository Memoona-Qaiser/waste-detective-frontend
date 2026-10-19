import { useState } from 'react'
import { explainAlert } from './api'

export default function ExplainPanel({ id }) {
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    setBusy(true)
    setError('')
    try {
      setRes(await explainAlert(id))
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">AI explanation</h2>
        <button
          className="bg-slate-900 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
          onClick={run}
          disabled={busy}
        >
          {busy ? 'Likh raha hai...' : res ? 'Dobara likhein' : 'Samjhayein'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!res && !error && (
        <p className="text-sm text-slate-500">Button dabayein, alert ki saada zubaan mein wajah milegi.</p>
      )}
      {res && (
        <>
          <p className="text-sm leading-relaxed">{res.text}</p>
          <p className="text-xs text-slate-500 mt-2">
            {res.source === 'claude' ? 'Claude AI ne likha' : 'Template se banaya gaya (AI key set nahi)'}
          </p>
        </>
      )}
    </div>
  )
}