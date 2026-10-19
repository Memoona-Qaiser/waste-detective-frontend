export default function ModelPanel({ a }) {
  const m = a.models
  if (!m) return null

  const rows = [
    ['Median baseline', m.median],
    ['Isolation Forest', m.isolation_forest],
    ['Dono ka ittefaq (ensemble)', m.ensemble],
  ]
  const pct = (x) => `${(x * 100).toFixed(1)}%`
  const best = Math.max(...rows.map(([, r]) => r.precision))

  const color =
    a.confidence === 'High' ? 'bg-green-500' : a.confidence === 'Medium' ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <h2 className="font-semibold mb-3">AI confidence aur model comparison</h2>

      {a.confidence === 'Low' && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2 mb-3">
          Evidence kam hai. Is alert par action se pehle inspection ya mazeed readings chahiye.
        </p>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Confidence: <b>{a.confidence}</b></span>
          <span>{a.confidence_score}/100</span>
        </div>
        <div className="h-2 bg-slate-200 rounded">
          <div className={`h-2 rounded ${color}`} style={{ width: `${a.confidence_score}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Methods ka ittefaq {Math.round(a.confidence_parts.agreement * 100)}%, masla{' '}
          {a.nights_affected} raaton tak raha, data quality {Math.round(a.confidence_parts.data_quality * 100)}%.
          Anomaly score {a.anomaly_score} (1 ke qareeb matlab zyada anomalous).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2 pr-3">Method</th>
              <th className="pr-3">False alarms</th>
              <th className="pr-3">Missed</th>
              <th className="pr-3">Precision</th>
              <th>Recall</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, r]) => (
              <tr key={name} className={`border-b ${r.precision === best ? 'bg-green-50 font-medium' : ''}`}>
                <td className="py-2 pr-3">{name}</td>
                <td className="pr-3">{r.false_alarms}</td>
                <td className="pr-3">{r.missed}</td>
                <td className="pr-3">{pct(r.precision)}</td>
                <td>{pct(r.recall)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {m.eval_hours} ghanton par test hua, jin mein {m.true_waste_hours} asal waste ghante simulated labels
        se maloom the. Real data mein bhi labeled dataset (jaise LEAD) par isi tarah compare hoga.
      </p>
    </div>
  )
}