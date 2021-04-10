import { all, takeLatest } from '@redux-saga/core/effects';

import { Types as AppointmentsTypes } from './ducks/appointments/reducer';
import { Types as InsurancesTypes } from './ducks/insurances/reducer';
import { Types as PatientsTypes } from './ducks/patients/reducer';
import { fetchInsurances } from './ducks/insurances/sagas';
import { fetchPatients } from './ducks/patients/sagas';
import { fetchAppointments } from './ducks/appointments/sagas';

export function * watchInsurances () {
  all([yield takeLatest(InsurancesTypes.FETCH_INSURANCES, fetchInsurances)]);
}

export function * watchPatients () {
  all([yield takeLatest(PatientsTypes.FETCH_PATIENTS, fetchPatients)])
}

export function * watchAppointments () {
  all([yield takeLatest(AppointmentsTypes.FETCH_APPOINTMENTS, fetchAppointments)])
}
