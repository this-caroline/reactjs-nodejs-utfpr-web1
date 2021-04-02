import { call, put } from 'redux-saga/effects';

import api from '../../../services/api';
import { Creators as InsurancesActions } from './reducer';

export function * fetchInsurances (action) {
  try {
    const response = yield call(api.get, '/insurance');

    if (response.status === 200) {
      yield put(
        InsurancesActions.fetchInsurancesSuccess(response.data?.insurances || [])
      );
    } else throw new Error();
  } catch (err) {
    yield put(InsurancesActions.fetchInsurancesFailed());
  }
}
