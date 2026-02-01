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

const logSaga = (message: string, data?: unknown) => {
  if (data !== undefined) {
    console.info('[ProductSaga]', message, data);
  } else {
    console.info('[ProductSaga]', message);
  }
};

function* fetchProductsSaga() {
  try {
    logSaga('fetchProducts request');
    const response: ApiResponse<Product[]> = yield call(productApi.getAll);
    if (response.success && response.data) {
      logSaga('fetchProducts success', { count: response.data.length });
      yield put(fetchProductsSuccess(response.data));
    } else {
      logSaga('fetchProducts failure', response.error);
      yield put(fetchProductsFailure(response.error || 'Failed to fetch products'));
    }
  } catch (error) {
    logSaga('fetchProducts error', (error as Error).message);
    yield put(fetchProductsFailure((error as Error).message));
  }
}

function* fetchProductByIdSaga(action: PayloadAction<number>) {
  try {
    logSaga('fetchProductById request', { id: action.payload });
    const response: ApiResponse<Product> = yield call(productApi.getById, action.payload);
    if (response.success && response.data) {
      logSaga('fetchProductById success', response.data);
      yield put(fetchProductByIdSuccess(response.data));
    } else {
      logSaga('fetchProductById failure', response.error);
      yield put(fetchProductByIdFailure(response.error || 'Failed to fetch product'));
    }
  } catch (error) {
    logSaga('fetchProductById error', (error as Error).message);
    yield put(fetchProductByIdFailure((error as Error).message));
  }
}

function* createProductSaga(action: PayloadAction<Omit<Product, 'id' | 'createdAt'>>) {
  try {
    logSaga('createProduct request', action.payload);
    const response: ApiResponse<Product> = yield call(productApi.create, action.payload);
    if (response.success && response.data) {
      logSaga('createProduct success', response.data);
      yield put(createProductSuccess(response.data));
    } else {
      logSaga('createProduct failure', response.error);
      yield put(createProductFailure(response.error || 'Failed to create product'));
    }
  } catch (error) {
    logSaga('createProduct error', (error as Error).message);
    yield put(createProductFailure((error as Error).message));
  }
}

function* updateProductSaga(action: PayloadAction<{ id: number; product: Omit<Product, 'id' | 'createdAt'> }>) {
  try {
    logSaga('updateProduct request', action.payload);
    const response: ApiResponse<Product> = yield call(productApi.update, action.payload.id, action.payload.product);
    if (response.success && response.data) {
      logSaga('updateProduct success', response.data);
      yield put(updateProductSuccess(response.data));
    } else {
      logSaga('updateProduct failure', response.error);
      yield put(updateProductFailure(response.error || 'Failed to update product'));
    }
  } catch (error) {
    logSaga('updateProduct error', (error as Error).message);
    yield put(updateProductFailure((error as Error).message));
  }
}

function* deleteProductSaga(action: PayloadAction<number>) {
  try {
    logSaga('deleteProduct request', { id: action.payload });
    const response: ApiResponse = yield call(productApi.delete, action.payload);
    if (response.success) {
      logSaga('deleteProduct success', { id: action.payload });
      yield put(deleteProductSuccess(action.payload));
    } else {
      logSaga('deleteProduct failure', response.error);
      yield put(deleteProductFailure(response.error || 'Failed to delete product'));
    }
  } catch (error) {
    logSaga('deleteProduct error', (error as Error).message);
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
