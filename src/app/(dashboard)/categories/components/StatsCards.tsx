/**
 * ============================================
 * STATS CARDS COMPONENT
 * ============================================
 * Menampilkan 2 statistik cards:
 * - Total Categories
 * - Total Usage
 */

"use client";

import { Category } from "@/types/category";
import { FaFolderOpen, FaTags } from "react-icons/fa";

interface StatsCardsProps {
  categories: Category[];
}

export function StatsCards({ categories }: StatsCardsProps) {
  // Calculate stats
  const totalCategories = categories.length;
  const totalUsage = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

  const stats = [
    {
      label: "Total Kategori",
      value: totalCategories,
      bgColor: "bg-white",
      textColor: "text-blue-600",
      icon: FaFolderOpen,
      iconColor: "text-blue-600",
      bgIconColor: "bg-blue-100",
    },
    {
      label: "Total Penggunaan",
      value: totalUsage,
      bgColor: "bg-white",
      textColor: "text-purple-600",
      icon: FaTags,
      iconColor: "text-purple-600",
      bgIconColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg px-6 py-4 border border-gray-200`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgIconColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
