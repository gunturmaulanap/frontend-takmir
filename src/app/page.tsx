/**
 * ============================================
 * ROOT PAGE - CLEAN VERSION
 * ============================================
 * Redirect logic berdasarkan auth state dari AuthContext
 * Loading state sudah ada di Providers (AuthProvider)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? "/dashboard" : "/home");
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading spinner sementara checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return null;
}