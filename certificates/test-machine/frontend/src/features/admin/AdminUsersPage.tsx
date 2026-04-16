import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { loadUsersRequest } from './store/admin.slice.js'
import { format } from 'date-fns'

export function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector(s => s.admin)

  React.useEffect(() => { dispatch(loadUsersRequest()) }, [dispatch])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Users ({users.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Role</th>
              <th className="pb-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-800">
                <td className="py-2 pr-4 text-white">{u.displayName}</td>
                <td className="py-2 pr-4 text-slate-400">{u.email}</td>
                <td className="py-2 pr-4"><span className="badge">{u.role}</span></td>
                <td className="py-2 text-slate-400">{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && <p className="text-slate-500 text-sm mt-2">No users yet.</p>}
      </div>
    </div>
  )
}
