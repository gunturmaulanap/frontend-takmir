"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaEye,
} from "react-icons/fa";
import { useTransactions } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import AddTransactionModal from "./AddTransactionModal";
import { Report } from "@/types/report";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import TransactionDetailModal from "./TransactionDetailModal";
import {
  isImagePath,
  resolveTransactionImageUrl,
} from "../utils/transactionImage";
import hasAnyPermission from "@/lib/permissions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface ReportListProps {
  onDelete?: (id: number) => void;
}

export default function ReportList({ onDelete }: ReportListProps) {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Report | null>(null);
  const [detailTransaction, setDetailTransaction] = useState<Report | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useTransactions(
    page,
    12,
    {
      ...(filterType !== "all" && { type: filterType as "income" | "expense" }),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    }
  );

  const transactions = paginatedData?.data || [];
  const meta = paginatedData?.meta;

  const handleAddClick = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEditClick = (transaction: Report) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDetailClick = (transaction: Report) => {
    setDetailTransaction(transaction);
    setDetailOpen(true);
  };

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Calculate row number (start from 1, incrementing)
  const getRowNumber = (index: number) => {
    return (page - 1) * 12 + index + 1;
  };

  if (isLoading && page === 1) {
    return <LoadingSpinner message="Memuat data transaksi..." />;
  }

  if (isError) {
    return <ErrorState message="Gagal memuat data transaksi. Silakan coba lagi." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h1>
          <p className="text-gray-600 mt-1">Kelola semua transaksi keuangan masjid</p>
        </div>
        {hasAnyPermission(["transaksi-keuangan.create"]) && (
          <Button
            onClick={handleAddClick}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-4">
          {/* Search and Type Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan kategori atau keterangan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterType} onValueChange={(value) => {
                setFilterType(value);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">Tanggal Mulai</Label>
              <div className="relative mt-1">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="text-sm font-medium text-gray-700">Tanggal Akhir</Label>
              <div className="relative mt-1">
                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleClearDates}
              disabled={!startDate && !endDate}
              className="w-full sm:w-auto"
            >
              Reset Tanggal
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Tidak ada transaksi yang ditemukan.</p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="block lg:hidden space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    No. {getRowNumber(index)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <FaArrowUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <FaArrowDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.kategori}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.jumlah)}
                    </p>
                  </div>
                </div>

                {transaction.keterangan && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {transaction.keterangan}
                  </p>
                )}

                {transaction.bukti_transaksi &&
                  isImagePath(transaction.bukti_transaksi) && (
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={resolveTransactionImageUrl(
                          transaction.bukti_transaksi
                        )}
                        alt={`Bukti transaksi ${transaction.kategori}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                      />
                    </div>
                  )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDetailClick(transaction)}
                    className="flex-1"
                  >
                    <FaEye className="mr-2 h-3 w-3" />
                    Detail
                  </Button>
                  {hasAnyPermission(["transaksi-keuangan.edit"]) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(transaction)}
                      className="flex-1"
                    >
                      <FaEdit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  )}
                  {onDelete &&
                    hasAnyPermission(["transaksi-keuangan.delete"]) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <FaTrash className="mr-2 h-3 w-3" />
                        Hapus
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bukti
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getRowNumber(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(transaction.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {transaction.type === "income" ? (
                            <FaArrowUp className="h-4 w-4 text-green-600 mr-2" />
                          ) : (
                            <FaArrowDown className="h-4 w-4 text-red-600 mr-2" />
                          )}
                          <span
                            className={
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.kategori}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span
                          className={`font-bold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.jumlah)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {transaction.keterangan || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.bukti_transaksi &&
                        isImagePath(transaction.bukti_transaksi) ? (
                          <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={resolveTransactionImageUrl(
                                transaction.bukti_transaksi
                              )}
                              alt={`Bukti transaksi ${transaction.kategori}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDetailClick(transaction)}
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>
                          {hasAnyPermission(["transaksi-keuangan.edit"]) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(transaction)}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete &&
                            hasAnyPermission(["transaksi-keuangan.delete"]) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(transaction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === meta.last_page}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{meta.from}</span> to{" "}
                    <span className="font-medium">{meta.to}</span> of{" "}
                    <span className="font-medium">{meta.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      className="rounded-l-md"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                      Page {page} of {meta.last_page}
                    </span>
                    <Button
                      variant="outline"
                      className="rounded-r-md"
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.last_page}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingTransaction={editingTransaction}
        onSuccess={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
      />
      <TransactionDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        transaction={detailTransaction}
      />
    </div>
  );
}

export { ReportList };
