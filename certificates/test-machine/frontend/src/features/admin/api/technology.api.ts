import { http } from '../../../shared/utils/http.js'
import type { ApiResponse, Technology } from '../../../shared/types/index.js'

export const technologyApi = {
  list: () =>
    http.get<ApiResponse<Technology[]>>('/technologies'),

  listAll: () =>
    http.get<ApiResponse<Technology[]>>('/technologies/all'),

  get: (id: string) =>
    http.get<ApiResponse<Technology>>(`/technologies/${id}`),

  create: (input: Omit<Technology, 'id' | 'createdAt'>) =>
    http.post<ApiResponse<Technology>>('/technologies', input),

  update: (id: string, input: Partial<Omit<Technology, 'id' | 'createdAt'>>) =>
    http.patch<ApiResponse<Technology>>(`/technologies/${id}`, input)
}
