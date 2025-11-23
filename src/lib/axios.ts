import axios from "axios";
import { tokenRefreshService } from "./tokenRefresh";

/**
 * ============================================
 * AXIOS INSTANCE - WITH AUTO REFRESH
 * ============================================
 * - Menggunakan Bearer token authentication
 * - Auto refresh token ketika 401
 * - Handle concurrent refresh requests
 * - Centralized error handling
 */

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 detik timeout
});

/**
 * REQUEST INTERCEPTOR
 * Otomatis menambahkan Bearer token dari localStorage
 */
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle 401 Unauthorized - auto refresh token kemudian retry
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        // Mark request to prevent infinite loop
        originalRequest._retry = true;

        // Refresh token
        const newToken = await tokenRefreshService.refreshToken();

        // Update authorization header dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry original request dengan token baru
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, akan logout otomatis
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
