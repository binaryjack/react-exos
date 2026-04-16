import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector } from '../../shared/hooks/useStore.js'
import type { Question, ExamAnswer } from '../../shared/types/index.js'

function AnswerRow({ q, answer }: { q: Question; answer: ExamAnswer | undefined }) {
  const isCorrect = answer?.isCorrect ?? false
  return (
    <div className={`card border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="badge">{q.topic}</span>
        <span className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>
      <p className="text-white text-sm mb-3 whitespace-pre-wrap">{q.prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-slate-400">Your answer: </span>
          <span className={`font-mono ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {answer?.userAnswer || <em className="text-slate-500">No answer</em>}
          </span>
        </div>
        {!isCorrect && (
          <div>
            <span className="text-slate-400">Correct answer: </span>
            <span className="text-green-400 font-mono">{q.answer}</span>
          </div>
        )}
      </div>
      {q.explanation && (
        <p className="text-slate-400 text-xs mt-3 border-t border-slate-700 pt-3">{q.explanation}</p>
      )}
    </div>
  )
}

export function ExamResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { result } = useAppSelector(s => s.exam)

  // If navigated directly (no redux state), show loading / fetch
  const [fetched, setFetched] = React.useState(false)
  const [examResult, setExamResult] = React.useState(result)

  React.useEffect(() => {
    if (!result && id && !fetched) {
      fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/exams/${id}/results`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('tm_token')}` }
      })
        .then(r => r.json())
        .then(res => { if (res.success) setExamResult(res.data) })
        .finally(() => setFetched(true))
    }
  }, [id, result, fetched])

  const data = examResult ?? result
  if (!data) return <div className="text-slate-400">Loading results…</div>

  const scoreColor = data.score >= 70 ? 'text-green-400' : data.score >= 50 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="space-y-8">
      {/* Score header */}
      <div className="card text-center">
        <div className={`text-6xl font-bold ${scoreColor} mb-2`}>{data.score}%</div>
        <div className="text-slate-400">
          {data.correctAnswers} of {data.totalQuestions} correct
        </div>
        <div className="text-slate-500 text-sm mt-1">
          {data.score >= 70 ? 'Great job! You passed.' : 'Keep practicing — you\'ll get there!'}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <Link to="/exam" className="btn-primary">New Exam</Link>
          <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </div>

      {/* Breakdown */}
      {Object.keys(data.breakdown).length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Topic Breakdown</h2>
          <div className="space-y-2">
            {Object.entries(data.breakdown).map(([topic, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100)
              return (
                <div key={topic} className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm w-40 truncate">{topic}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm w-16 text-right">{stats.correct}/{stats.total}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Answer review */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Answer Review</h2>
        <div className="space-y-4">
          {data.questions.map(q => (
            <AnswerRow
              key={q.id}
              q={q}
              answer={data.answers.find((a: ExamAnswer) => a.questionId === q.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
