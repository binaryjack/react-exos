import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { loadStatsRequest } from './store/admin.slice.js'

export function AdminOverviewPage() {
  const dispatch = useAppDispatch()
  const { stats, loading } = useAppSelector(s => s.admin)

  React.useEffect(() => { dispatch(loadStatsRequest()) }, [dispatch])

  if (loading) return <div className="text-slate-400">Loading…</div>
  if (!stats) return null

  // Group byTopicLevel by technology + level
  const grouped: Record<string, Record<string, number>> = {}
  for (const row of stats.byTopicLevel) {
    const key = `${row.technologyId}__${row.level}`
    grouped[key] = grouped[key] ?? {}
    grouped[key][row.topic] = row.count
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.totalQuestions}</div>
          <div className="text-slate-400 text-sm mt-1">Total Questions</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.sessionCount}</div>
          <div className="text-slate-400 text-sm mt-1">Exams Submitted</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.candidateCount}</div>
          <div className="text-slate-400 text-sm mt-1">Candidates</div>
        </div>
      </div>

      {/* Coverage table */}
      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Coverage by Level</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-2 pr-4">Technology / Level</th>
              <th className="pb-2 pr-4">Topic</th>
              <th className="pb-2 text-right">Questions</th>
              <th className="pb-2 text-right pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.byTopicLevel.map(row => (
              <tr key={`${row.technologyId}-${row.level}-${row.topic}`} className="border-b border-slate-800">
                <td className="py-1.5 pr-4 text-slate-300">{row.technologyId} — {row.level}</td>
                <td className="py-1.5 pr-4 text-slate-400">{row.topic}</td>
                <td className="py-1.5 text-right text-white font-mono">{row.count}</td>
                <td className="py-1.5 pl-4 text-right">
                  <span className={`badge ${row.count >= 5 ? 'badge-senior' : row.count >= 3 ? 'badge-mid' : 'badge'}`}>
                    {row.count >= 5 ? 'Good' : row.count >= 3 ? 'Low' : 'Gap'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
