import { useEffect, useState } from 'react'
import { fetchTasks, completeTask } from '../api'

export default function Tasks({ role }) {
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState({})
  const [error, setError] = useState('')

  const load = () => fetchTasks().then(setTasks).catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const done = async (id) => {
    setError('')
    try {
      await completeTask(id, { note: notes[id] || '', actor: role })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Maintenance Tasks</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {tasks.length === 0 && (
        <p className="text-slate-500">
          Abhi koi task nahi. Manager alert approve karega to yahan aayega.
        </p>
      )}

      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between">
              <p className="font-medium">{t.title}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  t.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {t.status === 'done' ? 'Done' : 'Open'}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {t.assignee}, priority {t.priority}, due {t.due_date || 'tay nahi'}
            </p>

            {t.status === 'open' && role === 'Technician' && (
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Kaam ka note ya evidence likhein"
                  value={notes[t.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [t.id]: e.target.value })}
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => done(t.id)}
                >
                  Complete
                </button>
              </div>
            )}
            {t.status === 'open' && role !== 'Technician' && (
              <p className="text-xs text-slate-500 mt-2">
                Complete sirf Technician kar sakta hai. Upar se role badlein.
              </p>
            )}
            {t.status === 'done' && (
              <p className="text-sm mt-2">
                Note: {t.work_note}
                <span className="text-xs text-slate-500"> ({t.completed_at})</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}