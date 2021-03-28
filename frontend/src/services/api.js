import axios from 'axios';

import { API_BASE_URL } from '../utils/contants';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, async (error) => {
  if (error.response && error.response.config.url !== '/session') {
    localStorage.clear();
    window.location.reload();
  }

  return Promise.reject(error);
});

export default api;
