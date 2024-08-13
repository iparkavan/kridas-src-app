import Axios, { isAxiosError } from 'axios';
import { useAuth } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axios = Axios.create({ baseURL: API_BASE_URL });

const axiosPrivate = Axios.create({ baseURL: API_BASE_URL });

axiosPrivate.interceptors.request.use(
  async (config) => {
    const { auth } = useAuth.getState();

    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 403) {
        useAuth.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export { axios, axiosPrivate };
