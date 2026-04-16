import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/useStore.js'
import { logout } from '../../features/auth/store/auth.slice.js'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAppSelector(s => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
        location.pathname.startsWith(to)
          ? 'bg-primary-700 text-white'
          : 'text-slate-300 hover:text-white hover:bg-slate-700'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary-400 font-bold text-lg">Test Machine</span>
          </div>
          <nav className="flex items-center gap-1">
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/exam', 'Take Exam')}
            {navLink('/profile', 'Profile')}
            {user?.role === 'admin' && navLink('/admin', 'Admin')}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{user?.displayName ?? user?.email}</span>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
