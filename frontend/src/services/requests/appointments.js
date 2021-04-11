import api from '../api';

export const fetchAppointments = async () => {
  try {
    const response = await api.get('/appointment');
    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const createAppointment = async (payload) => {
  try {
    const response = await api.post('/appointment', payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return {
      success: false,
      data: null,
      status: error?.response?.status,
      error: error?.response?.data?.message || error,
      field: error?.response?.data?.field || null,
    };
  }
};

export const updateAppointment = async (id, payload) => {
  try {
    const response = await api.put(`/appointment/${id}`, payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return {
      success: false,
      data: null,
      status: error?.response?.status,
      error: error?.response?.data?.message || error,
      field: error?.response?.data?.field || null,
    };
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`/appointment/${id}`);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};
