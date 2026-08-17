import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Request interceptor — attach token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('lf_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
