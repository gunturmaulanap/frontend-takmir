"use client";

import { usePathname } from "next/navigation";
import { SidebarLayout } from "./SidebarLayout";
import { FeatureSidebar } from "@/components/ui/feature-sidebar";
import { FeatureNavbar } from "./FeatureNavbar";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";
import { BiCategory } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { RiGroupLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";
import { FaCalendarCheck, FaChartLine, FaUserGraduate } from "react-icons/fa";

interface DynamicSidebarLayoutProps {
  children: React.ReactNode;
  featureName?: string;
  featureIcon?: React.ReactNode;
  basePath?: string;
  showBreadcrumb?: boolean;
  permissions?: string[];
}

// Feature configuration
const featureConfigs = {
  categories: {
    name: "Category Management",
    icon: <BiCategory className="h-3 w-3" />,
    basePath: "/categories",
    permissions: ["categories.index"],
  },
  events: {
    name: "Event Management",
    icon: <FaCalendarAlt className="h-3 w-3" />,
    basePath: "/events",
    permissions: ["events.index"],
  },
  jamaahs: {
    name: "Jamaah Management",
    icon: <RiGroupLine className="h-3 w-3" />,
    basePath: "/jamaahs",
    permissions: ["jamaahs.index"],
  },
  takmirs: {
    name: "Takmir Management",
    icon: <LuUserCog className="h-3 w-3" />,
    basePath: "/takmirs",
    permissions: ["takmirs.index"],
  },
  staff_schedule: {
    name: "Jadwal Petugas Management",
    icon: <FaCalendarCheck className="h-3 w-3" />,
    basePath: "/staff-schedules",
    permissions: ["jadwal-petugas.index"],
  },
  staffs: {
    name: "Staff Management",
    icon: <FaUserGraduate className="h-3 w-3" />,
    basePath: "/staffs",
    permissions: ["staffs.index"],
  },
  asatidz: {
    name: "Asatidz Management",
    icon: <FaUserGraduate className="h-3 w-3" />,
    basePath: "/asatidzs",
    permissions: ["asatidzs.index"],
  },
  reports: {
    name: "Report Management",
    icon: <FaChartLine className="h-3 w-3" />,
    basePath: "/reports",
    permissions: ["transaksi-keuangan.index"],
  },
  asatidzs: {
    name: "Asatidz Management",
    icon: <FaUserGraduate className="h-3 w-3" />,
    basePath: "/asatidzs",
    permissions: ["asatidzs.index"],
  },
  dashboard: {
    name: "Dashboard",
    icon: <FaChartLine className="h-3 w-3" />,
    basePath: "/dashboard",
    permissions: ["dashboards.index"],
  },
  profilemasjid: {
    name: "Masjid Management",
    icon: <FaChartLine className="h-3 w-3" />,
    basePath: "/profile-masjids",
    permissions: ["profile-masjid.index"],
  },
  adminmasjid: {
    name: "Admin Management",
    icon: <FaChartLine className="h-3 w-3" />,
    basePath: "/admin-masjids",
    permissions: ["admins.index"],
  },
};

// Get current feature based on pathname
function getCurrentFeature(pathname: string) {
  // Remove trailing slash and find matching feature
  const cleanPath = pathname.replace(/\/$/, "");

  // Direct match
  if (featureConfigs[cleanPath as keyof typeof featureConfigs]) {
    return featureConfigs[cleanPath as keyof typeof featureConfigs];
  }

  // Check for nested routes - check in order of specificity (longest first)
  const sortedConfigs = Object.entries(featureConfigs).sort(
    (a, b) => b[1].basePath.length - a[1].basePath.length
  );

  for (const [key, config] of sortedConfigs) {
    if (
      cleanPath.startsWith(config.basePath + "/") ||
      cleanPath === config.basePath
    ) {
      return config;
    }
  }

  // Default to dashboard
  return featureConfigs.dashboard;
}

export default function DynamicSidebarLayout({
  children,
  featureName,
  featureIcon,
  basePath,
  showBreadcrumb = true,
  permissions = ["dashboards.index"],
}: DynamicSidebarLayoutProps) {
  const pathname = usePathname();
  const currentFeature = getCurrentFeature(pathname);

  // Dashboard route - DENGAN FeatureNavbar tapi TANPA sidebar
  if (
    pathname === "/dashboard" ||
    pathname === "/calenders" ||
    pathname === "/masjid-managements" ||
    pathname.startsWith("/admin-masjids")
  ) {
    return (
      <PermissionGuard
        permissions={currentFeature.permissions}
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto mt-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access Dashboard.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Contact your administrator for access.
              </p>
              <Link
                href="/"
                className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        }
      >
        {/* Dashboard dengan FeatureNavbar tapi TANPA sidebar */}
        <div className="min-h-screen bg-gray-50">
          <FeatureNavbar />
          <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </div>
      </PermissionGuard>
    );
  }

  // Other routes - DENGAN sidebar
  return (
    <PermissionGuard
      permissions={currentFeature.permissions}
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access {currentFeature.name}.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Contact your administrator for access.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      }
    >
      <SidebarLayout
        featureIcon={currentFeature.icon}
        featureName={currentFeature.name}
        basePath={currentFeature.basePath}
        showBreadcrumb={showBreadcrumb}
      >
        {/* Desktop Layout - Sidebar di dalam children */}
        <div className="hidden md:flex">
          <FeatureSidebar featureName={currentFeature.name} />
          <div className="min-h-screen flex-1 px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>

        {/* Mobile Layout - Tanpa sidebar, langsung content */}
        <div className="md:hidden px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
          {children}
        </div>
      </SidebarLayout>
    </PermissionGuard>
  );
}
