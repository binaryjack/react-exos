import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useStore.js'
import { setAnswer, nextQuestion, prevQuestion, goToQuestion, submitRequest } from './store/exam.slice.js'

export function ExamSessionPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { session, questions, currentIndex, answers, loading, error } = useAppSelector(s => s.exam)

  const startRef = React.useRef<number>(Date.now())

  // If no session in store, redirect to setup
  React.useEffect(() => {
    if (!session && !loading) navigate('/exam')
  }, [session, loading, navigate])

  const question = questions[currentIndex]
  const totalAnswered = Object.keys(answers).length
  const isLast = currentIndex === questions.length - 1

  const handleAnswer = (answer: string) => {
    if (!question) return
    dispatch(setAnswer({ questionId: question.id, answer }))
  }

  const handleSubmit = () => {
    dispatch(submitRequest())
  }

  // Navigate to results on submit success
  const result = useAppSelector(s => s.exam.result)
  React.useEffect(() => {
    if (result && session) navigate(`/exam/results/${session.id}`)
  }, [result, session, navigate])

  if (!question) {
    return <div className="text-slate-400">Loading exam…</div>
  }

  const currentAnswer = answers[question.id] ?? ''

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-slate-400 text-sm">Question {currentIndex + 1} of {questions.length}</span>
          <div className="w-64 bg-slate-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-primary-500 h-1.5 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span>{totalAnswered}/{questions.length} answered</span>
          <span className={`badge ${question.difficulty === 'easy' ? 'badge-mid' : question.difficulty === 'hard' ? 'badge-senior' : 'badge'}`}>
            {question.difficulty}
          </span>
          <span className="badge">{question.topic}</span>
        </div>
      </div>

      {/* Question */}
      <div className="card space-y-4">
        <div className="text-white whitespace-pre-wrap leading-relaxed">{question.prompt}</div>

        {/* MCQ options */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left px-4 py-3 rounded border transition-colors text-sm ${
                  currentAnswer === opt
                    ? 'border-primary-500 bg-primary-900/40 text-white'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Text / theory / coding answer */}
        {(question.type === 'theory' || question.type === 'coding' || question.type === 'debug') && (
          <div>
            <label className="label text-xs">Your Answer</label>
            <textarea
              className="input font-mono text-sm resize-y"
              rows={question.type === 'coding' ? 8 : 4}
              value={currentAnswer}
              onChange={e => handleAnswer(e.target.value)}
              placeholder={question.type === 'coding' ? 'Write your code here…' : 'Type your answer…'}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          className="btn-secondary"
          onClick={() => dispatch(prevQuestion())}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {/* Question dots */}
        <div className="flex gap-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => dispatch(goToQuestion(i))}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-primary-500'
                  : answers[q.id]
                  ? 'bg-green-600'
                  : 'bg-slate-600'
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : `Submit Exam (${totalAnswered}/${questions.length})`}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => dispatch(nextQuestion())}
          >
            Next
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 rounded px-3 py-2 text-sm">{error}</div>
      )}
    </div>
  )
}
