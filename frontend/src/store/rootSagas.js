import { all, takeLatest } from '@redux-saga/core/effects';

import { Types as InsurancesTypes } from './ducks/insurances/reducer';
import { fetchInsurances } from './ducks/insurances/sagas';

export function * watchInsurances () {
  all([yield takeLatest(InsurancesTypes.FETCH_INSURANCES, fetchInsurances)]);
}
