"use client";
import {
  FaPlus,
  FaUserTie,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTakmirs, useUpdateTakmirStatus } from "@/hooks/useTakmirs";
import Link from "next/link";
import React, { useState } from "react";
import { LuUserCog } from "react-icons/lu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TakmirListPageProps {
  onDelete: (id: number, name?: string, event?: React.MouseEvent) => void;
}

// Function to get random color based on position string
const getPositionColor = (jabatan: string) => {
  // Available color combinations
  const colorOptions = [
    { bg: "bg-purple-100", text: "text-purple-800" },
    { bg: "bg-blue-100", text: "text-blue-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-red-100", text: "text-red-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
    { bg: "bg-orange-100", text: "text-orange-800" },
    { bg: "bg-teal-100", text: "text-teal-800" },
    { bg: "bg-cyan-100", text: "text-cyan-800" },
  ];

  // Generate consistent color based on jabatan string
  const hash =
    jabatan?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  const colorIndex = hash % colorOptions.length;
  const selectedColor = colorOptions[colorIndex];

  return `${selectedColor.bg} ${selectedColor.text}`;
  1;
};
// Function to get takmir name with fallbacks

export function TakmirListPage({ onDelete }: TakmirListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const {
    data: paginatedTakmirs,
    isLoading,
    isError,
    isFetching,
  } = useTakmirs(currentPage, itemsPerPage);
  const takmirs = paginatedTakmirs?.data || [];
  const paginationMeta = paginatedTakmirs?.meta;
  const updateTakmirStatus = useUpdateTakmirStatus();
  const [localStates, setLocalStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleToggleTakmirActive = async (
    takmirId: number,
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;

    // Optimistic update - update UI immediately
    setLocalStates((prev) => ({
      ...prev,
      [takmirId]: newStatus,
    }));

    try {
      await updateTakmirStatus.mutateAsync({
        id: takmirId,
        isActive: newStatus,
      });
    } catch (error) {
      // Revert jika gagal
      setLocalStates((prev) => ({ ...prev, [takmirId]: currentStatus }));
    }
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <LuUserCog className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                  Manajemen Takmir
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola semua data takmir masjid Anda
                </p>
              </div>
            </div>
            <Link
              href="/takmirs/create"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200"
            >
              <FaPlus className="h-4 w-4" />
              <span>Tambah Takmir</span>
            </Link>
          </div>
        </div>
        {/* Total Event Card */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaUserTie className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Takmir
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {takmirs.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaUserTie className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Aktif
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      takmirs.filter(
                        (t) => localStates[t.id] ?? t.user?.is_active ?? false
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  {/* Header with jabatan badge and toggle */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-7 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="h-7 bg-gray-200 rounded w-1/2 mt-8 mb-4"></div>

                  {/* Content Section */}
                  <div className="space-y-3">
                    {/* Phone */}
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                      <div className="h-4 w-45 bg-gray-200 rounded "></div>
                    </div>
                    {/* Age */}
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                      <div className="h-4  bg-gray-200 rounded w-45"></div>
                    </div>
                    {/* Description */}
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                    </div>
                  </div>
                </div>

                {/* Footer with actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              Terjadi kesalahan saat memuat data takmir
            </p>
          </div>
        ) : (
          <>
            {/* Takmir Cards */}
            {takmirs.length === 0 ? (
              <div className="text-center py-12">
                <FaUserTie className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada data takmir
                </h3>
                <p className="text-gray-500">
                  Tambahkan takmir pertama untuk memulai.
                </p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${
                  isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
                }`}
              >
                {takmirs.map((takmir) => (
                  <div
                    key={takmir.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(
                            takmir.jabatan
                          )}`}
                        >
                          {takmir.jabatan}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col">
                            <label className="inline-flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={
                                  localStates[takmir.id] ??
                                  takmir.user?.is_active ??
                                  false
                                }
                                onChange={() =>
                                  handleToggleTakmirActive(
                                    takmir.id,
                                    localStates[takmir.id] ??
                                      takmir.user?.is_active ??
                                      false
                                  )
                                }
                                disabled={updateTakmirStatus.isPending}
                              />
                              <div
                                className={`relative w-14 h-7 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 peer-hover:bg-gray-300 peer-checked:peer-hover:bg-green-500 ${
                                  updateTakmirStatus.isPending
                                    ? "opacity-75"
                                    : ""
                                }`}
                              >
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  {updateTakmirStatus.isPending ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <span className="text-xs text-gray-400 peer-checked:text-white transition-colors duration-200">
                                      {localStates[takmir.id] ??
                                      takmir.user?.is_active
                                        ? "✓"
                                        : "✕"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </label>
                            <span
                              className={`text-xs font-medium mt-1 px-2 py-1 rounded-full inline-flex items-center space-x-1 ${
                                localStates[takmir.id] ?? takmir.user?.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  localStates[takmir.id] ??
                                  takmir.user?.is_active
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span>
                                {localStates[takmir.id] ??
                                takmir.user?.is_active
                                  ? "Aktif"
                                  : "Nonaktif"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {takmir.nama}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="h-4 w-4 mr-3 text-gray-400" />
                          {takmir.no_handphone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendarAlt className="h-4 w-4 mr-3 text-gray-400" />
                          Umur: {takmir.umur}
                        </div>
                        {takmir.deskripsi_tugas && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium mb-1">Deskripsi Tugas:</p>
                            <p className="leading-relaxed">
                              {takmir.deskripsi_tugas}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <Link href={`/takmirs/edit/${takmir.slug}`}>
                          <button className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                            <FaEdit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={(e) => onDelete(takmir.id, takmir.nama, e)}
                          className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <FaTrash className="h-3 w-3 mr-1" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
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
          </>
        )}
      </div>
    </>
  );
}
