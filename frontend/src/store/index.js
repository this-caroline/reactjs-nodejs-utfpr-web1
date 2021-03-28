import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import auth, { Types as AuthTypes } from './ducks/auth/reducer';

const appReducer = combineReducers({
  auth,
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

export default store;