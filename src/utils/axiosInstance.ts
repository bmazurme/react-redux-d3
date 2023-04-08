import axios, { AxiosError, AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (e) => {
    const error = e as AxiosError;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      console.error('Code 401 (Unauthorized)');
      error.response.data = 'Unauthorized error';
    }

    if (error.response.status >= 500 && error.response.status < 600) {
      error.response.data = 'Server error';
    }

    return Promise.reject<AxiosError>(error);
  },
);

export default function getAxiosInstance(baseURL = '/') {
  axiosInstance.defaults.baseURL = baseURL;
  return axiosInstance;
}
