const BASE = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api`
const TOKEN_KEY = 'rwd_token'
const USER_KEY = 'rwd_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(BASE + path, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  // Token expire ho gaya ya galat hai: session saaf karke login page par bhejein
  if (res.status === 401 && token) {
    clearSession()
    window.location.reload()
    throw new Error('Session khatam ho gayi, dobara login karein')
  }
  if (!res.ok) throw new Error(data.detail || 'Kuch galat ho gaya')
  return data
}

const post = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export async function login(username, password) {
  const res = await fetch(BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'Login nahi hua')
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data.user
}

export const logout = clearSession

export const fetchAlerts = () => request('/alerts')
export const fetchVerifications = () => request('/verification')
export const fetchTasks = () => request('/tasks')
export const fetchAudit = () => request('/audit')
export const fetchOverview = () => request('/overview')
export const fetchSettings = () => request('/settings')
export const saveSettings = (body) => post('/settings', body)
export const reviewAlert = (id, body) => post(`/alerts/${id}/review`, body)
export const approveAlert = (id, body) => post(`/alerts/${id}/approve`, body)
export const completeTask = (id, body) => post(`/tasks/${id}/complete`, body)
export const resetDemo = () => post('/demo/reset', {})
export const uploadCsv = (filename, csv) => post('/upload', { filename, csv })
export const explainAlert = (id) => request(`/alerts/${id}/explain`)
