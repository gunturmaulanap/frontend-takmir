import axios from "axios";
import { User } from "@/types/auth";
import { authUtils } from "@/hooks/useAuth";

// Create separate axios instance for login to avoid proactive refresh during login
const loginAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export interface LoginRequest {
  id: string; // email atau username (sesuai backend)
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await loginAxiosInstance.post("/api/login", data);

    // Transform response to match User type
    const transformedUser: User = {
      ...response.data.user,
      roles: response.data.user.roles || [response.data.user.role],
      permissions: response.data.permissions || [],
      profile_masjid:
        response.data.profile_masjid ||
        response.data.user?.profile_masjid ||
        null, // Try root first, then user
    };

    // Simpan access token, refresh token, user, dan permissions ke localStorage
    if (response.data.success && response.data.access_token) {
      // Use authUtils for consistent storage
      authUtils.setTokens(response.data.access_token, response.data.refresh_token);
      authUtils.setUser(transformedUser);
      localStorage.setItem("login_time", Date.now().toString()); // Track login time untuk reference

      // Simpan permissions secara terpisah untuk permission checker
      if (response.data.permissions) {
        localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
      }
    }

    return {
      success: response.data.success,
      user: transformedUser,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type,
    };
  } catch (error) {
    throw error;
  }
};
