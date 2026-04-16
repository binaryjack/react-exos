import { http } from '../../../shared/utils/http.js'
import type { ApiResponse, Technology, Question, User } from '../../../shared/types/index.js'

export interface AdminStats {
  totalQuestions: number
  sessionCount: number
  candidateCount: number
  byTopicLevel: { technologyId: string; level: string; topic: string; count: number }[]
}

export interface CreateTechnologyInput {
  name: string
  slug: string
  description: string
  levels: string[]
  isActive: boolean
}

export interface CreateQuestionInput {
  technologyId: string
  level: string
  topic: string
  subtopic?: string
  type: string
  prompt: string
  options?: string[]
  answer: string
  difficulty: string
  estimatedTime: number
  explanation?: string
  references?: string[]
}

export const adminApi = {
  getStats: () =>
    http.get<ApiResponse<AdminStats>>('/admin/stats'),

  getUsers: () =>
    http.get<ApiResponse<User[]>>('/admin/users'),

  listAllTechnologies: () =>
    http.get<ApiResponse<Technology[]>>('/technologies/all'),

  createTechnology: (input: CreateTechnologyInput) =>
    http.post<ApiResponse<Technology>>('/technologies', input),

  updateTechnology: (id: string, input: Partial<CreateTechnologyInput>) =>
    http.patch<ApiResponse<Technology>>(`/technologies/${id}`, input),

  listQuestions: (params: { technologyId?: string; level?: string; topic?: string } = {}) => {
    const qs = new URLSearchParams()
    if (params.technologyId) qs.set('technologyId', params.technologyId)
    if (params.level) qs.set('level', params.level)
    if (params.topic) qs.set('topic', params.topic)
    return http.get<ApiResponse<Question[]>>(`/questions?${qs.toString()}`)
  },

  getQuestionStats: () =>
    http.get<ApiResponse<{ technologyId: string; level: string; topic: string; count: number }[]>>('/questions/stats'),

  createQuestion: (input: CreateQuestionInput) =>
    http.post<ApiResponse<Question>>('/questions', input),

  updateQuestion: (id: string, input: Partial<CreateQuestionInput>) =>
    http.put<ApiResponse<Question>>(`/questions/${id}`, input),

  deleteQuestion: (id: string) =>
    http.delete<ApiResponse<void>>(`/questions/${id}`),

  bulkImportQuestions: (questions: CreateQuestionInput[]) =>
    http.post<ApiResponse<{ count: number }>>('/questions/bulk', { questions })
}
