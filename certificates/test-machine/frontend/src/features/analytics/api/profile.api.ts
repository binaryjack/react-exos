import { http } from '../../../shared/utils/http.js'
import type { ApiResponse, User } from '../../../shared/types/index.js'

export interface UserStats {
  totalExams: number
  avgScore: number
  bestScore: number
  topicWeaknesses: { topic: string; avgScore: number; total: number }[]
}

export const profileApi = {
  getProfile: () =>
    http.get<ApiResponse<User>>('/users/me/profile'),

  updateProfile: (input: { displayName?: string }) =>
    http.patch<ApiResponse<User>>('/users/me/profile', input),

  getHistory: () =>
    http.get<ApiResponse<import('../../../shared/types/index.js').ExamSession[]>>('/users/me/history'),

  getStats: () =>
    http.get<ApiResponse<UserStats>>('/users/me/stats')
}
