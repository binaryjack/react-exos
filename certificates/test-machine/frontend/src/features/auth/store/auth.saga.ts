import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authApi, LoginResponse } from '../api/auth.api.js'
import type { ApiResponse, User } from '../../../shared/types/index.js'
import {
  loginRequest,
  registerRequest,
  authSuccess,
  authFailure,
  loadUserRequest,
  loadUserSuccess
} from './auth.slice.js'

function* handleLogin(action: PayloadAction<{ email: string; password: string }>) {
  const res: ApiResponse<LoginResponse> = yield call(authApi.login, action.payload)
  if (res.success && res.data) {
    yield put(authSuccess(res.data))
  } else {
    yield put(authFailure(res.error ?? 'Login failed'))
  }
}

function* handleRegister(action: PayloadAction<{ email: string; password: string; displayName: string }>) {
  const res: ApiResponse<LoginResponse> = yield call(authApi.register, action.payload)
  if (res.success && res.data) {
    yield put(authSuccess(res.data))
  } else {
    yield put(authFailure(res.error ?? 'Registration failed'))
  }
}

function* handleLoadUser() {
  const res: ApiResponse<User> = yield call(authApi.me)
  if (res.success && res.data) {
    yield put(loadUserSuccess(res.data))
  } else {
    // Token invalid/expired — leave state as is (user will be redirected by guard)
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin)
  yield takeLatest(registerRequest.type, handleRegister)
  yield takeLatest(loadUserRequest.type, handleLoadUser)
}
