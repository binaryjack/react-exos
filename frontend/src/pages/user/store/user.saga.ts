import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiResponse, User } from '../../../types';
import { userApi } from '../api/user.api';
import {
    createUserFailure,
    createUserRequest,
    createUserSuccess,
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    fetchUserByIdFailure,
    fetchUserByIdRequest,
    fetchUserByIdSuccess,
    fetchUsersFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    updateUserFailure,
    updateUserRequest,
    updateUserSuccess,
} from './user.slice';

function* fetchUsersSaga() {
  try {
    const response: ApiResponse<User[]> = yield call(userApi.getAll);
    if (response.success && response.data) {
      yield put(fetchUsersSuccess(response.data));
    } else {
      yield put(fetchUsersFailure(response.error || 'Failed to fetch users'));
    }
  } catch (error) {
    yield put(fetchUsersFailure((error as Error).message));
  }
}

function* fetchUserByIdSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse<User> = yield call(userApi.getById, action.payload);
    if (response.success && response.data) {
      yield put(fetchUserByIdSuccess(response.data));
    } else {
      yield put(fetchUserByIdFailure(response.error || 'Failed to fetch user'));
    }
  } catch (error) {
    yield put(fetchUserByIdFailure((error as Error).message));
  }
}

function* createUserSaga(action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) {
  try {
    const response: ApiResponse<User> = yield call(userApi.create, action.payload);
    if (response.success && response.data) {
      yield put(createUserSuccess(response.data));
    } else {
      yield put(createUserFailure(response.error || 'Failed to create user'));
    }
  } catch (error) {
    yield put(createUserFailure((error as Error).message));
  }
}

function* updateUserSaga(action: PayloadAction<{ id: number; user: Omit<User, 'id' | 'createdAt'> }>) {
  try {
    const response: ApiResponse<User> = yield call(userApi.update, action.payload.id, action.payload.user);
    if (response.success && response.data) {
      yield put(updateUserSuccess(response.data));
    } else {
      yield put(updateUserFailure(response.error || 'Failed to update user'));
    }
  } catch (error) {
    yield put(updateUserFailure((error as Error).message));
  }
}

function* deleteUserSaga(action: PayloadAction<number>) {
  try {
    const response: ApiResponse = yield call(userApi.delete, action.payload);
    if (response.success) {
      yield put(deleteUserSuccess(action.payload));
    } else {
      yield put(deleteUserFailure(response.error || 'Failed to delete user'));
    }
  } catch (error) {
    yield put(deleteUserFailure((error as Error).message));
  }
}

export function* watchUserSagas() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserByIdRequest.type, fetchUserByIdSaga);
  yield takeLatest(createUserRequest.type, createUserSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
  yield takeLatest(deleteUserRequest.type, deleteUserSaga);
}
