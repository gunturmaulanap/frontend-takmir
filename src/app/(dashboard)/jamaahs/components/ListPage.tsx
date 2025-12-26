"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaPhone,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { MdEditDocument, MdSensorOccupied } from "react-icons/md";
import { Pencil, Trash2 } from "lucide-react";

import { useJamaahs } from "@/hooks/useJamaahs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface JamaahListPageProps {
  onDelete: (id: number) => void;
}

export function JamaahListPage({ onDelete }: JamaahListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // ✅ Mengikuti pattern Events/Takmirs
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAktivitas, setSelectedAktivitas] = useState("all");

  const aktivitasOptions = [
    { value: "all", label: "Semua Aktivitas" },
    { value: "Kajian Rutin", label: "Kajian Rutin" },
    { value: "Kajian Senin Kamis", label: "Kajian Senin Kamis" },
    { value: "Kajian Sabtu", label: "Kajian Sabtu" },
    { value: "Kajian Minggu", label: "Kajian Minggu" },
    { value: "Tabligh Akhbar", label: "Tabligh Akhbar" },
    { value: "TPQ", label: "TPQ" },
    { value: "Shalat Jamaah", label: "Shalat Jamaah" },
    { value: "Sukarelawan", label: "Sukarelawan" },
  ];

  // ✅ Menggunakan hook useJamaahs (mengikuti Events pattern)
  const {
    data: paginatedJamaahs,
    isLoading, // True hanya saat load pertama kali
    isFetching, // True setiap kali ambil data (background)
    isError,
    refetch,
  } = useJamaahs(currentPage, itemsPerPage);

  const jamaahs = paginatedJamaahs?.data || [];
  const paginationMeta = paginatedJamaahs?.meta;

  // Filter jamaahs berdasarkan search dan aktivitas
  const filteredJamaahs = jamaahs.filter((jamaah: any) => {
    const matchesSearch = jamaah.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAktivitas =
      selectedAktivitas === "all" ||
      (Array.isArray(jamaah.aktivitas_jamaah)
        ? jamaah.aktivitas_jamaah.includes(selectedAktivitas)
        : jamaah.aktivitas_jamaah?.includes(selectedAktivitas));

    return matchesSearch && matchesAktivitas;
  });

  // ✅ Logic Pagination Generator (Bersih & Stabil)
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
                Manajemen Jamaah
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua data jamaah masjid Anda
              </p>
            </div>
          </div>
          <Link
            href="/jamaahs/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200"
          >
            <FaPlus className="h-4 w-4" />
            <span>Tambah Jamaah</span>
          </Link>
        </div>
      </div>

      {/* Search dan Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari nama jamaah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Aktivitas */}
          <div className="w-full md:w-64">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Select
                value={selectedAktivitas}
                onValueChange={setSelectedAktivitas}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Filter Aktivitas" />
                </SelectTrigger>
                <SelectContent>
                  {aktivitasOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <p className="text-red-800 mb-2">Gagal memuat data jamaah</p>
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
                Data Jamaah
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
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. Handphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Umur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alamat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktivitas Jamaah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis Kelamin
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJamaahs.map((jamaah: any) => (
                      <tr
                        key={jamaah.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {jamaah.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {jamaah.no_handphone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {jamaah.umur}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {jamaah.alamat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {(() => {
                            const aktivitas = jamaah.aktivitas_jamaah;
                            if (Array.isArray(aktivitas)) {
                              return (
                                <div className="flex flex-wrap gap-1">
                                  {aktivitas.map(
                                    (act: string, index: number) => (
                                      <span
                                        key={index}
                                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                      >
                                        {act}
                                      </span>
                                    )
                                  )}
                                </div>
                              );
                            } else {
                              // Handle case where aktivitas_jamaah is a string (backward compatibility)
                              return aktivitas;
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            {jamaah.jenis_kelamin?.toLowerCase() ===
                              "laki-laki" ||
                            jamaah.jenis_kelamin
                              ?.toLowerCase()
                              .startsWith("l") ? (
                              <>
                                <CgGenderMale className="h-4 w-4 mr-2 text-gray-600" />
                                <span>Laki-laki</span>
                              </>
                            ) : (
                              <>
                                <CgGenderFemale className="h-4 w-4 mr-2 text-gray-600" />
                                <span>Perempuan</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                          <Link
                            href={`/jamaahs/edit/${jamaah.slug}`}
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
                            onClick={() => onDelete(jamaah.id)}
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
                {filteredJamaahs.map((jamaah: any) => (
                  <div
                    key={jamaah.id}
                    className="border-b border-gray-200 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {jamaah.nama}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MdSensorOccupied className="h-3 w-3 mr-2" />
                        {jamaah.umur} tahun
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {jamaah.jenis_kelamin?.toLowerCase() === "laki-laki" ||
                        jamaah.jenis_kelamin?.toLowerCase().startsWith("l") ? (
                          <>
                            <CgGenderMale className="h-4 w-4 mr-2 text-gray-600" />
                            <span>Laki-laki</span>
                          </>
                        ) : (
                          <>
                            <CgGenderFemale className="h-4 w-4 mr-2 text-gray-600" />
                            <span>Perempuan</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="h-3 w-3 mr-2" />
                        {jamaah.no_handphone}
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <FaMapMarkerAlt className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{jamaah.alamat}</span>
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <MdEditDocument className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const aktivitas = jamaah.aktivitas_jamaah;
                            if (Array.isArray(aktivitas)) {
                              return aktivitas.map(
                                (act: string, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                  >
                                    {act}
                                  </span>
                                )
                              );
                            } else {
                              // Handle case where aktivitas_jamaah is a string (backward compatibility)
                              return (
                                <span className="text-gray-800">
                                  {aktivitas}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/jamaahs/edit/${jamaah.slug}`}
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
                        onClick={() => onDelete(jamaah.id)}
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
          {jamaahs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <PiUsersThree className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Jamaah
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Mulai tambahkan jamaah pertama untuk mengelola data jamaah
                  masjid.
                </p>
                <Link
                  href="/jamaahs/create"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Tambah Jamaah</span>
                </Link>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.last_page > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-500">
                Menampilkan {paginationMeta.from} - {paginationMeta.to} dari{" "}
                {paginationMeta.total} jamaah
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
