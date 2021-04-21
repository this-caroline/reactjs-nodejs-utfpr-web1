import api from '../api';

export const fetchPatients = async (name) => {
  try {
    const response = await api.get(
      name
        ? `/patient?name=${name}`
        : '/patient'
    );

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const createPatient = async (payload) => {
  try {
    const response = await api.post('/patient', payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const updatePatient = async (id, payload) => {
  try {
    const response = await api.put(`/patient/${id}`, payload);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patient/${id}`);

    if (response.status === 200) {
      return { success: true, data: response?.data };
    } else throw new Error();
  } catch (error) {
    /** TO DO: Implement error handling... */
    return { success: false, data: null, error };
  }
};
