"use client";

import {
  FaUserCog,
  FaEnvelope,
  FaUser,
  FaEdit,
  FaTrash,
  FaMosque,
} from "react-icons/fa";
import { useAdmins, useUpdateAdminStatus } from "@/hooks/useAdmins";
import Link from "next/link";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminListPageProps {
  onDelete?: (id: number, name?: string, event?: React.MouseEvent) => void;
}

export function AdminListPage({ onDelete }: AdminListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: paginatedAdmins,
    isLoading,
    isError,
    isFetching,
  } = useAdmins(currentPage, itemsPerPage);
  const admins = paginatedAdmins?.data || [];
  const updateAdminStatus = useUpdateAdminStatus();
  const [localStates, setLocalStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleToggleAdminActive = async (
    adminId: number,
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;

    // Optimistic update - update UI immediately
    setLocalStates((prev) => ({
      ...prev,
      [adminId]: newStatus,
    }));

    try {
      await updateAdminStatus.mutateAsync({
        id: adminId,
        isActive: newStatus,
      });
    } catch (error) {
      // Revert jika gagal
      setLocalStates((prev) => ({ ...prev, [adminId]: currentStatus }));
    }
  };

  const generatePagination = () => {
    const totalPages = paginatedAdmins?.last_page || 1;
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
                <FaUserCog className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                  Manajemen Pengurus Masjid
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola semua data admin/pengurus masjid dan status aktivasi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Admin Card */}
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUserCog className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Admin
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {admins.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUserCog className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Aktif
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      admins.filter(
                        (a) => localStates[a.id] ?? a.is_active ?? false
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
                  {/* Header with toggle */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-14 h-7 bg-gray-200 rounded-full"></div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    {/* Username */}
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    {/* Masjid */}
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
              Terjadi kesalahan saat memuat data admin
            </p>
          </div>
        ) : (
          <>
            {/* Admin Cards */}
            {admins.length === 0 ? (
              <div className="text-center py-12">
                <FaUserCog className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum ada data admin
                </h3>
                <p className="text-gray-500">
                  Belum ada pengurus masjid yang terdaftar dalam sistem.
                </p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${
                  isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
                }`}
              >
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {admin.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            @{admin.username}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <label className="inline-flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={
                                localStates[admin.id] ?? admin.is_active ?? false
                              }
                              onChange={() =>
                                handleToggleAdminActive(
                                  admin.id,
                                  localStates[admin.id] ?? admin.is_active ?? false
                                )
                              }
                              disabled={updateAdminStatus.isPending}
                            />
                            <div
                              className={`relative w-14 h-7 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 peer-hover:bg-gray-300 peer-checked:peer-hover:bg-green-500 ${
                                updateAdminStatus.isPending
                                  ? "opacity-75"
                                  : ""
                              }`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {updateAdminStatus.isPending ? (
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <span className="text-xs text-gray-400 peer-checked:text-white transition-colors duration-200">
                                    {localStates[admin.id] ?? admin.is_active
                                      ? "✓"
                                      : "✕"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                          <span
                            className={`text-xs font-medium mt-1 px-2 py-1 rounded-full inline-flex items-center space-x-1 ${
                              localStates[admin.id] ?? admin.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                localStates[admin.id] ?? admin.is_active
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span>
                              {localStates[admin.id] ?? admin.is_active
                                ? "Aktif"
                                : "Nonaktif"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEnvelope className="h-4 w-4 mr-3 text-gray-400" />
                          {admin.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUser className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium">Username:</span>{" "}
                          <span className="ml-1">{admin.username}</span>
                        </div>
                        {admin.profileMasjid && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMosque className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium">Masjid:</span>{" "}
                            <span className="ml-1">
                              {admin.profileMasjid.nama}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <Link href={`/admin-masjids/edit/${admin.id}`}>
                          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                            <FaEdit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                        </Link>

                        {onDelete && (
                          <button
                            onClick={(e) => onDelete(admin.id, admin.name, e)}
                            className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            <FaTrash className="h-3 w-3 mr-1" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginatedAdmins && paginatedAdmins.last_page > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                <div className="text-sm text-gray-500">
                  Showing {paginatedAdmins.current_page} of{" "}
                  {paginatedAdmins.last_page} pages
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
                          if (currentPage < paginatedAdmins.last_page) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        size="default"
                        className={
                          currentPage === paginatedAdmins.last_page
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
