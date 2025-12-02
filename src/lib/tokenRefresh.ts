/**
 * Token Refresh Service
 * Handle automatic token refresh untuk maintain session
 */

import axios from "axios";
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
   * Backend-driven approach: frontend hanya mencoba refresh, backend yang putuskan
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = authUtils.getRefreshToken();

    if (!refreshToken) {
      // Tidak ada refresh token, harus login lagi
      this.handleLogout("No refresh token available. Please login.");
      throw new Error("No refresh token available");
    }

    try {
      const response = await axiosInstance.post("/api/refresh", {
        refresh_token: refreshToken,
      });

      const data = response.data as RefreshResponse;

      if (data.success && data.access_token && data.refresh_token) {
        // Update access token saja, refresh token TETAP SAMA
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("login_time", Date.now().toString());

        return data.access_token;
      } else {
        // Backend response tidak sesuai expected format
        throw new Error("Invalid refresh response from server");
      }
    } catch (error: any) {
      console.error("Token refresh failed:", error);

      // Backend bilang refresh token invalid/expired (401) -> harus login lagi
      if (error.response?.status === 401) {
        this.handleLogout("Session expired. Please login again.");
        toast.error("Session expired. Please login again.");
        throw new Error("Session expired");
      }

      // Server error (500) atau network error -> jangan langsung logout
      if (error.response?.status >= 500) {
        toast.error("Server error during token refresh. Please try again.");
        throw new Error("Server error during refresh");
      }

      // Error lain (network, rate limit 429) -> biarkan caller handle
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
   * Handle logout yang konsisten
   */
  private handleLogout(reason?: string): void {
    if (reason) {
      console.log("Logging out:", reason);
    }

    authUtils.logout();

    // Trigger storage event untuk tab lain
    if (typeof window !== "undefined") {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        oldValue: localStorage.getItem('token'),
        newValue: null,
        storageArea: localStorage
      }));

      // Redirect ke login
      window.location.href = "/auth/login";
    }
  }

  /**
   * Cek apakah refresh token tersedia untuk dicoba
   * Frontend tidak perlu validasi expiry, biarkan backend yang putuskan
   */
  hasRefreshToken(): boolean {
    return !!authUtils.getRefreshToken();
  }

  /**
   * Check if token needs refresh (akan expired dalam 5 menit)
   * Dipertahankan untuk proactive refresh, tapi backend yang final decision
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
    // Get current token for server logout (use direct axios to avoid interceptor loop)
    const currentToken = authUtils.getToken();

    // Logout dari server (hapus semua refresh tokens untuk user ini)
    // Gunakan axios instance terpisah untuk menghindari infinite loop
    const logoutAxios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
      },
      timeout: 5000,
    });

    logoutAxios
      .post("/api/logout")
      .catch((error) => {
        // Tetap lanjutkan logout lokal walau server gagal
        console.warn("Server logout failed:", error.response?.status || error.message);
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

/**
 * Storage Event Listener untuk Cross-Tab Token Management
 * Debounce untuk prevent race conditions
 */
if (typeof window !== "undefined") {
  let refreshTimeout: NodeJS.Timeout | null = null;

  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      // Access token diubah di tab lain
      if (!event.newValue && event.oldValue) {
        // Token dihapus di tab lain, coba refresh jika ada refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // Debounce untuk prevent multiple simultaneous refreshes
          if (refreshTimeout) {
            clearTimeout(refreshTimeout);
          }

          refreshTimeout = setTimeout(async () => {
            try {
              await tokenRefreshService.refreshToken();
              // Trigger event untuk memberitahu tab lain
              window.dispatchEvent(new CustomEvent('tokenRefreshed', {
                detail: { success: true }
              }));
            } catch (error) {
              // Storage event tidak bisa redirect, biarkan user action di tab aktif
            }
          }, 100); // 100ms delay
        }
      }
    }

    if (event.key === 'refresh_token') {
      // Refresh token dihapus di tab lain (logout)
      if (!event.newValue && event.oldValue) {
        // Tidak perlu redirect di sini, biarkan masing-masing tab handle
      }
    }
  });
}

// Export singleton instance
export const tokenRefreshService = new TokenRefreshService();
