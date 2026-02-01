import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { watchBillSagas } from '../pages/bill/store/bill.saga';
import billReducer from '../pages/bill/store/bill.slice';
import { watchProductSagas } from '../pages/product/store/product.saga';
import productReducer from '../pages/product/store/product.slice';
import { watchUserSagas } from '../pages/user/store/user.saga';
import userReducer from '../pages/user/store/user.slice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    users: userReducer,
    bills: billReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

function* rootSaga() {
  yield all([
    watchUserSagas(),
    watchBillSagas(),
    watchProductSagas(),
  ]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
