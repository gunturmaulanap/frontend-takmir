/**
 * ============================================
 * SHARED FEATURE FOOTER
 * ============================================
 * Footer yang sama untuk semua feature layouts
 * Sticky di bottom dengan links & copyright
 */

"use client";

import Link from "next/link";
import { FaMosque } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

interface FeatureFooterProps {
  /**
   * Additional links untuk footer (optional)
   */
  additionalLinks?: Array<{
    label: string;
    href: string;
  }>;
}

export function FeatureFooter({ additionalLinks }: FeatureFooterProps) {
  const { user } = useAuth();
  const mosqueName = user?.profile_masjid?.nama || "Masjid Sabilil Huda";

  // Default links
  const defaultLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events", href: "/events" },
    { label: "Jamaah", href: "/jamaahs" },
    { label: "Keuangan", href: "/finances" },
  ];

  const links = additionalLinks || defaultLinks;

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaMosque className="h-4 w-4 text-emerald-600" />
            <span>© 2025 {mosqueName}. All rights reserved.</span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center space-x-6 text-sm">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Version */}
          <div className="text-sm text-gray-500">
            Multi Masjid Management System v1.0
          </div>
        </div>
      </div>
    </footer>
  );
}
