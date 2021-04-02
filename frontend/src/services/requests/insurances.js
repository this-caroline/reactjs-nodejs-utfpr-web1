import api from '../api';

export const createInsurance = async (payload) => {
  try {
    const response = await api.post('/insurance', payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const updateInsurance = async (id, payload) => {
  try {
    const response = await api.put(`/insurance/${id}`, payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const deleteInsurance = async (id) => {
  try {
    const response = await api.delete(`/insurance/${id}`);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};
