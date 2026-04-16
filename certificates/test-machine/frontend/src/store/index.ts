import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

import authReducer from '../features/auth/store/auth.slice.js'
import examReducer from '../features/testing/store/exam.slice.js'
import analyticsReducer from '../features/analytics/store/analytics.slice.js'
import adminReducer from '../features/admin/store/admin.slice.js'

import { authSaga } from '../features/auth/store/auth.saga.js'
import { examSaga } from '../features/testing/store/exam.saga.js'
import { analyticsSaga } from '../features/analytics/store/analytics.saga.js'
import { adminSaga } from '../features/admin/store/admin.saga.js'

function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(examSaga),
    fork(analyticsSaga),
    fork(adminSaga)
  ])
}

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    analytics: analyticsReducer,
    admin: adminReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
