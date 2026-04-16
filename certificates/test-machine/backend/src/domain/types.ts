// Shared domain types used across all layers
export type UserRole = 'admin' | 'candidate'
export type QuestionType = 'mcq' | 'coding'

export interface User {
  id: string
  email: string
  passwordHash: string
  displayName: string
  role: UserRole
  createdAt: string
}

export interface Technology {
  id: string
  slug: string
  name: string
  description: string
  isActive: 1 | 0
  levels: string   // JSON array: e.g. '["MID","SENIOR"]'
  createdAt: string
}

export interface Question {
  id: string
  technologyId: string
  level: string
  topic: string
  subtopic: string
  type: QuestionType
  prompt: string
  options: string | null  // JSON array for MCQ
  answer: string
  difficulty: number      // 1-5
  estimatedTime: number   // seconds
  explanation: string
  references: string      // JSON array of strings
  createdAt: string
}

export interface ExamSession {
  id: string
  userId: string
  technologyId: string
  level: string
  questionIds: string   // JSON array
  startedAt: string
  submittedAt: string | null
  score: number | null
  breakdown: string | null  // JSON: per-topic breakdown
}

export interface ExamAnswer {
  id: string
  sessionId: string
  questionId: string
  userAnswer: string
  isCorrect: 1 | 0
  timeSpent: number   // seconds
}

// DTO shapes returned to the API client (no raw SQL integer booleans)
export interface UserDto {
  id: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
}

export interface TechnologyDto {
  id: string
  slug: string
  name: string
  description: string
  isActive: boolean
  levels: string[]
  createdAt: string
}

export interface QuestionDto {
  id: string
  technologyId: string
  level: string
  topic: string
  subtopic: string
  type: QuestionType
  prompt: string
  options: string[] | null
  answer: string
  difficulty: number
  estimatedTime: number
  explanation: string
  references: string[]
  createdAt: string
}

export interface ExamSessionDto {
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

export interface ExamAnswerDto {
  id: string
  sessionId: string
  questionId: string
  userAnswer: string
  isCorrect: boolean
  timeSpent: number
}
