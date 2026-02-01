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

const logSaga = (message: string, data?: unknown) => {
  if (data !== undefined) {
    console.info('[UserSaga]', message, data);
  } else {
    console.info('[UserSaga]', message);
  }
};

function* fetchUsersSaga() {
  try {
    logSaga('fetchUsers request');
    const response: ApiResponse<User[]> = yield call(userApi.getAll);
    if (response.success && response.data) {
      logSaga('fetchUsers success', { count: response.data.length });
      yield put(fetchUsersSuccess(response.data));
    } else {
      logSaga('fetchUsers failure', response.error);
      yield put(fetchUsersFailure(response.error || 'Failed to fetch users'));
    }
  } catch (error) {
    logSaga('fetchUsers error', (error as Error).message);
    yield put(fetchUsersFailure((error as Error).message));
  }
}

function* fetchUserByIdSaga(action: PayloadAction<number>) {
  try {
    logSaga('fetchUserById request', { id: action.payload });
    const response: ApiResponse<User> = yield call(userApi.getById, action.payload);
    if (response.success && response.data) {
      logSaga('fetchUserById success', response.data);
      yield put(fetchUserByIdSuccess(response.data));
    } else {
      logSaga('fetchUserById failure', response.error);
      yield put(fetchUserByIdFailure(response.error || 'Failed to fetch user'));
    }
  } catch (error) {
    logSaga('fetchUserById error', (error as Error).message);
    yield put(fetchUserByIdFailure((error as Error).message));
  }
}

function* createUserSaga(action: PayloadAction<Omit<User, 'id' | 'createdAt'>>) {
  try {
    logSaga('createUser request', action.payload);
    const response: ApiResponse<User> = yield call(userApi.create, action.payload);
    if (response.success && response.data) {
      logSaga('createUser success', response.data);
      yield put(createUserSuccess(response.data));
    } else {
      logSaga('createUser failure', response.error);
      yield put(createUserFailure(response.error || 'Failed to create user'));
    }
  } catch (error) {
    logSaga('createUser error', (error as Error).message);
    yield put(createUserFailure((error as Error).message));
  }
}

function* updateUserSaga(action: PayloadAction<{ id: number; user: Omit<User, 'id' | 'createdAt'> }>) {
  try {
    logSaga('updateUser request', action.payload);
    const response: ApiResponse<User> = yield call(userApi.update, action.payload.id, action.payload.user);
    if (response.success && response.data) {
      logSaga('updateUser success', response.data);
      yield put(updateUserSuccess(response.data));
    } else {
      logSaga('updateUser failure', response.error);
      yield put(updateUserFailure(response.error || 'Failed to update user'));
    }
  } catch (error) {
    logSaga('updateUser error', (error as Error).message);
    yield put(updateUserFailure((error as Error).message));
  }
}

function* deleteUserSaga(action: PayloadAction<number>) {
  try {
    logSaga('deleteUser request', { id: action.payload });
    const response: ApiResponse = yield call(userApi.delete, action.payload);
    if (response.success) {
      logSaga('deleteUser success', { id: action.payload });
      yield put(deleteUserSuccess(action.payload));
    } else {
      logSaga('deleteUser failure', response.error);
      yield put(deleteUserFailure(response.error || 'Failed to delete user'));
    }
  } catch (error) {
    logSaga('deleteUser error', (error as Error).message);
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
