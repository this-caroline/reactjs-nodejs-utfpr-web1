export const Types = {
  FETCH_APPOINTMENTS: 'appointments/FETCH_APPOINTMENTS',
  FETCH_APPOINTMENTS_SUCCESS: 'appointments/FETCH_APPOINTMENTS_SUCCESS',
  FETCH_APPOINTMENTS_FAILED: 'appointments/FETCH_APPOINTMENTS_FAILED',
  SET_APPOINTMENTS: 'appointments/SET_APPOINTMENTS',
  SET_DATE: 'appointments/SET_DATE',
};

const initialState = {
  appointments: null,
  loading: false,
  date: new Date().toISOString().split('T')[0],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_APPOINTMENTS:
      return { ...state, loading: true };
    case Types.FETCH_APPOINTMENTS_SUCCESS:
    case Types.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload,
        loading: false,
      };
    case Types.FETCH_APPOINTMENTS_FAILED:
      return { ...state, appointments: null, loading: false };
    case Types.SET_DATE:
      return { ...state, date: action.payload };
    default:
      return { ...state };
  }
};

export const Creators = {
  setAppointments: (appointments) => ({
    type: Types.SET_APPOINTMENTS,
    payload: appointments,
  }),

  fetchAppointments: () => ({
    type: Types.FETCH_APPOINTMENTS,
  }),

  fetchAppointmentsSuccess: (appointments) => ({
    type: Types.FETCH_APPOINTMENTS_SUCCESS,
    payload: appointments,
  }),

  fetchAppointmentsFailed: () => ({
    type: Types.FETCH_APPOINTMENTS_FAILED,
  }),

  setDate: (date) => ({
    type: Types.SET_DATE,
    payload: date,
  }),
};

export default reducer;
