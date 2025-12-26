"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hasAnyPermission } from "@/lib/permissions";
import { GrSchedule } from "react-icons/gr";
import { TbCategory } from "react-icons/tb";

interface SidebarItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  items?: SidebarItem[];
}

interface FeatureSidebarProps {
  featureName: string;
  className?: string;
}

const getFeatureSidebarItems = (featureName: string): SidebarItem[] => {
  // Dynamic base items based on feature
  const getBaseHref = (feature: string) => {
    switch (feature) {
      case "Event Management":
        return "/events";
      case "Jamaah Management":
        return "/jamaahs";
      case "Takmir Management":
        return "/takmirs";
      case "Staff Management":
        return "/staffs";
      case "Category Management":
        return "/categories";
      case "Jadwal Petugas Management":
        return "/staff-schedules";
      case "Report Management":
        return "/reports";
      case "Asatidz Management":
        return "/asatidzs";
      default:
        return "/dashboard";
    }
  };

  const baseItems: SidebarItem[] = [
    {
      title: "Beranda",
      href: getBaseHref(featureName),
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      ),
    },
  ];

  switch (featureName) {
    case "Event Management":
      const eventItems = [...baseItems];

      // Add Daftar Event if user can index events
      if (hasAnyPermission(["events.index", "events.view"])) {
        eventItems.push({
          title: "Daftar Event",
          href: "/events/main",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        });
      }

      // Add Buat Event if user can create events
      if (hasAnyPermission(["events.create", "events.store"])) {
        eventItems.push({
          title: "Buat Event",
          href: "/events/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return eventItems;

    case "Jadwal Petugas Management":
      const scheduleItems = [...baseItems];

      // Add Daftar Jamaah if user can index jamaahs
      if (hasAnyPermission(["jadwal-petugas.index"])) {
        scheduleItems.push({
          title: "Jadwal Petugas",
          href: "/staff-schedules/main",
          icon: <GrSchedule />,
        });
      }

      // Add Tambah Jamaah if user can create staff-schedules
      if (hasAnyPermission(["jadwal-petugas.create"])) {
        scheduleItems.push({
          title: "Buat Jadwal Petugas",
          href: "/staff-schedules/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return scheduleItems;

    case "Jamaah Management":
      const jamaahItems = [...baseItems];

      // Add Daftar Jamaah if user can index jamaahs
      if (hasAnyPermission(["jamaahs.index", "jamaahs.view"])) {
        jamaahItems.push({
          title: "Daftar Jamaah",
          href: "/jamaahs/main",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        });
      }

      // Add Tambah Jamaah if user can create jamaahs
      if (hasAnyPermission(["jamaahs.create", "jamaahs.store"])) {
        jamaahItems.push({
          title: "Buat Jamaah",
          href: "/jamaahs/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return jamaahItems;

    case "Asatidz Management":
      const asatidzItems = [...baseItems];

      // Add Daftar Jamaah if user can index jamaahs
      if (hasAnyPermission(["asatidzs.index", "asatidzs.view"])) {
        asatidzItems.push({
          title: "Daftar Asatidz",
          href: "/asatidzs/main",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        });
      }

      // Add Tambah Jamaah if user can create asatidzs
      if (hasAnyPermission(["asatidzs.create", "asatidzs.store"])) {
        asatidzItems.push({
          title: "Buat Asatidz",
          href: "/asatidzs/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return asatidzItems;

    case "Takmir Management":
      const takmirItems = [...baseItems];

      // Add Daftar Takmir if user can index takmirs
      if (hasAnyPermission(["takmirs.index", "takmirs.view"])) {
        takmirItems.push({
          title: "Daftar Takmir",
          href: "/takmirs/main",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        });
      }

      // Add Tambah Takmir if user can create takmirs
      if (hasAnyPermission(["takmirs.create", "takmirs.store"])) {
        takmirItems.push({
          title: "Tambah Takmir",
          href: "/takmirs/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return takmirItems;

    case "Staff Management":
      const staffItems = [...baseItems];

      // Imams Section - Always visible
      staffItems.push({
        title: "Imams",
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        ),
        items: [
          {
            title: "Daftar Imam",
            href: "/staffs/imams",
          },
          {
            title: "Buat Imam",
            href: "/staffs/imams/create",
          },
        ],
      });

      // Khatibs Section - Always visible
      staffItems.push({
        title: "Khatibs",
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
        items: [
          {
            title: "Daftar Khatib",
            href: "/staffs/khatibs",
          },
          {
            title: "Buat Khatib",
            href: "/staffs/khatibs/create",
          },
        ],
      });

      // Muadzin Section - Always visible
      staffItems.push({
        title: "Muadzin",
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        ),
        items: [
          {
            title: "Daftar Muadzin",
            href: "/staffs/muadzins",
          },
          {
            title: "Buat Muadzin",
            href: "/staffs/muadzins/create",
          },
        ],
      });

      return staffItems;

    case "Category Management":
      const categoryItems = [...baseItems];

      // Add Daftar Kategori if user can index categories
      if (hasAnyPermission(["categories.index", "categories.view"])) {
        categoryItems.push({
          title: "Daftar Kategori",
          href: "/categories/main",
          icon: <TbCategory />,
        });
      }

      // Add Buat Kategori if user can create categories
      if (hasAnyPermission(["categories.create", "categories.store"])) {
        categoryItems.push({
          title: "Buat Kategori",
          href: "/categories/create",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
          badge: "New",
        });
      }

      return categoryItems;

    case "Report Management":
      const reportItems = [...baseItems];

      // Add Dashboard if user can view dashboard
      if (
        hasAnyPermission([
          "transaksi-keuangan.index",
          "transaksi-keuangan.view",
        ])
      ) {
        reportItems.push({
          title: "Dashboard Keuangan",
          href: "/reports/dashboard",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        });
      }

      // Add Daftar Transaksi if user can index transaksi-keuangan
      if (
        hasAnyPermission([
          "transaksi-keuangan.index",
          "transaksi-keuangan.view",
        ])
      ) {
        reportItems.push({
          title: "Daftar Transaksi",
          href: "/reports/main",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        });
      }

      return reportItems;

    default:
      return [];
  }
};

function SidebarContent({ featureName, className }: FeatureSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const sidebarItems = getFeatureSidebarItems(featureName);

  const isActive = (href: string) => {
    if (href === "/events")
      return pathname === "/events" || pathname === "/events/";
    if (href === "/events/main") return pathname === "/events/main";
    if (href === "/events/create") return pathname.startsWith("/events/create");
    if (href === "/jamaahs")
      return pathname === "/jamaahs" || pathname === "/jamaahs/";
    if (href === "/jamaahs/main") return pathname === "/jamaahs/main";
    if (href === "/jamaahs/create")
      return pathname.startsWith("/jamaahs/create");
    if (href === "/takmirs")
      return pathname === "/takmirs" || pathname === "/takmirs/";
    if (href === "/takmirs/main") return pathname === "/takmirs/main";
    if (href === "/takmirs/create")
      return pathname.startsWith("/takmirs/create");
    if (href === "/staffs")
      return pathname === "/staffs" || pathname === "/staffs/";
    if (href === "/staffs/imams")
      return pathname === "/staffs/imams" || pathname === "/staffs/imams/";
    if (href === "/staffs/imams/create")
      return pathname.startsWith("/staffs/imams/create");
    if (href === "/staffs/khatibs")
      return pathname === "/staffs/khatibs" || pathname === "/staffs/khatibs/";
    if (href === "/staffs/khatibs/create")
      return pathname.startsWith("/staffs/khatibs/create");
    if (href === "/staffs/muadzins")
      return (
        pathname === "/staffs/muadzins" || pathname === "/staffs/muadzins/"
      );
    if (href === "/staffs/muadzins/create")
      return pathname.startsWith("/staffs/muadzins/create");
    if (href === "/categories")
      return pathname === "/categories" || pathname === "/categories/";
    if (href === "/categories/main") return pathname === "/categories/main";
    if (href === "/categories/create")
      return pathname.startsWith("/categories/create");
    if (href === "/asatidzs")
      return pathname === "/asatidzs" || pathname === "/asatidzs/";
    if (href === "/asatidzs/main") return pathname === "/asatidzs/main";
    if (href === "/asatidzs/create")
      return pathname.startsWith("/asatidzs/create");
    if (href === "/staff-schedules")
      return (
        pathname === "/staff-schedules" || pathname === "/staff-schedules/"
      );
    if (href === "/staff-schedules/main")
      return pathname === "/staff-schedules/main";
    if (href === "/staff-schedules/create")
      return pathname.startsWith("/staff-schedules/create");
    if (href === "/reports")
      return pathname === "/reports" || pathname === "/reports/";
    if (href === "/reports/dashboard")
      return (
        pathname === "/reports/dashboard" || pathname === "/reports/dashboard/"
      );
    if (href === "/reports/main")
      return pathname === "/reports/main" || pathname === "/reports/main/";
    return pathname.startsWith(href);
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const hasItems = item.items && item.items.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const hasActiveChild = item.items?.some(
      (subItem) => subItem.href && isActive(subItem.href)
    );

    if (hasItems) {
      return (
        <div key={item.title} className="w-full">
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
              "hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1 hover:shadow-sm",
              hasActiveChild
                ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 shadow-sm"
                : isExpanded
                ? "bg-gray-50 text-gray-700 border-l-4 border-emerald-500 shadow-sm"
                : "text-gray-600"
            )}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {item.icon}
              <span className="truncate">{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded ? "rotate-180" : ""
              )}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 ml-4 space-y-1">
              {item.items?.map((subItem) =>
                renderSidebarItem(subItem, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    if (item.href) {
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
            "hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1 hover:shadow-sm",
            isActive(item.href)
              ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 shadow-sm"
              : "text-gray-600"
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {level > 0 && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
            {item.icon}
            <span className="truncate">{item.title}</span>
          </div>
          {item.badge && (
            <span className="ml-auto px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200",
        className
      )}
    >
      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </div>
      </ScrollArea>

      {/* Footer */}
    </div>
  );
}

export function FeatureSidebar({
  featureName,
  className,
}: FeatureSidebarProps) {
  return (
    <div
      className={cn(
        "hidden xl:block w-72 border-r border-gray-200 bg-white",
        className
      )}
    >
      <SidebarContent featureName={featureName} className={className} />
    </div>
  );
}
