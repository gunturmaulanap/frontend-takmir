"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaCalendar, FaFilter } from "react-icons/fa";
import { useDashboardStats } from "@/hooks/useReports";
import { useChartData } from "@/hooks/useReports";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format untuk Y axis - lebih pendek (Juta, Ribu)
const formatYAxis = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}rb`;
  }
  return value.toString();
};

export default function Dashboard() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const {
    data: dashboardData,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStats();

  const { data: chartData, isLoading: chartLoading } = useChartData(
    startDate && endDate ? { start_date: startDate, end_date: endDate } : {}
  );

  if (statsLoading) {
    return <LoadingSpinner message="Memuat data dashboard..." />;
  }

  if (statsError) {
    return (
      <ErrorState message="Gagal memuat data dashboard. Silakan coba lagi nanti." />
    );
  }

  const stats = dashboardData?.summary;
  const displayChartData = chartData || [];

  // Calculate summary based on chart data when filter is active
  const getFilteredSummary = () => {
    if (!startDate || !endDate || !displayChartData || displayChartData.length === 0) {
      return null;
    }

    const totalIncome = displayChartData.reduce((sum, item) => sum + (item.income || 0), 0);
    const totalExpense = displayChartData.reduce((sum, item) => sum + (item.expense || 0), 0);

    return {
      total_income: totalIncome,
      total_expense: totalExpense,
      saldo: totalIncome - totalExpense,
    };
  };

  const filteredSummary = getFilteredSummary();

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      // Trigger refetch by updating chartData query
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Keuangan</h1>
          <p className="text-gray-600 mt-1">
            Statistik dan grafik keuangan masjid
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-700">Filter Tanggal</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="start-date" className="text-sm font-medium text-gray-700">Tanggal Mulai</Label>
            <div className="relative mt-1">
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClearDates}
              disabled={!startDate && !endDate}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
          </div>
        </div>
        {startDate && endDate && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-md">
            <p className="text-sm text-emerald-700">
              <span className="font-medium">Filter Aktif:</span> Dari {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} sampai {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* Filter Summary Card - Only show when filter is active */}
      {startDate && endDate && filteredSummary && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendar className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ringkasan Periode Filter
            </h2>
          </div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Periode:</span> {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-green-800">
                Total Pemasukan
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(filteredSummary.total_income)}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">
                Total Pengeluaran
              </p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(filteredSummary.total_expense)}
              </p>
            </div>
            <div className={`rounded-lg p-4 border ${filteredSummary.saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
              <p className={`text-sm font-medium ${filteredSummary.saldo >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                Saldo
              </p>
              <p className={`text-2xl font-bold mt-2 ${filteredSummary.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(filteredSummary.saldo)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaArrowUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Pemasukan
              </p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(stats?.total_income || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaArrowDown className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Pengeluaran
              </p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(stats?.total_expense || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div
              className={`p-2 rounded-lg ${
                (stats?.saldo || 0) >= 0 ? "bg-blue-100" : "bg-orange-100"
              }`}
            >
              <FaWallet
                className={`h-5 w-5 ${
                  (stats?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"
                }`}
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p
                className={`text-lg font-bold ${
                  (stats?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"
                }`}
              >
                {formatCurrency(stats?.saldo || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaChartLine className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total Transaksi
              </p>
              <p className="text-lg font-bold text-purple-600">
                {stats?.total_transactions || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ringkasan Bulan Ini
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Pemasukan Bulan Ini
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(stats?.current_month_income || 0)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800">
              Pengeluaran Bulan Ini
            </p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {formatCurrency(stats?.current_month_expense || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Monthly Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pemasukan vs Pengeluaran per Bulan
          </h2>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : displayChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Tidak ada data untuk ditampilkan
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip
                  formatter={(value: number | undefined) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
                <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line Chart - Income Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tren Pemasukan
          </h2>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : displayChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Tidak ada data untuk ditampilkan
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={displayChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip
                  formatter={(value: number | undefined) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Pemasukan"
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Combined Chart - Balance Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tren Saldo
        </h2>
        {chartLoading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : displayChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px] text-gray-500">
            Tidak ada data untuk ditampilkan
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={displayChartData.map((item) => ({
              ...item,
              balance: item.income - item.expense
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number | undefined) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Saldo"
                dot={{ fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
