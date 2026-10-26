import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;
const apiBase = rawBaseUrl ? `${rawBaseUrl.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = localStorage.getItem('accessToken') || null;

export const setAuthToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

if (accessToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

// Axios response interceptor for silent token refresh (AUTH-04)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.errors?.expired &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshEndpoint = rawBaseUrl ? `${rawBaseUrl.replace(/\/$/, '')}/api/auth/refresh` : '/api/auth/refresh';
        const { data } = await axios.post(refreshEndpoint, {}, { withCredentials: true });
        if (data?.data?.accessToken) {
          setAuthToken(data.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        setAuthToken(null);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
