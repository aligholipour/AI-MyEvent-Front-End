import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import authService from '../Auth/Auth';

let showToast: (message: string, type?: "success" | "error") => void;

export const registerToast = (
  fn: typeof showToast
) => {
  showToast = fn;
};

export const toastError = (message: string) => {
  showToast?.(message, "error");
};

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

    console.log("ERROR INTERCEPTED", error.response?.status);
    
    const status = error.response?.status;

    switch (status) {
      case 400:
        toastError("درخواست نامعتبر است");
        break;
      case 401:
        break;
      case 403:
        toastError("دسترسی غیرمجاز");
        break;
      case 404:
        toastError("اطلاعات یافت نشد");
        break;
      case 500:
        toastError("خطای داخلی سرور");
        break;
      default:
        toastError(
          (error.response?.data as any)?.message || "خطای ناشناخته");
        break;
    }

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