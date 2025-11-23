/**
 * Token Refresh Service
 * Handle automatic token refresh untuk maintain session
 */

import { authUtils } from "@/hooks/useAuth";
import { toast } from "sonner";
import { axiosInstance } from "./axios";

export interface RefreshResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class TokenRefreshService {
  private isRefreshing = false;
  private refreshSubscribers: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = authUtils.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axiosInstance.post("/api/refresh", {
        refresh_token: refreshToken,
      });

      const data = response.data as RefreshResponse;

      if (data.success && data.access_token && data.refresh_token) {
        // Update tokens di localStorage
        authUtils.setTokens(data.access_token, data.refresh_token);
        return data.access_token;
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error: any) {
      // Log error untuk debugging
      console.error("Token refresh failed:", error);

      // Clear tokens dan redirect ke login
      authUtils.logout();

      // Show user-friendly error
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to refresh session. Please login again.");
      }

      // Redirect ke login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }

      throw error;
    }
  }

  /**
   * Handle multiple concurrent refresh requests
   */
  async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      // Jika sudah refresh request berjalan, tunggu hasilnya
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await this.refreshAccessToken();

      // Resolve semua pending requests
      this.refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
      this.refreshSubscribers = [];

      return newToken;
    } catch (error) {
      // Reject semua pending requests
      this.refreshSubscribers.forEach(({ reject }) => reject(error));
      this.refreshSubscribers = [];

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if token needs refresh (akan expired dalam 5 menit)
   */
  shouldRefreshToken(): boolean {
    const loginTime = localStorage.getItem("login_time");
    const expiresIn = 30 * 60 * 1000; // 30 menit dalam milliseconds
    const warningTime = 5 * 60 * 1000; // 5 menit sebelum expired
    const currentTime = Date.now();

    if (loginTime) {
      const timeSinceLogin = currentTime - parseInt(loginTime);
      const timeUntilExpiry = expiresIn - timeSinceLogin;

      // Refresh jika kurang dari 5 menit lagi
      return timeUntilExpiry <= warningTime;
    }

    return false;
  }

  /**
   * Logout user (dari semua devices)
   */
  logout(): void {
    // Logout dari server (hapus semua refresh tokens untuk user ini)
    axiosInstance
      .post("/api/logout")
      .catch((error) => {
        // Tetap lanjutkan logout lokal walau server gagal
      })
      .finally(() => {
        // Trigger storage event untuk tab lain (cross-tab logout)
        if (typeof window !== "undefined") {
          // Clear and trigger storage events
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          localStorage.removeItem("permissions");
          localStorage.removeItem("login_time");

          // Force storage events untuk trigger logout di tab lain
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'token',
            oldValue: localStorage.getItem('token'),
            newValue: null,
            storageArea: localStorage
          }));

          // Redirect ke login
          window.location.href = "/auth/login";
        }
      });
  }
}

// Export singleton instance
export const tokenRefreshService = new TokenRefreshService();
