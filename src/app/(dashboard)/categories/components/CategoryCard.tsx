/**
 * ============================================
 * CATEGORY CARD COMPONENT
 * ============================================
 * Single card untuk display category dengan:
 * - Color circle indicator
 * - Name dan description
 * - Usage count badge
 * - Edit & Delete actions di footer
 */

"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import hasAnyPermission from "@/lib/permissions";

interface CategoryCardProps {
  category: Category;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Card Body */}
      <div className="p-6 flex-1">
        <div className="flex items-start gap-4">
          {/* Warna Circle */}
          <div
            className="w-12 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.warna }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {category.nama}
            </h3>

            {category.deskripsi && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {category.deskripsi}
              </p>
            )}

            {/* Usage Badge */}
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Digunakan {category.count || 0}x
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer dengan Actions */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 rounded-b-lg flex items-center justify-end gap-2">
        {hasAnyPermission(["categories.create"]) && (
          <Link href={`/categories/edit/${category.slug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>
        )}
        {hasAnyPermission(["categories.delete"]) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
        )}
      </div>
    </div>
  );
}
