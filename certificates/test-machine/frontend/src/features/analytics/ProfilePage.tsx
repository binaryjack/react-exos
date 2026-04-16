import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { loadProfileRequest, loadStatsRequest, updateProfileRequest } from './store/analytics.slice.js'
import { format } from 'date-fns'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const { profile, stats, loading } = useAppSelector(s => s.analytics)
  const [editing, setEditing] = React.useState(false)
  const [displayName, setDisplayName] = React.useState('')

  React.useEffect(() => {
    dispatch(loadProfileRequest())
    dispatch(loadStatsRequest())
  }, [dispatch])

  React.useEffect(() => {
    if (profile) setDisplayName(profile.displayName)
  }, [profile])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateProfileRequest({ displayName }))
    setEditing(false)
  }

  if (!profile) return <div className="text-slate-400">Loading profile…</div>

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Account Details</h2>
          {!editing && (
            <button className="btn-secondary text-sm" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="label">Display Name</label>
              <input
                type="text"
                className="input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm" disabled={loading}>
                Save
              </button>
              <button type="button" className="btn-secondary text-sm" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-4">
              <span className="text-slate-400 w-32">Display Name</span>
              <span className="text-white">{profile.displayName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-400 w-32">Email</span>
              <span className="text-white">{profile.email}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-400 w-32">Role</span>
              <span className="badge">{profile.role}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-400 w-32">Joined</span>
              <span className="text-white">{format(new Date(profile.createdAt), 'dd MMM yyyy')}</span>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.totalExams}</div>
              <div className="text-slate-400 text-xs mt-1">Total Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.avgScore}%</div>
              <div className="text-slate-400 text-xs mt-1">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.bestScore}%</div>
              <div className="text-slate-400 text-xs mt-1">Best Score</div>
            </div>
          </div>

          {stats.topicWeaknesses.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Topic Breakdown</h3>
              <div className="space-y-2">
                {stats.topicWeaknesses.map(tw => (
                  <div key={tw.topic} className="flex items-center gap-3">
                    <span className="text-slate-300 text-xs w-36 truncate">{tw.topic}</span>
                    <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${tw.avgScore < 50 ? 'bg-red-500' : tw.avgScore < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${tw.avgScore}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs w-10 text-right">{tw.avgScore}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
