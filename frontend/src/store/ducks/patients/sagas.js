import { call, put } from 'redux-saga/effects';

import api from '../../../services/api';
import { Creators as PatientsActions } from './reducer';

export function * fetchPatients (action) {
  try {
    const response = yield call(api.get, '/patient');

    if (response.status === 200) {
      yield put(
        PatientsActions.fetchPatientsSuccess(response.data?.patients || [])
      );
    } else throw new Error();
  } catch (err) {
    yield put(PatientsActions.fetchPatientsFailed());
  }
}
