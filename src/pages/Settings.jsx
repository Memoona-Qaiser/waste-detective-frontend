import { useEffect, useState } from 'react'
import { fetchSettings, saveSettings } from '../api'

const DEFAULTS = { tariff: 60, water_tariff: 200, min_after_nights: 5 }

function Field({ label, hint, value, onChange, disabled }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full border rounded px-3 py-2 disabled:bg-slate-100"
      />
      <span className="text-xs text-slate-500">{hint}</span>
    </label>
  )
}

export default function Settings({ role }) {
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const canEdit = role === 'Manager'

  useEffect(() => {
    fetchSettings()
      .then(setForm)
      .catch(() => setError('Backend se rabta nahi hua. Check karein ke uvicorn chal raha hai.'))
  }, [])

  async function save(values) {
    setMsg('')
    setError('')
    try {
      const data = await saveSettings({
        tariff: Number(values.tariff),
        water_tariff: Number(values.water_tariff),
        min_after_nights: Number(values.min_after_nights),
      })
      setForm(data)
      setMsg('Settings save ho gayin. Dashboard ki cost aur bachat range naye tariff se dobara bani hain.')
    } catch (e) {
      setError(e.message)
    }
  }

  if (!form) return <p>{error || 'Load ho raha hai...'}</p>

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-slate-500">
        Tariff aur verification ke rules yahan se badlein. Save karte hi alerts ki cost,
        bachat range, ranking aur verification naye numbers se dobara banti hain.
      </p>

      {!canEdit && (
        <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded p-3 text-sm">
          Settings sirf Manager badal sakta hai.
        </div>
      )}

      <div className="bg-white border rounded-lg p-4 space-y-4">
        <Field
          label="Bijli ka tariff (Rs per kWh)"
          hint="Excess kWh ko paison mein badalne ke liye."
          value={form.tariff}
          disabled={!canEdit}
          onChange={(v) => setForm({ ...form, tariff: v })}
        />
        <Field
          label="Paani ka tariff (Rs per m3)"
          hint="Ye ek assumption hai, apne area ke asli rate se badal dein."
          value={form.water_tariff}
          disabled={!canEdit}
          onChange={(v) => setForm({ ...form, water_tariff: v })}
        />
        <Field
          label="Verification ke liye kam az kam raatein"
          hint="Action ke baad itni raaton ka data na ho to verified savings Rs 0 rehti hain."
          value={form.min_after_nights}
          disabled={!canEdit}
          onChange={(v) => setForm({ ...form, min_after_nights: v })}
        />

        {canEdit && (
          <div className="flex gap-2">
            <button onClick={() => save(form)} className="bg-slate-900 text-white px-4 py-2 rounded">
              Save karein
            </button>
            <button onClick={() => save(DEFAULTS)} className="border px-4 py-2 rounded">
              Default par wapas
            </button>
          </div>
        )}
      </div>

      {msg && <div className="border border-green-300 bg-green-50 text-green-800 rounded p-3 text-sm">{msg}</div>}
      {error && <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3 text-sm">{error}</div>}
    </div>
  )
}