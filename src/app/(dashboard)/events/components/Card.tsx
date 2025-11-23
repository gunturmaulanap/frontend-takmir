"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCalendarAlt, FaPlus, FaTag } from "react-icons/fa";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

// Components & Hooks
import { EventItemCard } from "./EventItemCard";
import { useDeleteEvent, useEvents } from "@/hooks/useEvents";
import { EventsGridSkeleton } from "./EventSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { hasAnyPermission } from "@/lib/permissions";

// UI Components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function EventCard() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ Menggunakan hook yang sudah diupdate dengan placeholderData
  const {
    data: paginatedEvents,
    isLoading, // True hanya saat load pertama kali
    isFetching, // True setiap kali ambil data (background)
    error,
    isError,
    refetch,
  } = useEvents(currentPage, itemsPerPage);

  const events = paginatedEvents?.data || [];
  const paginationMeta = paginatedEvents?.meta;

  const getStatsByCategory = () => {
    if (!Array.isArray(events) || events.length === 0) return {};

    return events.reduce((acc, event) => {
      const categoryName = event.category?.nama || "Lainnya";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const stats = getStatsByCategory();
  const deleteEventMutation = useDeleteEvent();

  // --- Handlers ---
  const handleDelete = (id: number) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    toast.loading("Menghapus event...", { id: "delete-event" });

    deleteEventMutation.mutate(eventToDelete, {
      onSuccess: () => {
        toast.success("Event berhasil dihapus!", { id: "delete-event" });
        setDeleteDialogOpen(false);
        setEventToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus event", { id: "delete-event" });
        console.error("Delete error:", error);
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Opsional: Scroll ke atas grid jika perlu
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Pagination Logic Generator ---
  const generatePagination = () => {
    if (!paginationMeta) return [];
    const totalPages = paginationMeta.last_page;
    const current = currentPage;
    const delta = 1; // Jumlah halaman di kiri/kanan halaman aktif

    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    if (totalPages > 1) range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <>
      <div className="space-y-6">
        {/* 1. Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                  Manajemen Event
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola semua event masjid Anda
                </p>
              </div>
            </div>
            {hasAnyPermission(["events.create"]) && (
              <Link
                href="/events/create"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200"
              >
                <FaPlus className="h-4 w-4" />
                <span>Tambah Event</span>
              </Link>
            )}
          </div>
        </div>

        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {/* Total Event Card */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Event
                  </p>
                  {/* ✅ FIX: Gunakan total dari meta data, bukan length array */}
                  <p className="text-2xl font-bold text-gray-900">
                    {paginationMeta?.total ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Category Cards */}
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-10"></div>
                    </div>
                  </div>
                </div>
              ))
            : Object.entries(stats).map(([categoryName, count], index) => {
                const colors = [
                  { bg: "bg-green-100", text: "text-green-600" },
                  { bg: "bg-purple-100", text: "text-purple-600" },
                  { bg: "bg-orange-100", text: "text-orange-600" },
                  { bg: "bg-indigo-100", text: "text-indigo-600" },
                  { bg: "bg-pink-100", text: "text-pink-600" },
                ];
                const color = colors[index % colors.length];

                return (
                  <div
                    key={categoryName}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 ${color.bg} rounded-lg`}>
                        <FaTag className={`h-5 w-5 ${color.text}`} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">
                          {categoryName}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {count}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* 3. Events Grid Content */}
        {isLoading ? (
          <EventsGridSkeleton />
        ) : isError ? (
          <ErrorState
            message={error?.message || "Gagal memuat data events"}
            onRetry={refetch}
          />
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <FaCalendarAlt className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Event
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Mulai buat event pertama Anda untuk mengelola kegiatan masjid.
              </p>
              {hasAnyPermission(["events.create"]) && (
                <Link
                  href="/events/create"
                  className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Buat Event</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* ✅ UX Improvement: 
               Menggunakan transition-opacity untuk memberi feedback visual saat fetching di background 
               tanpa menghilangkan konten (No Flicker).
            */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 transition-opacity duration-300 ${
                isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
              }`}
            >
              {events.map((event) => (
                <EventItemCard
                  key={event.id}
                  event={event}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* 4. Pagination Control */}
            {paginationMeta && paginationMeta.last_page > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                <div className="text-sm text-gray-500">
                  Menampilkan {paginationMeta.from} - {paginationMeta.to} dari{" "}
                  {paginationMeta.total} event
                </div>

                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        size="default"
                      />
                    </PaginationItem>

                    {/* Page Numbers Logic */}
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

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < paginationMeta.last_page) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === paginationMeta.last_page
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        size="default"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Event?"
        description="Event yang dihapus tidak dapat dikembalikan. Semua data terkait event ini akan dihapus."
        isLoading={deleteEventMutation.isPending}
      />
    </>
  );
}
