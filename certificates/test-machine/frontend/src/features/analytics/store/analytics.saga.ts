import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { profileApi, UserStats } from '../api/profile.api.js'
import type { ApiResponse, User, ExamSession } from '../../../shared/types/index.js'
import {
  loadProfileRequest,
  loadProfileSuccess,
  loadHistoryRequest,
  loadHistorySuccess,
  loadStatsRequest,
  loadStatsSuccess,
  analyticsFailure,
  updateProfileRequest
} from './analytics.slice.js'

function* handleLoadProfile() {
  const res: ApiResponse<User> = yield call(profileApi.getProfile)
  if (res.success && res.data) {
    yield put(loadProfileSuccess(res.data))
  } else {
    yield put(analyticsFailure(res.error ?? 'Failed to load profile'))
  }
}

function* handleLoadHistory() {
  const res: ApiResponse<ExamSession[]> = yield call(profileApi.getHistory)
  if (res.success && res.data) {
    yield put(loadHistorySuccess(res.data))
  } else {
    yield put(analyticsFailure(res.error ?? 'Failed to load history'))
  }
}

function* handleLoadStats() {
  const res: ApiResponse<UserStats> = yield call(profileApi.getStats)
  if (res.success && res.data) {
    yield put(loadStatsSuccess(res.data))
  } else {
    yield put(analyticsFailure(res.error ?? 'Failed to load stats'))
  }
}

function* handleUpdateProfile(action: PayloadAction<{ displayName?: string }>) {
  const res: ApiResponse<User> = yield call(profileApi.updateProfile, action.payload)
  if (res.success && res.data) {
    yield put(loadProfileSuccess(res.data))
  } else {
    yield put(analyticsFailure(res.error ?? 'Failed to update profile'))
  }
}

export function* analyticsSaga() {
  yield takeLatest(loadProfileRequest.type, handleLoadProfile)
  yield takeLatest(loadHistoryRequest.type, handleLoadHistory)
  yield takeLatest(loadStatsRequest.type, handleLoadStats)
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile)
}
