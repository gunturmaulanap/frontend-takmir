"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { MdEditDocument, MdSensorOccupied } from "react-icons/md";
import { Pencil, Trash2 } from "lucide-react";
import { useStaffSchedules } from "@/hooks/useStaffSchedules";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StaffSchedule } from "@/types/staff";

interface StaffScheduleListPageProps {
  onDelete: (id: number) => void;
}
export function StaffScheduleListPage({
  onDelete,
}: StaffScheduleListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    data: paginatedStaffSchedules,
    isLoading, // True hanya saat load pertama kali
    isFetching, // True setiap kali ambil data (background)
    isError,
    refetch,
  } = useStaffSchedules(currentPage, itemsPerPage);

  const staffSchedules = paginatedStaffSchedules?.data || [];
  const paginationMeta = paginatedStaffSchedules?.meta;

  const getStaffScheduleBulanIni = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return staffSchedules.filter((schedule) => {
      const createdAt = new Date(schedule.created_at);
      return (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <PiUsersThree className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                Manajemen Jadwal Petugas
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua data jadwal petugas Anda
              </p>
            </div>
          </div>
          <Link
            href="/staff-schedules/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200"
          >
            <FaPlus className="h-4 w-4" />
            <span>Tambah Jadwal Petugas</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Petugas</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "..." : staffSchedules.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State Awal (Skeleton) */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 mb-2">Gagal memuat data jadwal petugas</p>
          <button
            onClick={() => refetch()}
            className="text-red-600 hover:text-red-700 underline text-sm"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Data Jadwal Petugas
              </h2>
            </div>

            {/* Wrapper untuk efek transisi opacity saat fetching page baru */}
            <div
              className={`transition-opacity duration-300 ${
                isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khatib
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Imam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Muadzin
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tema Khutbah
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffSchedules.map((staffSchedule: StaffSchedule) => (
                      <tr
                        key={staffSchedule.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staffSchedule.khatib.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {staffSchedule.imam.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {staffSchedule.muadzin.nama}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {staffSchedule.tema_khutbah}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                          <Link
                            href={`/staff-schedules/edit/${staffSchedule.slug}`}
                            className="inline-block mr-2"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(staffSchedule.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden">
                {staffSchedules.map((staffSchedule: StaffSchedule) => (
                  <div
                    key={staffSchedule.id}
                    className="border-b border-gray-200 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {staffSchedule.khatib.nama}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="h-3 w-3 mr-2" />
                        {staffSchedule.imam.nama}
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <FaMapMarkerAlt className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">
                          {staffSchedule.muadzin.nama}
                        </span>
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <FaMapMarkerAlt className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">
                          {staffSchedule.tema_khutbah}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/staff-schedules/edit/${staffSchedule.slug}`}
                        className="flex-1"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(staffSchedule.id)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Empty State - mengikuti pattern Events */}
          {staffSchedules.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <PiUsersThree className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Jadwal
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Mulai tambahkan jadwal pertama untuk mengelola data jadwal
                  petugas masjid.
                </p>
                <Link
                  href="/staff-schedules/create"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Tambah Jadwal Petugas</span>
                </Link>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.last_page > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-500">
                Menampilkan {paginationMeta.from} - {paginationMeta.to} dari{" "}
                {paginationMeta.total} jadwal petugas
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      size="default"
                    />
                  </PaginationItem>

                  {/* ✅ Menggunakan logic generatePagination yang sudah dibuat */}
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
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(Number(page));
                          }}
                          isActive={currentPage === page}
                          href="#"
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
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, paginationMeta.last_page)
                        );
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
  );
}
