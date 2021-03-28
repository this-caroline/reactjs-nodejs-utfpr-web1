import api from '../api';

export const checkAuth  = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) throw new Error();

    const response = await api.post('/auth/validate', { token });

    if (!response?.data.success || response?.data.decoded.exp < Date.now() / 1000) {
      throw new Error();
    }

    return {
      success: true,
      user: {
        userId: response.data.decoded.userId,
        username: response.data.decoded.username,
      },
    };
  } catch (error) {
    return { user: null, success: false };
  }
};
