import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import auth, { Types as AuthTypes } from './ducks/auth/reducer';
import insurances from './ducks/insurances/reducer';
import patients from './ducks/patients/reducer';
import { watchInsurances, watchPatients } from './rootSagas';

const appReducer = combineReducers({
  auth,
  insurances,
  patients,
});

const rootReducer = (state, action) => {
  if (action.type === AuthTypes.USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchInsurances);
sagaMiddleware.run(watchPatients);

export default store;
