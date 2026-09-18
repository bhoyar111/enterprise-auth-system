import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const emptyForm = { firstName: '', lastName: '', email: '', password: '' }

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(emptyForm)
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => setUser(result?.data || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (mode === 'register' && form.firstName.trim().length < 2) nextErrors.firstName = 'Enter at least 2 characters.'
    if (mode === 'register' && form.lastName.trim().length < 2) nextErrors.lastName = 'Enter at least 2 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    return nextErrors
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mode === 'register' ? form : { email: form.email, password: form.password }),
      })
      const result = await response.json()
      if (!response.ok) {
        setErrors(Object.fromEntries((result.errors || []).map((error) => [error.field, error.message])))
        setMessage(result.message || 'Unable to complete request.')
        return
      }
      if (mode === 'register') {
        setMode('login')
        setForm({ ...emptyForm, email: form.email })
        setMessage('Account created. Sign in to continue.')
      } else {
        setUser(result.data)
        setForm(emptyForm)
        setMessage('You are signed in.')
      }
    } catch {
      setMessage('The server is unavailable. Check that it is running.')
    } finally {
      setSubmitting(false)
    }
  }

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
    setMessage('You have been signed out.')
  }

  if (loading) return <main className="shell"><p className="loading">Checking session...</p></main>

  return <main className="shell">
    <section className="intro">
      <p className="eyebrow">NORTHSTAR / IDENTITY</p>
      <h1>Access that feels considered.</h1>
      <p className="lede">A focused sign-in layer for teams that care about secure, quiet workflows.</p>
      <div className="signal"><span /> Protected session architecture</div>
    </section>
    <section className="panel" aria-labelledby="auth-title">
      {user ? <div className="welcome">
        <p className="eyebrow">AUTHENTICATED</p>
        <h2 id="auth-title">Welcome back, {user.firstName}.</h2>
        <p>Your session is active for <strong>{user.email}</strong>.</p>
        <button className="button" type="button" onClick={logout}>Sign out</button>
      </div> : <>
        <div className="panel-heading"><div><p className="eyebrow">SECURE PORTAL</p><h2 id="auth-title">{mode === 'login' ? 'Sign in' : 'Create account'}</h2></div><span className="step">01 / 01</span></div>
        <div className="tabs" role="tablist">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => { setMode('login'); setErrors({}); setMessage('') }}>Sign in</button>
          <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => { setMode('register'); setErrors({}); setMessage('') }}>Register</button>
        </div>
        <form onSubmit={submit} noValidate>
          {mode === 'register' && <div className="row"><Field label="First name" name="firstName" value={form.firstName} onChange={updateField} error={errors.firstName} /><Field label="Last name" name="lastName" value={form.lastName} onChange={updateField} error={errors.lastName} /></div>}
          <Field label="Work email" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} autoComplete="email" />
          <Field label="Password" name="password" type="password" value={form.password} onChange={updateField} error={errors.password} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {message && <p className="message" role="status">{message}</p>}
          <button className="button" type="submit" disabled={submitting}>{submitting ? 'Working...' : mode === 'login' ? 'Enter workspace' : 'Create account'}</button>
        </form>
      </>}
    </section>
  </main>
}

function Field({ label, name, type = 'text', value, onChange, error, ...props }) {
  return <label className="field">{label}<input name={name} type={type} value={value} onChange={onChange} aria-invalid={Boolean(error)} {...props} />{error && <small>{error}</small>}</label>
}

export default App
