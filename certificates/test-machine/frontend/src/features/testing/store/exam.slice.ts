import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ExamSession, Question, ExamResult } from '../../../shared/types/index.js'
import type { GenerateExamInput } from '../api/exam.api.js'

interface ExamState {
  session: ExamSession | null
  questions: Question[]
  result: ExamResult | null
  currentIndex: number
  answers: Record<string, string>    // questionId -> userAnswer
  timings: Record<string, number>    // questionId -> ms spent
  loading: boolean
  error: string | null
}

const initialState: ExamState = {
  session: null,
  questions: [],
  result: null,
  currentIndex: 0,
  answers: {},
  timings: {},
  loading: false,
  error: null
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    generateRequest(state, _action: PayloadAction<GenerateExamInput>) {
      state.loading = true
      state.error = null
      state.session = null
      state.questions = []
      state.result = null
      state.currentIndex = 0
      state.answers = {}
      state.timings = {}
    },
    generateSuccess(state, action: PayloadAction<{ session: ExamSession; questions: Question[] }>) {
      state.loading = false
      state.session = action.payload.session
      state.questions = action.payload.questions
    },
    examFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    setAnswer(state, action: PayloadAction<{ questionId: string; answer: string }>) {
      state.answers[action.payload.questionId] = action.payload.answer
    },
    setTiming(state, action: PayloadAction<{ questionId: string; ms: number }>) {
      state.timings[action.payload.questionId] = action.payload.ms
    },
    nextQuestion(state) {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++
      }
    },
    prevQuestion(state) {
      if (state.currentIndex > 0) {
        state.currentIndex--
      }
    },
    goToQuestion(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload
    },
    submitRequest(state) {
      state.loading = true
      state.error = null
    },
    submitSuccess(state, action: PayloadAction<ExamResult>) {
      state.loading = false
      state.result = action.payload
    },
    clearExam(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  generateRequest,
  generateSuccess,
  examFailure,
  setAnswer,
  setTiming,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  submitRequest,
  submitSuccess,
  clearExam
} = examSlice.actions

export default examSlice.reducer
