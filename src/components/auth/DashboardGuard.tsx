"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { authUtils } from "@/hooks/useAuth";

interface DashboardGuardProps {
  children: React.ReactNode;
}

/**
 * DashboardGuard - Protect dashboard routes
 * - Checks if user is authenticated
 * - Verifies user is_active status from backend
 * - Periodically rechecks status every 30 seconds
 * - Auto logout and redirect if inactive
 */
export function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let statusCheckInterval: NodeJS.Timeout;

    /**
     * Check user status from backend
     * This ensures we have the most up-to-date status from the server
     */
    const checkUserStatus = async () => {
      try {
        const token = authUtils.getToken();

        // No token = not authenticated
        if (!token) {
          forceLogout("Sesi Anda telah berakhir. Silakan login kembali.");
          return;
        }

        // Call API to verify user status
        const response = await axiosInstance.get("/api/me");

        if (response.data?.success && response.data?.data) {
          const userData = response.data.data;

          // Check if user is inactive
          if (userData.is_active === false || userData.is_active === 0) {
            forceLogout("Akun Anda telah dinonaktifkan. Silakan hubungi superadmin.");
            return;
          }

          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(userData));

          // Mark as verified and show content
          if (!isVerified) {
            setIsVerified(true);
            setIsLoading(false);
          }
        } else {
          // Invalid response
          forceLogout("Terjadi kesalahan saat memverifikasi akun.");
        }
      } catch (error: any) {
        // If 401 or 403, token is invalid or user is unauthorized
        if (error.response?.status === 401 || error.response?.status === 403) {
          forceLogout("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          // For other errors, only show loading state on initial check
          if (!isVerified) {
            console.error("Status check failed:", error);
            // Still allow access but log the error
            setIsVerified(true);
            setIsLoading(false);
          }
        }
      }
    };

    /**
     * Force logout and redirect to login
     */
    const forceLogout = (message: string) => {
      // Clear all auth data
      authUtils.logout();

      // Clear interval to prevent repeated calls
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }

      // Show toast message
      toast.error(message);

      // Redirect to login
      router.push("/auth/login");
    };

    // Initial check
    checkUserStatus();

    // Set up periodic status check every 30 seconds
    statusCheckInterval = setInterval(checkUserStatus, 30000);

    // Cleanup interval on unmount
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [router, isVerified]);

  // Show loading while checking status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi status akun...</p>
        </div>
      </div>
    );
  }

  // Show children once verified
  return <>{children}</>;
}
