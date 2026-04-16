import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Technology, Question, User } from '../../../shared/types/index.js'
import type { AdminStats } from '../api/admin.api.js'

interface AdminState {
  stats: AdminStats | null
  technologies: Technology[]
  questions: Question[]
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: AdminState = {
  stats: null,
  technologies: [],
  questions: [],
  users: [],
  loading: false,
  error: null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loadStatsRequest(state) { state.loading = true; state.error = null },
    loadStatsSuccess(state, action: PayloadAction<AdminStats>) {
      state.loading = false; state.stats = action.payload
    },
    loadTechnologiesRequest(state) { state.loading = true },
    loadTechnologiesSuccess(state, action: PayloadAction<Technology[]>) {
      state.loading = false; state.technologies = action.payload
    },
    loadQuestionsRequest(state, _action: PayloadAction<{ technologyId?: string; level?: string; topic?: string } | undefined>) {
      state.loading = true
    },
    loadQuestionsSuccess(state, action: PayloadAction<Question[]>) {
      state.loading = false; state.questions = action.payload
    },
    loadUsersRequest(state) { state.loading = true },
    loadUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false; state.users = action.payload
    },
    adminFailure(state, action: PayloadAction<string>) {
      state.loading = false; state.error = action.payload
    },
    createTechnologyRequest(state, _action: PayloadAction<import('../api/admin.api.js').CreateTechnologyInput>) {
      state.loading = true
    },
    createQuestionRequest(state, _action: PayloadAction<import('../api/admin.api.js').CreateQuestionInput>) {
      state.loading = true
    },
    deleteQuestionRequest(state, _action: PayloadAction<string>) {
      state.loading = true
    },
    questionDeleted(state, action: PayloadAction<string>) {
      state.loading = false
      state.questions = state.questions.filter(q => q.id !== action.payload)
    }
  }
})

export const {
  loadStatsRequest,
  loadStatsSuccess,
  loadTechnologiesRequest,
  loadTechnologiesSuccess,
  loadQuestionsRequest,
  loadQuestionsSuccess,
  loadUsersRequest,
  loadUsersSuccess,
  adminFailure,
  createTechnologyRequest,
  createQuestionRequest,
  deleteQuestionRequest,
  questionDeleted
} = adminSlice.actions

export default adminSlice.reducer
