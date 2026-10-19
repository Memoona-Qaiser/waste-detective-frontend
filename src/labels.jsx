export const STATE = {
  new: { text: 'Review pending', cls: 'bg-amber-100 text-amber-800' },
  needs_data: { text: 'Needs more data', cls: 'bg-purple-100 text-purple-800' },
  valid_issue: { text: 'Valid issue', cls: 'bg-red-100 text-red-800' },
  false_alarm: { text: 'False alarm', cls: 'bg-slate-200 text-slate-700' },
  deferred: { text: 'Deferred', cls: 'bg-slate-200 text-slate-700' },
  task_assigned: { text: 'Task assigned', cls: 'bg-blue-100 text-blue-800' },
  completed: { text: 'Completed', cls: 'bg-green-100 text-green-800' },
}

export function Badge({ state }) {
  const s = STATE[state] || STATE.new
  return <span className={`text-xs px-2 py-1 rounded-full ${s.cls}`}>{s.text}</span>
}