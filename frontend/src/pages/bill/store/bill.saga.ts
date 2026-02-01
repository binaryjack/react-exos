import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiResponse, Bill } from '../../../types';
import { billApi } from '../api/bill.api';
import {
    createBillFailure,
    createBillRequest,
    createBillSuccess,
    deleteBillFailure,
    deleteBillRequest,
    deleteBillSuccess,
    fetchBillByIdFailure,
    fetchBillByIdRequest,
    fetchBillByIdSuccess,
    fetchBillsFailure,
    fetchBillsRequest,
    fetchBillsSuccess,
    updateBillFailure,
    updateBillRequest,
    updateBillSuccess,
} from './bill.slice';

const logSaga = (message: string, data?: unknown) => {
  if (data !== undefined) {
    console.info('[BillSaga]', message, data);
  } else {
    console.info('[BillSaga]', message);
  }
};

function* fetchBillsSaga() {
  try {
    logSaga('fetchBills request');
    const response: ApiResponse<Bill[]> = yield call(billApi.getAll);
    if (response.success && response.data) {
      logSaga('fetchBills success', { count: response.data.length });
      yield put(fetchBillsSuccess(response.data));
    } else {
      logSaga('fetchBills failure', response.error);
      yield put(fetchBillsFailure(response.error || 'Failed to fetch bills'));
    }
  } catch (error) {
    logSaga('fetchBills error', (error as Error).message);
    yield put(fetchBillsFailure((error as Error).message));
  }
}

function* fetchBillByIdSaga(action: PayloadAction<number>) {
  try {
    logSaga('fetchBillById request', { id: action.payload });
    const response: ApiResponse<Bill> = yield call(billApi.getById, action.payload);
    if (response.success && response.data) {
      logSaga('fetchBillById success', response.data);
      yield put(fetchBillByIdSuccess(response.data));
    } else {
      logSaga('fetchBillById failure', response.error);
      yield put(fetchBillByIdFailure(response.error || 'Failed to fetch bill'));
    }
  } catch (error) {
    logSaga('fetchBillById error', (error as Error).message);
    yield put(fetchBillByIdFailure((error as Error).message));
  }
}

function* createBillSaga(action: PayloadAction<Omit<Bill, 'id' | 'createdAt'>>) {
  try {
    logSaga('createBill request', action.payload);
    const response: ApiResponse<Bill> = yield call(billApi.create, action.payload);
    if (response.success && response.data) {
      logSaga('createBill success', response.data);
      yield put(createBillSuccess(response.data));
    } else {
      logSaga('createBill failure', response.error);
      yield put(createBillFailure(response.error || 'Failed to create bill'));
    }
  } catch (error) {
    logSaga('createBill error', (error as Error).message);
    yield put(createBillFailure((error as Error).message));
  }
}

function* updateBillSaga(action: PayloadAction<{ id: number; bill: Omit<Bill, 'id' | 'createdAt'> }>) {
  try {
    logSaga('updateBill request', action.payload);
    const response: ApiResponse<Bill> = yield call(billApi.update, action.payload.id, action.payload.bill);
    if (response.success && response.data) {
      logSaga('updateBill success', response.data);
      yield put(updateBillSuccess(response.data));
    } else {
      logSaga('updateBill failure', response.error);
      yield put(updateBillFailure(response.error || 'Failed to update bill'));
    }
  } catch (error) {
    logSaga('updateBill error', (error as Error).message);
    yield put(updateBillFailure((error as Error).message));
  }
}

function* deleteBillSaga(action: PayloadAction<number>) {
  try {
    logSaga('deleteBill request', { id: action.payload });
    const response: ApiResponse = yield call(billApi.delete, action.payload);
    if (response.success) {
      logSaga('deleteBill success', { id: action.payload });
      yield put(deleteBillSuccess(action.payload));
    } else {
      logSaga('deleteBill failure', response.error);
      yield put(deleteBillFailure(response.error || 'Failed to delete bill'));
    }
  } catch (error) {
    logSaga('deleteBill error', (error as Error).message);
    yield put(deleteBillFailure((error as Error).message));
  }
}

export function* watchBillSagas() {
  yield takeLatest(fetchBillsRequest.type, fetchBillsSaga);
  yield takeLatest(fetchBillByIdRequest.type, fetchBillByIdSaga);
  yield takeLatest(createBillRequest.type, createBillSaga);
  yield takeLatest(updateBillRequest.type, updateBillSaga);
  yield takeLatest(deleteBillRequest.type, deleteBillSaga);
}
