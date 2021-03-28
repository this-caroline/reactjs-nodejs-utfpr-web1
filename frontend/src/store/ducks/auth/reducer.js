export const Types = {
  SET_USER: 'auth/SET_USER',
  USER_LOGOUT: 'auth/USER_LOGOUT',
};

const initialState = {
  isAuthenticated: false,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      };
    case Types.USER_LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};

export const Creators = {
  setUser: (user) => ({
    type: Types.SET_USER,
    payload: user,
  }),
  logout: () => ({
    type: Types.USER_LOGOUT,
  }),
};

export default reducer;
