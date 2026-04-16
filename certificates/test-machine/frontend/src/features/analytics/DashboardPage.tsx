import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { loadStatsRequest, loadHistoryRequest } from './store/analytics.slice.js'
import { format } from 'date-fns'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { stats, history, loading } = useAppSelector(s => s.analytics)
  const { user } = useAppSelector(s => s.auth)

  React.useEffect(() => {
    dispatch(loadStatsRequest())
    dispatch(loadHistoryRequest())
  }, [dispatch])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.displayName ?? user?.email}
        </h1>
        <p className="text-slate-400 mt-1">Track your progress and start new exams</p>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400">{stats.totalExams}</div>
            <div className="text-slate-400 text-sm mt-1">Exams Taken</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400">{stats.avgScore}%</div>
            <div className="text-slate-400 text-sm mt-1">Average Score</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-400">{stats.bestScore}%</div>
            <div className="text-slate-400 text-sm mt-1">Best Score</div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Ready to practice?</h2>
          <p className="text-slate-400 text-sm">Choose a technology and level to start an exam</p>
        </div>
        <Link to="/exam" className="btn-primary">Start Exam</Link>
      </div>

      {/* Weaknesses */}
      {stats && stats.topicWeaknesses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Topics to Improve</h2>
          <div className="space-y-2">
            {stats.topicWeaknesses.slice(0, 5).map(tw => (
              <div key={tw.topic} className="flex items-center gap-3">
                <span className="text-slate-300 text-sm w-40 truncate">{tw.topic}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${tw.avgScore}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-10 text-right">{tw.avgScore}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent exams */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Exams</h2>
        {loading && <p className="text-slate-400 text-sm">Loading…</p>}
        {!loading && history.length === 0 && (
          <p className="text-slate-400 text-sm">No exams yet. <Link to="/exam" className="text-primary-400 hover:underline">Take your first one!</Link></p>
        )}
        <div className="space-y-2">
          {history.slice(0, 5).map(session => (
            <div key={session.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <div>
                <span className="text-white text-sm font-medium">{session.technologyId} — {session.level}</span>
                <span className="text-slate-400 text-xs ml-2">
                  {session.startedAt ? format(new Date(session.startedAt), 'dd MMM yyyy') : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {session.submittedAt ? (
                  <>
                    <span className={`badge ${(session.score ?? 0) >= 70 ? 'badge-senior' : 'badge-mid'}`}>
                      {session.score}%
                    </span>
                    <Link to={`/exam/results/${session.id}`} className="text-primary-400 text-xs hover:underline">
                      View
                    </Link>
                  </>
                ) : (
                  <Link to={`/exam/session/${session.id}`} className="btn-secondary text-xs">
                    Resume
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
