import axios from "axios";
import { tokenRefreshService } from "./tokenRefresh";

// Track ongoing refresh requests to prevent duplicates
let ongoingRefreshRequest: Promise<string> | null = null;

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
  baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 detik timeout
});

/**
 * REQUEST INTERCEPTOR
 * Proactive refresh: Jika access token missing tapi refresh token ada, refresh dulu
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh_token");

      // Jika tidak ada access token tapi ada refresh token, coba refresh dulu
      if (!token && refreshToken && !config.url?.includes("/api/refresh")) {
        try {
          // Check if there's already an ongoing refresh request
          if (ongoingRefreshRequest) {
            const newToken = await ongoingRefreshRequest;
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          }

          // Create new refresh request
          ongoingRefreshRequest = (async () => {
            try {
              // Gunakan instance axios terpisah untuk menghindari infinite loop
              const refreshAxios = axios.create({
                baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                timeout: 10000,
              });

              const response = await refreshAxios.post("/api/refresh", {
                refresh_token: refreshToken,
              });

              const data = response.data;

              if (data.success && data.access_token && data.refresh_token) {
                // Hanya update access token, refresh token TETAP SAMA
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("login_time", Date.now().toString());

                return data.access_token;
              } else {
                throw new Error("Invalid refresh response format");
              }
            } finally {
              // Clear ongoing request after completion
              ongoingRefreshRequest = null;
            }
          })();

          const newToken = await ongoingRefreshRequest;

          // Gunakan token baru untuk request ini
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error: any) {
          // Clear ongoing request on error
          ongoingRefreshRequest = null;

          // Jika 429 (rate limit) atau 401 (invalid refresh), hapus refresh token
          if (error.response?.status === 429 || error.response?.status === 401) {
            localStorage.removeItem("refresh_token");
          }
        }
      } else if (token) {
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
 * Backend-driven approach: hanya refresh jika backend response 401 dan refresh token tersedia
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized, kecuali untuk refresh dan logout endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/refresh") &&
      !originalRequest.url?.includes("/api/logout")
    ) {
      // Mark request to prevent infinite loop
      originalRequest._retry = true;

      // Hanya coba refresh jika refresh token tersedia
      if (tokenRefreshService.hasRefreshToken()) {
        try {
          // Coba refresh token - backend yang akan putuskan berhasil atau tidak
          const newToken = await tokenRefreshService.refreshToken();

          // Update authorization header dengan token baru
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry original request dengan token baru
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh gagal - biarkan tokenRefreshService yang handle logout
          // Error akan propagate dan user akan melihat pesan yang tepat
          return Promise.reject(refreshError);
        }
      } else {
        // Tidak ada refresh token, biarkan error 401 propagate
        // User akan di-redirect oleh login guard atau auth check
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
