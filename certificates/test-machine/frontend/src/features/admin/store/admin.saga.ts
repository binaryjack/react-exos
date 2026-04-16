import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { adminApi, AdminStats, CreateTechnologyInput, CreateQuestionInput } from '../api/admin.api.js'
import type { ApiResponse, Technology, Question, User } from '../../../shared/types/index.js'
import {
  loadStatsRequest, loadStatsSuccess,
  loadTechnologiesRequest, loadTechnologiesSuccess,
  loadQuestionsRequest, loadQuestionsSuccess,
  loadUsersRequest, loadUsersSuccess,
  adminFailure,
  createTechnologyRequest,
  createQuestionRequest,
  deleteQuestionRequest,
  questionDeleted
} from './admin.slice.js'

function* handleLoadStats() {
  const res: ApiResponse<AdminStats> = yield call(adminApi.getStats)
  if (res.success && res.data) yield put(loadStatsSuccess(res.data))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleLoadTechnologies() {
  const res: ApiResponse<Technology[]> = yield call(adminApi.listAllTechnologies)
  if (res.success && res.data) yield put(loadTechnologiesSuccess(res.data))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleLoadQuestions(action: PayloadAction<{ technologyId?: string; level?: string; topic?: string } | undefined>) {
  const res: ApiResponse<Question[]> = yield call(adminApi.listQuestions, action.payload ?? {})
  if (res.success && res.data) yield put(loadQuestionsSuccess(res.data))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleLoadUsers() {
  const res: ApiResponse<User[]> = yield call(adminApi.getUsers)
  if (res.success && res.data) yield put(loadUsersSuccess(res.data))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleCreateTechnology(action: PayloadAction<CreateTechnologyInput>) {
  const res: ApiResponse<Technology> = yield call(adminApi.createTechnology, action.payload)
  if (res.success) yield put(loadTechnologiesRequest())
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleCreateQuestion(action: PayloadAction<CreateQuestionInput>) {
  const res: ApiResponse<Question> = yield call(adminApi.createQuestion, action.payload)
  if (res.success) yield put(loadQuestionsRequest(undefined))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

function* handleDeleteQuestion(action: PayloadAction<string>) {
  const res: ApiResponse<void> = yield call(adminApi.deleteQuestion, action.payload)
  if (res.success) yield put(questionDeleted(action.payload))
  else yield put(adminFailure(res.error ?? 'Failed'))
}

export function* adminSaga() {
  yield takeLatest(loadStatsRequest.type, handleLoadStats)
  yield takeLatest(loadTechnologiesRequest.type, handleLoadTechnologies)
  yield takeLatest(loadQuestionsRequest.type, handleLoadQuestions)
  yield takeLatest(loadUsersRequest.type, handleLoadUsers)
  yield takeLatest(createTechnologyRequest.type, handleCreateTechnology)
  yield takeLatest(createQuestionRequest.type, handleCreateQuestion)
  yield takeLatest(deleteQuestionRequest.type, handleDeleteQuestion)
}
