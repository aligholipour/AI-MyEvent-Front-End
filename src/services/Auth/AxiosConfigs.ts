import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import authService from '../Auth/Auth';

// ایجاد instance axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5066/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن توکن به درخواست‌ها
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // اگر خطای 401 بود و درخواست قبلاً retry نشده بود
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // تلاش برای refresh token
        const newToken = await authService.refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // اگر refresh token هم失效 شد، کاربر را logout کن
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;