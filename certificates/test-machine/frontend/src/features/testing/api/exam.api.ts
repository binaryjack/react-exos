import { http } from '../../../shared/utils/http.js'
import type { ApiResponse, Question, ExamSession, ExamResult } from '../../../shared/types/index.js'

export interface GenerateExamInput {
  technologyId: string
  level: string
  count?: number
  seed?: number
}

export interface SubmitExamInput {
  answers: { questionId: string; userAnswer: string; timeSpent?: number }[]
}

export const examApi = {
  generate: (input: GenerateExamInput) =>
    http.post<ApiResponse<ExamSession>>('/exams/generate', input),

  getSession: (id: string) =>
    http.get<ApiResponse<ExamSession>>(`/exams/${id}`),

  getQuestions: (technologyId: string, level: string) =>
    http.get<ApiResponse<Question[]>>(`/questions?technologyId=${technologyId}&level=${level}`),

  submit: (sessionId: string, input: SubmitExamInput) =>
    http.post<ApiResponse<ExamResult>>(`/exams/${sessionId}/submit`, input),

  getResults: (sessionId: string) =>
    http.get<ApiResponse<ExamResult>>(`/exams/${sessionId}/results`)
}
