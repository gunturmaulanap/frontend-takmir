import { axiosInstance } from "@/lib/axios";
import { Report, DashboardStats, ChartData, MonthlySummary } from "@/types/report";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Get all transactions with pagination
export const getTransactions = async (
  page: number = 1,
  limit: number = 12,
  filters?: {
    type?: "income" | "expense";
    start_date?: string;
    end_date?: string;
    search?: string;
  }
): Promise<PaginatedResponse<Report>> => {
  try {
    const response = await axiosInstance.get("/api/admin/transactions", {
      params: {
        page,
        limit,
        ...filters,
      },
    });

    if (response.data && response.data.data) {
      const responseData = response.data.data;

      // Check if it has transactions array
      if (responseData.transactions && Array.isArray(responseData.transactions)) {
        return {
          data: responseData.transactions,
          meta: {
            current_page: responseData.pagination?.current_page || page,
            from: responseData.pagination?.from || 1,
            last_page: responseData.pagination?.last_page || 1,
            per_page: responseData.pagination?.per_page || limit,
            to: responseData.pagination?.to || responseData.transactions.length,
            total: responseData.pagination?.total || responseData.transactions.length,
          },
        };
      }

      // Check if it's paginated response with .data property
      if (responseData.data && Array.isArray(responseData.data)) {
        return {
          data: responseData.data,
          meta: {
            current_page: responseData.current_page || 1,
            from: responseData.from || 1,
            last_page: responseData.last_page || 1,
            per_page: responseData.per_page || limit,
            to: responseData.to || responseData.data.length,
            total: responseData.total || responseData.data.length,
          },
        };
      }

      // Check if it's direct array (fallback)
      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            per_page: limit,
            to: responseData.length,
            total: responseData.length,
          },
        };
      }
    } else if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: limit,
          to: response.data.length,
          total: response.data.length,
        },
      };
    }

    throw new Error("Failed to fetch transactions");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transactions"
    );
  }
};

// Get single transaction by ID
export const getTransaction = async (id: number): Promise<Report> => {
  try {
    const response = await axiosInstance.get(`/api/admin/transactions/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transaction"
    );
  }
};

// Create new transaction
export const createTransaction = async (
  data: FormData
): Promise<Report> => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/transactions",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create transaction"
    );
  }
};

// Update transaction
export const updateTransaction = async (
  id: number,
  data: FormData
): Promise<Report> => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/transactions/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          _method: 'PUT', // Laravel requires _method for file uploads with POST
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update transaction"
    );
  }
};

// Delete transaction
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/transactions/${id}`);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete transaction"
    );
  }
};

// Get dashboard statistics with chart data
export const getDashboardStats = async (): Promise<{
  summary: DashboardStats;
  chart_data: ChartData[];
}> => {
  try {
    const response = await axiosInstance.get(
      "/api/admin/transactions/dashboard"
    );

    if (response.data && response.data.data) {
      const data = response.data.data;
      const summary = data.summary || {};

      return {
        summary: {
          total_income: summary.total_income || 0,
          total_expense: summary.total_expense || 0,
          saldo: summary.total_saldo || 0,
          total_transactions: summary.total_transactions || 0,
          current_month_income: summary.monthly_income || 0,
          current_month_expense: summary.monthly_expense || 0,
        },
        chart_data: data.chart_data || [],
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch dashboard stats"
    );
  }
};

// Get chart data
export const getChartData = async (filters?: {
  start_date?: string;
  end_date?: string;
}): Promise<ChartData[]> => {
  try {
    const response = await axiosInstance.get(
      "/api/admin/transactions/chart-data",
      { params: filters }
    );

    if (response.data && response.data.data) {
      // Check if data is an array
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // Check if data has chart_data property
      if (Array.isArray(response.data.data.chart_data)) {
        return response.data.data.chart_data;
      }
    }

    return [];
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch chart data"
    );
  }
};

// Get monthly summary
export const getMonthlySummary = async (filters?: {
  month?: number;
  year?: number;
}): Promise<MonthlySummary> => {
  try {
    const response = await axiosInstance.get(
      "/api/admin/transactions/monthly-summary",
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch monthly summary"
    );
  }
};
