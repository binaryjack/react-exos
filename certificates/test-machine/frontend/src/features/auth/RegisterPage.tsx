import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { registerRequest } from './store/auth.slice.js'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useAppSelector(s => s.auth)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(registerRequest({ email, password, displayName }))
  }

  React.useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 rounded px-3 py-2 mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              className="input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
