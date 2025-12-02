/**
 * ============================================
 * SHARED FEATURE NAVBAR
 * ============================================
 * Navbar yang sama untuk semua feature layouts
 * Reusable component untuk konsistensi
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { GiHamburgerMenu, GiHealingShield } from "react-icons/gi";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useLogoutMutation } from "@/hooks/useAuth";
import { hasAnyPermission } from "@/lib/permissions";
import { MosqueIcon } from "@/components/icons/MosqueIcon";
import { GrSchedule } from "react-icons/gr";
import { TbCategory } from "react-icons/tb";

// Mobile Sidebar Menu Items Component
interface NavbarSidebarItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  items?: NavbarSidebarItem[];
}

function SidebarMenuItems({
  featureName,
  onClose,
}: {
  featureName: string;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getSidebarItems = (): NavbarSidebarItem[] => {
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
        default:
          return "/dashboard";
      }
    };

    const baseItems: NavbarSidebarItem[] = [
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
        const eventItems: NavbarSidebarItem[] = [...baseItems];

        // Add Beranda Event if user can index events
        {
          hasAnyPermission(["events.index"]) &&
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
                  ></path>
                </svg>
              ),
            });
        }

        // Add Buat Event if user can create events
        {
          hasAnyPermission(["events.create"]) &&
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
                  ></path>
                </svg>
              ),
              badge: "New",
            });
        }

        return eventItems;

      case "Jamaah Management":
        const jamaahItems: NavbarSidebarItem[] = [...baseItems];

        // Add Beranda Jamaah if user can index jamaahs
        if (hasAnyPermission(["jamaahs.index"])) {
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
                ></path>
              </svg>
            ),
          });
        }

        // Add Tambah Jamaah if user can create jamaahs
        if (hasAnyPermission(["jamaahs.create"])) {
          jamaahItems.push({
            title: "Tambah Jamaah",
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
                ></path>
              </svg>
            ),
            badge: "New",
          });
        }

        return jamaahItems;

      case "Takmir Management":
        const takmirItems: NavbarSidebarItem[] = [...baseItems];

        // Add Beranda Takmir if user can index takmirs
        if (hasAnyPermission(["takmirs.index"])) {
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
                ></path>
              </svg>
            ),
          });
        }

        // Add Tambah Takmir if user can create takmirs
        if (hasAnyPermission(["takmirs.create"])) {
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
                ></path>
              </svg>
            ),
            badge: "New",
          });
        }

        return takmirItems;

      case "Category Management":
        const categoryItems: NavbarSidebarItem[] = [...baseItems];

        // Add Beranda Kategori if user can index categories
        if (hasAnyPermission(["categories.index"])) {
          categoryItems.push({
            title: "Daftar Kategori",
            href: "/categories/main",
            icon: <TbCategory />,
          });
        }

        // Add Buat Kategori if user can create categories
        if (hasAnyPermission(["categories.create"])) {
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
                ></path>
              </svg>
            ),
            badge: "New",
          });
        }

        return categoryItems;

      case "Staff Management":
        const staffItems: NavbarSidebarItem[] = [
          ...baseItems,
          {
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
          },
          {
            title: "Khatibs",
            icon: <GiHealingShield />,
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
          },
          {
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
                title: "Buat Muadzinn",
                href: "/staffs/muadzins/create",
              },
            ],
          },
        ];

        return staffItems;

      case "Jadwal Petugas Management":
        const scheduleItems: NavbarSidebarItem[] = [
          ...baseItems,
          {
            title: "Jadwal Petugas",
            icon: <GrSchedule />,
            href: "/staff-schedules/main",
          },
          {
            title: "Buat Jadwal Petugas",
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
                ></path>
              </svg>
            ),
            href: "/staff-schedules/create",
          },
        ];

        return scheduleItems;

      default:
        return baseItems;
    }
  };

  const sidebarItems = getSidebarItems();

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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
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
    if (href.startsWith("/staffs/")) return pathname.startsWith(href);
    if (href === "/categories")
      return pathname === "/categories" || pathname === "/categories/";
    if (href === "/categories/main") return pathname === "/categories/main";
    if (href === "/categories/create")
      return pathname.startsWith("/categories/create");
    if (href === "/staff-schedules")
      return (
        pathname === "/staff-schedules" || pathname === "/staff-schedules/"
      );
    return pathname.startsWith(href);
  };

  const renderSidebarItem = (item: NavbarSidebarItem, level: number = 0) => {
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
              "w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
              "hover:bg-gray-100 hover:text-gray-900",
              hasActiveChild
                ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
                : isExpanded
                ? "bg-gray-50 text-gray-700 border-l-4 border-emerald-500"
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
          onClick={onClose}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
            isActive(item.href)
              ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </div>
      </div>
    </div>
  );
}

export function FeatureNavbar() {
  const { user } = useAuth();
  const { mutate: logoutMutation, isPending: isLoggingOut } =
    useLogoutMutation();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get current feature name based on pathname
  const getCurrentFeatureName = () => {
    if (pathname === "/dashboard" || pathname === "/dashboard/") return null; // Dashboard tidak punya sidebar
    if (pathname.startsWith("/events")) return "Event Management";
    if (pathname.startsWith("/jamaahs")) return "Jamaah Management";
    if (pathname.startsWith("/takmirs")) return "Takmir Management";
    if (pathname.startsWith("/staffs")) return "Staff Management";
    if (pathname.startsWith("/categories")) return "Category Management";
    if (pathname.startsWith("/staff-schedules"))
      return "Jadwal Petugas Management";
    return null; // Return null untuk tidak menampilkan sidebar
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * ============================================
   * HANDLER: Logout
   * ============================================
   */
  const handleLogout = () => {
    logoutMutation(); // This will handle API call, localStorage clear, and redirect
  };

  /**
   * ============================================
   * EFFECT: Close dropdown on outside click
   * ============================================
   */
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen, mounted]);

  const userRole = user?.role || "Admin";

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Mobile Logic */}
            {pathname === "/dashboard" || pathname === "/calenders" ? (
              /* Mobile: Logo & Brand on Dashboard */
              <div className="xl:hidden">
                <Link href="/dashboard" className="flex items-center space-x-3">
                  <MosqueIcon
                    width={40}
                    height={40}
                    className="text-emerald-600"
                  />
                  <span className="text-xl font-semibold text-gray-800">
                    Mosque Manager
                  </span>
                </Link>
              </div>
            ) : (
              /* Mobile: Hamburger Menu on Other Pages */
              <>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="xl:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <GiHamburgerMenu className="h-6 w-6" />
                </button>
                <div className="xl:hidden w-10"></div>
              </>
            )}

            {/* Desktop: Logo & Brand */}
            <div className="hidden xl:flex">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <MosqueIcon
                  width={40}
                  height={40}
                  className="text-emerald-600"
                />
                <span className="text-xl font-semibold text-gray-800">
                  Mosque Manager
                </span>
              </Link>
            </div>

            {/* Right: User Info & Profile */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.name || userRole}
              </span>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <FaUser className="h-5 w-5" />
                  <span className="hidden sm:block">Profile</span>
                </button>

                {/* Dropdown Menu */}
                {mounted && isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        type="button"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUser className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay - Not on Dashboard */}
      {mounted && isMobileMenuOpen && pathname !== "/dashboard" && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 xl:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 xl:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <GiHamburgerMenu className="h-4 w-4 text-black" />
                </div>
                <span className="text-lg font-bold text-gray-900">Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto flex flex-col">
              <div className="flex-1 p-4">
                {getCurrentFeatureName() && (
                  <SidebarMenuItems
                    featureName={getCurrentFeatureName()!}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                )}
              </div>

              {/* Footer */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
