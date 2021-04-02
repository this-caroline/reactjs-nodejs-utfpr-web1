export const Types = {
  FETCH_INSURANCES: 'insurances/FETCH_INSURANCES',
  FETCH_INSURANCES_SUCCESS: 'insurances/FETCH_INSURANCES_SUCCESS',
  FETCH_INSURANCES_FAILED: 'insurances/FETCH_INSURANCES_FAILED',
  SET_INSURANCES: 'insurances/SET_INSURANCES',
};

const initialState = {
  insurances: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_INSURANCES:
      return { ...state, loading: true };
    case Types.FETCH_INSURANCES_SUCCESS:
    case Types.SET_INSURANCES:
      return {
        ...state,
        insurances: action.payload,
        loading: false,
      };
    case Types.FETCH_INSURANCES_FAILED:
      return { ...state, insurances: null, loading: false };
    default:
      return { ...state };
  }
};

export const Creators = {
  setInsurances: (insurances) => ({
    type: Types.SET_INSURANCES,
    payload: insurances,
  }),

  fetchInsurances: () => ({
    type: Types.FETCH_INSURANCES,
  }),

  fetchInsurancesSuccess: (insurances) => ({
    type: Types.FETCH_INSURANCES_SUCCESS,
    payload: insurances,
  }),

  fetchInsurancesFailed: () => ({
    type: Types.FETCH_INSURANCES_FAILED,
  }),
};

export default reducer;
