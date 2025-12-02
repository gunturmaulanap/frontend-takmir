"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authUtils } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard untuk login/register pages
 * Redirect ke dashboard jika user sudah login
 */
export function AuthGuard({
  children,
  redirectTo = "/dashboard"
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check user authentication status
        const authenticated = authUtils.isAuthenticated();
        setIsAuthenticated(authenticated);

        // If user is authenticated and trying to access auth pages (except for logout), redirect to dashboard
        if (authenticated && pathname && pathname.startsWith('/auth') && !pathname.includes('/logout')) {
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If authenticated and on auth pages, don't render children (redirect will happen)
  if (isAuthenticated && pathname?.startsWith('/auth')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Show children for non-authenticated users or non-auth pages
  return <>{children}</>;
}