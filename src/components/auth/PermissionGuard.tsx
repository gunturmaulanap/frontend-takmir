"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { hasAnyPermission, hasRole, hasAnyRole } from "@/lib/permissions";
import { authUtils } from "@/hooks/useAuth";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  role,
  roles = [],
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  ),
  redirectTo,
}: PermissionGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated first
    const authenticated = authUtils.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      // Redirect to login if not authenticated
      router.push("/auth/login");
      toast.error("Please login to access this page.");
      return;
    }

    // If authenticated, check permissions
    let authorized = false;

    // Check role-based access
    if (role && hasRole(role)) {
      authorized = true;
    } else if (roles.length > 0 && hasAnyRole(roles)) {
      authorized = true;
    }

    // Check permission-based access
    if (!authorized) {
      if (permission) {
        // Check single permission
        authorized = hasAnyPermission([permission]);
      } else if (permissions.length > 0) {
        // Check if user has any of the required permissions
        authorized = hasAnyPermission(permissions);
      }
    }

    setIsAuthorized(authorized);

    // If authenticated but not authorized and redirectTo is provided, redirect
    if (!authorized && redirectTo) {
      toast.error("You don't have permission to access this page.");
      router.push(redirectTo);
    }
  }, [permission, permissions, role, roles, redirectTo, router]);

  // Show loading state while checking authentication and permissions
  if (isAuthenticated === null || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If not authenticated (shouldn't happen due to redirect, but as a safety), show fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Show fallback if authenticated but not authorized
  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  // Show children if both authenticated and authorized
  return <>{children}</>;
}
