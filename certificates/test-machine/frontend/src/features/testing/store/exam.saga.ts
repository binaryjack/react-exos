import { call, put, select, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { examApi, GenerateExamInput, SubmitExamInput } from '../api/exam.api.js'
import type { ApiResponse, ExamSession, Question, ExamResult } from '../../../shared/types/index.js'
import {
  generateRequest,
  generateSuccess,
  examFailure,
  submitRequest,
  submitSuccess
} from './exam.slice.js'
import type { RootState } from '../../../store/index.js'

function* handleGenerate(action: PayloadAction<GenerateExamInput>) {
  const sessionRes: ApiResponse<ExamSession> = yield call(examApi.generate, action.payload)
  if (!sessionRes.success || !sessionRes.data) {
    yield put(examFailure(sessionRes.error ?? 'Failed to generate exam'))
    return
  }
  const questionsRes: ApiResponse<Question[]> = yield call(
    examApi.getQuestions,
    action.payload.technologyId,
    action.payload.level
  )
  if (!questionsRes.success || !questionsRes.data) {
    yield put(examFailure(questionsRes.error ?? 'Failed to load questions'))
    return
  }
  // Filter to only the questions in this session
  const questionIds = sessionRes.data.questionIds
  const questions = questionsRes.data.filter(q => questionIds.includes(q.id))
  yield put(generateSuccess({ session: sessionRes.data, questions }))
}

function* handleSubmit() {
  const state: RootState = yield select()
  const { session, answers, timings } = state.exam
  if (!session) {
    yield put(examFailure('No active session'))
    return
  }
  const input: SubmitExamInput = {
    answers: Object.entries(answers).map(([questionId, userAnswer]) => ({
      questionId,
      userAnswer,
      timeSpent: timings[questionId] ?? 0
    }))
  }
  const res: ApiResponse<ExamResult> = yield call(examApi.submit, session.id, input)
  if (res.success && res.data) {
    yield put(submitSuccess(res.data))
  } else {
    yield put(examFailure(res.error ?? 'Submission failed'))
  }
}

export function* examSaga() {
  yield takeLatest(generateRequest.type, handleGenerate)
  yield takeLatest(submitRequest.type, handleSubmit)
}
