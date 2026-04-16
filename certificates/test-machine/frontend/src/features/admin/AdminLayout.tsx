import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export function AdminLayout() {
  const link = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded text-sm font-medium transition-colors ${
          isActive ? 'bg-primary-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 w-fit">
        {link('/admin', 'Overview')}
        {link('/admin/technologies', 'Technologies')}
        {link('/admin/questions', 'Questions')}
        {link('/admin/users', 'Users')}
      </div>
      <Outlet />
    </div>
  )
}
