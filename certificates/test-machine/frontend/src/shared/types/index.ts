// ── Domain types (mirror backend DTOs) ────────────────────────────────────────

export type UserRole = 'admin' | 'candidate'

export interface User {
  id: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
}

export interface Technology {
  id: string
  slug: string
  name: string
  description: string
  levels: string[]
  isActive: boolean
  createdAt: string
}

export type QuestionType = 'mcq' | 'coding' | 'theory' | 'debug'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  technologyId: string
  level: string
  topic: string
  subtopic: string
  type: QuestionType
  prompt: string
  options: string[] | null
  answer: string
  difficulty: Difficulty
  estimatedTime: number
  explanation: string
  references: string[]
  createdAt: string
}

export interface ExamSession {
  id: string
  userId: string
  technologyId: string
  level: string
  questionIds: string[]
  startedAt: string
  submittedAt: string | null
  score: number | null
  breakdown: Record<string, { correct: number; total: number }> | null
}

export interface ExamAnswer {
  id: string
  sessionId: string
  questionId: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export interface ExamResult {
  session: ExamSession
  answers: ExamAnswer[]
  questions: Question[]
  score: number
  totalQuestions: number
  correctAnswers: number
  breakdown: Record<string, { correct: number; total: number }>
}

// ── API response wrapper ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthTokenPayload {
  sub: string
  email: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}
