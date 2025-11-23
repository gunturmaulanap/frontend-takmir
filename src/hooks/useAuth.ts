import React from "react";
import {
  loginApi,
  LoginRequest,
  LoginResponse,
} from "@/app/auth/login/api/loginApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tokenRefreshService } from "@/lib/tokenRefresh";

// Simple auth helpers using localStorage directly
export const authUtils = {
  // Get current user from localStorage
  getUser: () => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Get access token from localStorage
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  },

  // Set new tokens after refresh
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  },

  // Set user data
  setUser: (userData: any) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(userData));
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authUtils.getToken() && !!authUtils.getUser();
  },

  // Clear auth data
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("login_time");
  },
};

// Hook for checking authentication status
export const useAuth = () => {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // Check auth on mount
    const checkAuth = () => {
      try {
        const userData = authUtils.getUser();
        const token = authUtils.getToken();

        if (userData && token) {
          setUser(userData);
        }
      } catch (error) {
        authUtils.logout();
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: authUtils.isAuthenticated(),
    login: (userData: any, token: string) => {
      setUser(userData);
    },
    logout: () => {
      authUtils.logout();
      setUser(null);
      router.push("/auth/login");
    },
  };
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      tokenRefreshService.logout();
    },
  });
};

export const useLoginMutation = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest): Promise<LoginResponse> => loginApi(data),
    onSuccess: (data) => {
      if (data.success && data.access_token) {
        login(data.user, data.access_token);
        toast.success("Login Successfully!");
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data || { message: "Login failed" };
      toast.error(
        errorData.message || "Login failed. Please check your credentials."
      );
    },
  });
};
