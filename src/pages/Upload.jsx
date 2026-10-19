import { useState } from "react";

const BASE = "http://127.0.0.1:8000/api";

export default function Upload() {
  const [fileName, setFileName] = useState("");
  const [csvText, setCsvText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState("");

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setNetError("");
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result));
    reader.readAsText(file);
  }

  async function send() {
    if (!csvText) return;
    setLoading(true);
    setNetError("");
    try {
      const res = await fetch(`${BASE}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: fileName, csv: csvText }),
      });
      setResult(await res.json());
    } catch (err) {
      setNetError("Backend se rabta nahi hua. Check karein ke uvicorn chal raha hai.");
    }
    setLoading(false);
  }

  function Pairs({ data }) {
    const rows = Object.entries(data || {}).filter(
      ([, v]) => v === null || ["string", "number", "boolean"].includes(typeof v)
    );
    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="border rounded p-2">
            <p className="text-slate-500">{k}</p>
            <p className="font-semibold">{String(v)}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">CSV Upload</h1>
      <p className="text-sm text-slate-500">
        Building ka electricity data (timestamp aur kwh columns) upload karein.
        System ganda data saaf karke after-hours waste check karta hai.
      </p>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <input type="file" accept=".csv" onChange={onFile} />
        {fileName && <p className="text-sm">File: {fileName}</p>}
        <button
          onClick={send}
          disabled={!csvText || loading}
          className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          {loading ? "Check ho raha hai..." : "Analyze karein"}
        </button>
      </div>

      {netError && (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3">{netError}</div>
      )}

      {result && !result.ok && (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3">
          <p className="font-semibold">File reject ho gayi</p>
          <ul className="list-disc ml-5">
            {(result.errors || []).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {result && result.ok && (
        <div className="space-y-3">
          <div className="border border-green-300 bg-green-50 text-green-800 rounded p-3">
            File accept ho gayi.
          </div>
          {(result.warnings || []).length > 0 && (
            <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded p-3">
              <p className="font-semibold">Ye masle saaf kiye gaye:</p>
              <ul className="list-disc ml-5">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-white border rounded-lg p-4">
            <p className="font-semibold mb-2">Data stats</p>
            <Pairs data={result.stats} />
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="font-semibold mb-2">Analysis</p>
            <Pairs data={result.analysis} />
          </div>
        </div>
      )}
    </div>
  );
}