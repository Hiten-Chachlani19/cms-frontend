import axios from 'axios';

// Variable ko object ke bahar declare karo
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL, // Yahan key 'baseURL' (small b, camelCase) honi chahiye
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  
  // Clean string check: token properly formatted aur non-empty hona chahiye
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Guest user ke liye Header remove kar do
    delete config.headers.Authorization;
  }
  
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Agar request bina auth header/token ke fail hui hai (e.g. guest mode me endpoint restricted hai)
    // toh refresh flow trigger hi mat karo.
    const hasAuthHeader = originalRequest?.headers?.Authorization;

    if (!hasAuthHeader) {
      return Promise.reject(error);
    }

    // 2. Auth/Login endpoints ke liye refresh skip karo
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // 3. Status 401 hai aur authenticated request thi -> Attempt Refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      const currentToken = localStorage.getItem('access_token');

      if (!currentToken || currentToken === 'undefined' || currentToken === 'null') {
        localStorage.removeItem('access_token');
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          'http://localhost:8000/api/v1/auth/refresh',
          {},
          {
            headers: { Authorization: `Bearer ${currentToken}` },
          }
        );

        const newToken = data.access_token || data.data?.access_token;
        if (!newToken) throw new Error('No new token returned');

        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token bhi expire ho chuka hai
        localStorage.removeItem('access_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;