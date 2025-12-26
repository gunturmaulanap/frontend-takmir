"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaPhone,
  FaMapMarkerAlt,
  FaSearch,
  FaUserGraduate,
} from "react-icons/fa";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { MdSensorOccupied, MdSchool } from "react-icons/md";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAsatidzs } from "@/hooks/useAsatidzs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AsatidzListPageProps {
  onDelete: (id: number) => void;
}

export function AsatidzListPage({ onDelete }: AsatidzListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsatidz, setSelectedAsatidz] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    data: paginatedAsatidzs,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAsatidzs(currentPage, itemsPerPage);

  const asatidzs = paginatedAsatidzs?.data || [];
  const paginationMeta = paginatedAsatidzs?.meta;

  // Filter asatidzs berdasarkan search
  const filteredAsatidzs = asatidzs.filter((asatidz: any) => {
    return asatidz.nama.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  const handleViewDetail = (asatidz: any) => {
    setSelectedAsatidz(asatidz);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FaUserGraduate className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                Manajemen Asatidz
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua data asatidz masjid Anda
              </p>
            </div>
          </div>
          <Link
            href="/asatidzs/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto justify-center transition-colors duration-200"
          >
            <FaPlus className="h-4 w-4" />
            <span>Tambah Asatidz</span>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari nama asatidz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 mb-2">Gagal memuat data asatidz</p>
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
                Data Asatidz
              </h2>
            </div>

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
                        Keahlian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. Handphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Murid TPQ
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
                    {filteredAsatidzs.map((asatidz: any) => (
                      <tr
                        key={asatidz.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {asatidz.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {asatidz.keahlian || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {asatidz.no_handphone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <MdSchool className="h-4 w-4 mr-1 text-emerald-600" />
                            {asatidz.jumlah_murid_tpq || 0} murid
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            {asatidz.jenis_kelamin?.toLowerCase() ===
                            "laki-laki" ? (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(asatidz)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 mr-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Link
                            href={`/asatidzs/edit/${asatidz.slug}`}
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
                            onClick={() => onDelete(asatidz.id)}
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
                {filteredAsatidzs.map((asatidz: any) => (
                  <div
                    key={asatidz.id}
                    className="border-b border-gray-200 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {asatidz.nama}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MdSchool className="h-4 w-4 mr-2 text-emerald-600" />
                        {asatidz.keahlian || "Keahlian tidak ditentukan"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MdSensorOccupied className="h-3 w-3 mr-2" />
                        {asatidz.jumlah_murid_tpq || 0} murid TPQ
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {asatidz.jenis_kelamin?.toLowerCase() ===
                        "laki-laki" ? (
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
                      {asatidz.no_handphone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="h-3 w-3 mr-2" />
                          {asatidz.no_handphone}
                        </div>
                      )}
                      {asatidz.alamat && (
                        <div className="flex items-start text-sm text-gray-600">
                          <FaMapMarkerAlt className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight">
                            {asatidz.alamat}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(asatidz)}
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detail
                      </Button>
                      <Link
                        href={`/asatidzs/edit/${asatidz.slug}`}
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
                        onClick={() => onDelete(asatidz.id)}
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

          {/* Empty State */}
          {asatidzs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <FaUserGraduate className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Belum Ada Asatidz
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Mulai tambahkan asatidz pertama untuk mengelola data asatidz
                  masjid.
                </p>
                <Link
                  href="/asatidzs/create"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Tambah Asatidz</span>
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {paginationMeta && paginationMeta.last_page > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-500">
                Menampilkan {paginationMeta.from} - {paginationMeta.to} dari{" "}
                {paginationMeta.total} asatidz
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Detail Asatidz
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai asatidz
            </DialogDescription>
          </DialogHeader>

          {selectedAsatidz && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {selectedAsatidz.nama}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Keahlian
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {selectedAsatidz.keahlian || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Umur
                    </label>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedAsatidz.umur
                        ? `${selectedAsatidz.umur} tahun`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Jenis Kelamin
                    </label>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedAsatidz.jenis_kelamin || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    No. Handphone
                  </label>
                  <p className="text-base text-gray-900 mt-1">
                    {selectedAsatidz.no_handphone || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Alamat
                  </label>
                  <p className="text-base text-gray-900 mt-1">
                    {selectedAsatidz.alamat || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Keterangan
                  </label>
                  <p className="text-base text-gray-900 mt-1">
                    {selectedAsatidz.keterangan || "-"}
                  </p>
                </div>
              </div>

              {/* Murid TPQ */}
              {selectedAsatidz.murid && selectedAsatidz.murid.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Daftar Murid TPQ ({selectedAsatidz.jumlah_murid_tpq})
                  </h3>
                  <div className="space-y-2">
                    {selectedAsatidz.murid.map((murid: any) => (
                      <div
                        key={murid.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {murid.nama}
                          </p>
                          <p className="text-sm text-gray-600">
                            {murid.aktivitas_jamaah}
                          </p>
                        </div>
                        <div className="text-right">
                          {murid.umur && (
                            <p className="text-sm text-gray-600">
                              {murid.umur} tahun
                            </p>
                          )}
                          {murid.no_handphone && (
                            <p className="text-sm text-gray-600">
                              {murid.no_handphone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
