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

function* fetchBillsSaga() {
  try {
    const response: ApiResponse<Bill[]> = yield call(billApi.getAll);
    if (response.success && response.data) {
      yield put(fetchBillsSuccess(response.data));
    } else {
      yield put(fetchBillsFailure(response.error || 'Failed to fetch bills'));
    }
  } catch (error) {
    yield put(fetchBillsFailure((error as Error).message));
  }
}

function* fetchBillByIdSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse<Bill> = yield call(billApi.getById, action.payload);
    if (response.success && response.data) {
      yield put(fetchBillByIdSuccess(response.data));
    } else {
      yield put(fetchBillByIdFailure(response.error || 'Failed to fetch bill'));
    }
  } catch (error) {
    yield put(fetchBillByIdFailure((error as Error).message));
  }
}

function* createBillSaga(action: PayloadAction<Omit<Bill, 'id' | 'createdAt'>>) {
  try {
    const response: ApiResponse<Bill> = yield call(billApi.create, action.payload);
    if (response.success && response.data) {
      yield put(createBillSuccess(response.data));
    } else {
      yield put(createBillFailure(response.error || 'Failed to create bill'));
    }
  } catch (error) {
    yield put(createBillFailure((error as Error).message));
  }
}

function* updateBillSaga(action: PayloadAction<{ id: number; bill: Omit<Bill, 'id' | 'createdAt'> }>) {
  try {
    const response: ApiResponse<Bill> = yield call(billApi.update, action.payload.id, action.payload.bill);
    if (response.success && response.data) {
      yield put(updateBillSuccess(response.data));
    } else {
      yield put(updateBillFailure(response.error || 'Failed to update bill'));
    }
  } catch (error) {
    yield put(updateBillFailure((error as Error).message));
  }
}

function* deleteBillSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse = yield call(billApi.delete, action.payload);
    if (response.success) {
      yield put(deleteBillSuccess(action.payload));
    } else {
      yield put(deleteBillFailure(response.error || 'Failed to delete bill'));
    }
  } catch (error) {
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
