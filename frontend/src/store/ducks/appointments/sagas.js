import { call, put } from 'redux-saga/effects';

import api from '../../../services/api';
import { Creators as AppointmentsActions } from './reducer';

export function * fetchAppointments (action) {
  try {
    const response = yield call(api.get, '/appointment');

    if (response.status === 200) {
      yield put(
        AppointmentsActions.fetchAppointmentsSuccess(
          response.data?.appointments || []
        )
      );
    } else throw new Error();
  } catch (err) {
    yield put(AppointmentsActions.fetchAppointmentsFailed());
  }
}
