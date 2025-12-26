import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
  getChartData,
  getMonthlySummary,
} from "@/app/(dashboard)/reports/api/reportApi";

// Hook for fetching transactions with pagination
export const useTransactions = (
  page: number = 1,
  limit: number = 12,
  filters?: {
    type?: "income" | "expense";
    start_date?: string;
    end_date?: string;
    search?: string;
  }
) => {
  return useQuery({
    queryKey: ["transactions", page, limit, filters],
    queryFn: () => getTransactions(page, limit, filters),
  });
};

// Hook for fetching single transaction
export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
};

// Hook for creating transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
      queryClient.invalidateQueries({ queryKey: ["monthlySummary"] });
    },
  });
};

// Hook for updating transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
      queryClient.invalidateQueries({ queryKey: ["monthlySummary"] });
    },
  });
};

// Hook for deleting transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["chartData"] });
      queryClient.invalidateQueries({ queryKey: ["monthlySummary"] });
    },
  });
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });
};

// Hook for chart data
export const useChartData = (filters?: {
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ["chartData", filters],
    queryFn: () => getChartData(filters),
  });
};

// Hook for monthly summary
export const useMonthlySummary = (filters?: {
  month?: number;
  year?: number;
}) => {
  return useQuery({
    queryKey: ["monthlySummary", filters],
    queryFn: () => getMonthlySummary(filters),
  });
};
