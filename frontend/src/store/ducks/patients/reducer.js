export const Types = {
  FETCH_PATIENTS: 'patients/FETCH_PATIENTS',
  FETCH_PATIENTS_SUCCESS: 'patients/FETCH_PATIENTS_SUCCESS',
  FETCH_PATIENTS_FAILED: 'patients/FETCH_PATIENTS_FAILED',
  SET_PATIENTS: 'patients/SET_PATIENTS',
};

const initialState = {
  patients: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_PATIENTS:
      return { ...state, loading: true };
    case Types.FETCH_PATIENTS_SUCCESS:
    case Types.SET_PATIENTS:
      return {
        ...state,
        patients: action.payload,
        loading: false,
      };
    case Types.FETCH_PATIENTS_FAILED:
      return { ...state, patients: null, loading: false };
    default:
      return { ...state };
  }
};

export const Creators = {
  setPatients: (patients) => ({
    type: Types.SET_PATIENTS,
    payload: patients,
  }),

  fetchPatients: () => ({
    type: Types.FETCH_PATIENTS,
  }),

  fetchPatientsSuccess: (patients) => ({
    type: Types.FETCH_PATIENTS_SUCCESS,
    payload: patients,
  }),

  fetchPatientsFailed: () => ({
    type: Types.FETCH_PATIENTS_FAILED,
  }),
};

export default reducer;
