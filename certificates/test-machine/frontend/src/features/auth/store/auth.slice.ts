import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '../../../shared/types/index.js'

const TOKEN_KEY = 'tm_token'

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.loading = true
      state.error = null
    },
    registerRequest(state, _action: PayloadAction<{ email: string; password: string; displayName: string }>) {
      state.loading = true
      state.error = null
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem(TOKEN_KEY, action.payload.token)
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    loadUserRequest(state) {
      state.loading = true
    },
    loadUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
    }
  }
})

export const {
  loginRequest,
  registerRequest,
  authSuccess,
  authFailure,
  loadUserRequest,
  loadUserSuccess,
  logout
} = authSlice.actions

export default authSlice.reducer
