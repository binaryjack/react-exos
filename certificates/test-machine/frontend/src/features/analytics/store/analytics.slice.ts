import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, ExamSession } from '../../../shared/types/index.js'
import type { UserStats } from '../api/profile.api.js'

interface AnalyticsState {
  profile: User | null
  history: ExamSession[]
  stats: UserStats | null
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  profile: null,
  history: [],
  stats: null,
  loading: false,
  error: null
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    loadProfileRequest(state) { state.loading = true; state.error = null },
    loadProfileSuccess(state, action: PayloadAction<User>) {
      state.loading = false
      state.profile = action.payload
    },
    loadHistoryRequest(state) { state.loading = true },
    loadHistorySuccess(state, action: PayloadAction<ExamSession[]>) {
      state.loading = false
      state.history = action.payload
    },
    loadStatsRequest(state) { state.loading = true },
    loadStatsSuccess(state, action: PayloadAction<UserStats>) {
      state.loading = false
      state.stats = action.payload
    },
    analyticsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateProfileRequest(state, _action: PayloadAction<{ displayName?: string }>) {
      state.loading = true
    }
  }
})

export const {
  loadProfileRequest,
  loadProfileSuccess,
  loadHistoryRequest,
  loadHistorySuccess,
  loadStatsRequest,
  loadStatsSuccess,
  analyticsFailure,
  updateProfileRequest
} = analyticsSlice.actions

export default analyticsSlice.reducer
