import { call, put } from 'redux-saga/effects';

import api from '../../../services/api';
import { Creators as AuthActions } from '../ducks/auth';

export function * signIn (action) {
  try {
    const response = yield call(api.post, '/sessions', { ...action.payload });

    if (response.status === 200) {
      yield localStorage.setItem('token', response.data.token);
      yield put(AuthActions.signInSuccess({
        id: response.data.id,
        username: response.data.username,
        token: response.data.token,
      }));
    }
  } catch (err) {
    const errorData = err.response
      ? yield { status: err.response.status, message: err.response.data.message }
      : yield { status: 500, message: 'Server error' };

    yield put(AuthActions.signInFailed(errorData));
  }
}
