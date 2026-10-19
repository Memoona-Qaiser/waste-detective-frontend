export default function SavingsPanel({ a }) {
  if (a.savings_min_rs === undefined) return null

  const fmt = (n) => Number(n).toLocaleString()
  const minPct = a.savings_max_rs > 0 ? (a.savings_min_rs / a.savings_max_rs) * 100 : 0

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <h2 className="font-semibold mb-1">Potential savings (range)</h2>
      <p className="text-2xl font-bold">
        Rs {fmt(a.savings_min_rs)} se Rs {fmt(a.savings_max_rs)}
      </p>
      <p className="text-sm text-slate-500 mb-3">
        Excess cost Rs {fmt(a.potential_cost_rs)} hai. Confidence {a.confidence_score}/100 ke hisaab se
        {' '}{Math.round(a.savings_uncertainty * 100)}% ki gunjaish rakhi gayi.
      </p>

      <div className="relative h-3 bg-slate-200 rounded mb-1">
        <div
          className="absolute h-3 bg-green-500 rounded"
          style={{ left: `${minPct}%`, width: `${100 - minPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mb-4">
        <span>Rs 0</span>
        <span>Rs {fmt(a.savings_max_rs)}</span>
      </div>

      <p className="font-medium text-sm mb-1">Assumptions aur uncertainty</p>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {a.savings_assumptions.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  )
}