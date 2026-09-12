import axios from 'axios';

/**
 * Axios Instance Configuration for Eventify REST API calls.
 * 
 * Concept Explanation:
 * - What it is: A pre-configured Axios HTTP client instance with base URLs and headers.
 * - Why we need it: Avoids repeating full server URLs in every component and allows centralized request/response interceptors.
 * - Where we use it: Used across services and components to communicate with the backend server.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Network error or server unreachable',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export default API;
