import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiResponse, Product } from '../../../types';
import { productApi } from '../api/product.api';
import {
    createProductFailure,
    createProductRequest,
    createProductSuccess,
    deleteProductFailure,
    deleteProductRequest,
    deleteProductSuccess,
    fetchProductByIdFailure,
    fetchProductByIdRequest,
    fetchProductByIdSuccess,
    fetchProductsFailure,
    fetchProductsRequest,
    fetchProductsSuccess,
    updateProductFailure,
    updateProductRequest,
    updateProductSuccess,
} from './product.slice';

function* fetchProductsSaga() {
  try {
    const response: ApiResponse<Product[]> = yield call(productApi.getAll);
    if (response.success && response.data) {
      yield put(fetchProductsSuccess(response.data));
    } else {
      yield put(fetchProductsFailure(response.error || 'Failed to fetch products'));
    }
  } catch (error) {
    yield put(fetchProductsFailure((error as Error).message));
  }
}

function* fetchProductByIdSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse<Product> = yield call(productApi.getById, action.payload);
    if (response.success && response.data) {
      yield put(fetchProductByIdSuccess(response.data));
    } else {
      yield put(fetchProductByIdFailure(response.error || 'Failed to fetch product'));
    }
  } catch (error) {
    yield put(fetchProductByIdFailure((error as Error).message));
  }
}

function* createProductSaga(action: PayloadAction<Omit<Product, 'id' | 'createdAt'>>) {
  try {
    const response: ApiResponse<Product> = yield call(productApi.create, action.payload);
    if (response.success && response.data) {
      yield put(createProductSuccess(response.data));
    } else {
      yield put(createProductFailure(response.error || 'Failed to create product'));
    }
  } catch (error) {
    yield put(createProductFailure((error as Error).message));
  }
}

function* updateProductSaga(action: PayloadAction<{ id: number; product: Omit<Product, 'id' | 'createdAt'> }>) {
  try {
    const response: ApiResponse<Product> = yield call(productApi.update, action.payload.id, action.payload.product);
    if (response.success && response.data) {
      yield put(updateProductSuccess(response.data));
    } else {
      yield put(updateProductFailure(response.error || 'Failed to update product'));
    }
  } catch (error) {
    yield put(updateProductFailure((error as Error).message));
  }
}

function* deleteProductSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse = yield call(productApi.delete, action.payload);
    if (response.success) {
      yield put(deleteProductSuccess(action.payload));
    } else {
      yield put(deleteProductFailure(response.error || 'Failed to delete product'));
    }
  } catch (error) {
    yield put(deleteProductFailure((error as Error).message));
  }
}

export function* watchProductSagas() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
  yield takeLatest(fetchProductByIdRequest.type, fetchProductByIdSaga);
  yield takeLatest(createProductRequest.type, createProductSaga);
  yield takeLatest(updateProductRequest.type, updateProductSaga);
  yield takeLatest(deleteProductRequest.type, deleteProductSaga);
}
