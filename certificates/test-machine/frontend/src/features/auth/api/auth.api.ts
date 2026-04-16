import { http } from '../../../shared/utils/http.js'
import type { ApiResponse, User, LoginInput, RegisterInput } from '../../../shared/types/index.js'

export interface LoginResponse {
  user: User
  token: string
}

export const authApi = {
  login: (input: LoginInput) =>
    http.post<ApiResponse<LoginResponse>>('/auth/login', input),

  register: (input: RegisterInput) =>
    http.post<ApiResponse<LoginResponse>>('/auth/register', input),

  me: () =>
    http.get<ApiResponse<User>>('/auth/me')
}
