/**
 * ============================================
 * CATEGORIES LIST PAGE
 * ============================================
 * Main page untuk display all categories dengan:
 * - Stats cards (Total, Active, Total Usage)
 * - Grid layout kategori dengan color circles
 * - Edit & Delete actions
 * - Tanstack Query untuk data management
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Loader2, Folder, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useEvents } from "@/hooks/useEvents";
import { CategoryCard } from "@/app/(dashboard)/categories/components/CategoryCard";
import { StatsCards } from "@/app/(dashboard)/categories/components/StatsCards";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { Category } from "@/types/category";
import { FaPlus } from "react-icons/fa";
import { hasAnyPermission } from "@/lib/permissions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CategoriesPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch categories dengan Tanstack Query
  const {
    data: paginatedCategoriesData,
    isLoading,
    isError,
    error,
  } = useCategories(currentPage, itemsPerPage);

  // Extract paginated data
  const paginatedCategories = paginatedCategoriesData?.data || [];
  const paginationMeta = paginatedCategoriesData?.meta;

  // Fetch events untuk hitung usage count
  const { data: paginatedEventsData, isLoading: isLoadingEvents } = useEvents();

  // Extract events dari paginated response
  const events = paginatedEventsData?.data || [];

  // Use paginated categories
  const categories = paginatedCategories;

  // Hitung usage count untuk setiap category dari events
  const categoriesWithCount = useMemo<Category[]>(() => {
    if (isLoadingEvents || events.length === 0) {
      return categories; // Return categories tanpa count jika events masih loading
    }

    // Hitung berapa kali setiap category digunakan
    const usageCount: Record<number, number> = {};
    events.forEach((event) => {
      const categoryId = event.category_id;
      if (categoryId) {
        usageCount[categoryId] = (usageCount[categoryId] || 0) + 1;
      }
    });

    // Merge count ke categories
    return categories.map((category) => ({
      ...category,
      count: usageCount[category.id] || 0,
    }));
  }, [categories, events, isLoadingEvents]);

  // Delete mutation
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  /**
   * Handle Delete Category - Open Dialog
   */
  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm Delete Category
   */
  const confirmDelete = () => {
    if (!categoryToDelete) return;

    toast.loading("Menghapus kategori...", { id: "delete-category" });

    deleteCategory(categoryToDelete, {
      onSuccess: () => {
        toast.success("Kategori berhasil dihapus!", { id: "delete-category" });
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal menghapus kategori";
        toast.error(`Gagal menghapus: ${errorMessage}`, {
          id: "delete-category",
        });
        console.error("Delete error:", error);
      },
    });
  };

  const generatePagination = () => {
    if (!paginationMeta) return [];
    const totalPages = paginationMeta.last_page;
    const current = currentPage;
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i < totalPages && i > 1) range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isError) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Grid3x3 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Empty State - Only show if NOT loading and array is truly empty
   */
  if (!isLoading && categoriesWithCount.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <Folder className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Belum Ada Kategori
          </h3>
          <p className="text-gray-500 mb-6">
            Buat kategori pertama untuk mengorganisir acara dan kegiatan masjid
            dengan lebih baik.
          </p>
          {hasAnyPermission(["categories.create", "categories.store"]) && (
            <Link href="/categories/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700 px-6 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kategori
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  /**
   * Main Content
   */
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Folder className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                Kategori
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola kategori untuk acara dan kegiatan masjid
              </p>
            </div>
          </div>
          {hasAnyPermission(["categories.create", "categories.store"]) && (
            <Link href="/categories/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200 cursor-pointer">
                <FaPlus className="h-4 w-4" /> Tambah Kategori
              </Button>
            </Link>
          )}
        </div>
      </div>

      <StatsCards categories={categoriesWithCount} />

      {/* Categories Grid Card */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesWithCount.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {paginationMeta && paginationMeta.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          <div className="text-sm text-gray-500">
            Showing {paginationMeta.from} to {paginationMeta.to} of{" "}
            {paginationMeta.total} takmirs
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  size="default"
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* ✅ PERBAIKAN: Menggunakan generatePagination() yang sudah dibuat */}
              {generatePagination().map((page, index) => {
                if (page === "...") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Number(page));
                      }}
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < paginationMeta.last_page) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  size="default"
                  className={
                    currentPage === paginationMeta.last_page
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Kategori?"
        description="Kategori yang dihapus tidak dapat dikembalikan. Pastikan tidak ada event yang menggunakan kategori ini."
        isLoading={isDeleting}
      />
    </div>
  );
}
