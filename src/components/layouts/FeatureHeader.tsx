/**
 * ============================================
 * SHARED FEATURE HEADER
 * ============================================
 * Header dengan breadcrumb & mosque info
 * Reusable untuk semua feature pages
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMosque, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { IoMdHome } from "react-icons/io";

interface FeatureHeaderProps {
  /**
   * Icon untuk feature (misal: FaCalendarAlt untuk Events)
   */
  featureIcon: ReactNode;

  /**
   * Nama feature (misal: "Event Management")
   */
  featureName: string;

  /**
   * Base path feature (misal: "/events")
   */
  basePath: string;

  /**
   * Warna badge feature (misal: "purple" untuk Events)
   */
  badgeColor?: "purple" | "blue" | "green" | "orange" | "red" | "cyan";

  /**
   * Custom breadcrumb generator (optional)
   */
  getBreadcrumb?: (pathname: string) => string;
}

export function FeatureHeader({
  featureIcon,
  featureName,
  basePath,
  badgeColor = "purple",
  getBreadcrumb,
}: FeatureHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  /**
   * ============================================
   * DEFAULT BREADCRUMB GENERATOR
   * ============================================
   */
  const defaultGetBreadcrumb = (path: string) => {
    if (path === basePath) return `Daftar ${featureName}`;
    if (path === `${basePath}/create`) return `Buat ${featureName}`;
    if (path === `${basePath}/main`) return `List ${featureName}`;
    if (path?.includes(`${basePath}/edit`)) return `Edit ${featureName}`;
    if (path?.includes(basePath)) return `Detail ${featureName}`;
    return featureName;
  };

  const breadcrumb = getBreadcrumb
    ? getBreadcrumb(pathname)
    : defaultGetBreadcrumb(pathname);

  /**
   * ============================================
   * BADGE COLOR VARIANTS
   * ============================================
   */
  const badgeColors = {
    purple: "bg-purple-50 text-purple-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
    cyan: "bg-cyan-50 text-cyan-700",
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-3">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <IoMdHome />
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={basePath}
            className="text-gray-500 hover:text-emerald-600 transition-colors"
          >
            {featureName}
          </Link>
          {pathname !== basePath && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{breadcrumb}</span>
            </>
          )}
        </div>

        {/* Mosque Info */}
      </div>
    </div>
  );
}
