import { axiosInstance } from "@/lib/axios";
import { Report } from "@/types/report";

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

export const getReports = async (
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<Report>> => {
  try {
    const response = await axiosInstance.get("/api/admin/transactions", {
      params: {
        page,
        limit,
      },
    });

    if (response.data && response.data.data) {
      const paginationData = response.data.data;

      // Check if it's paginated response with .data property
      if (paginationData.data && Array.isArray(paginationData.data)) {
        return {
          data: paginationData.data,
          meta: {
            current_page: paginationData.current_page || 1,
            from: paginationData.from || 1,
            last_page: paginationData.last_page || 1,
            per_page: paginationData.per_page || limit,
            to: paginationData.to || paginationData.data.length,
            total: paginationData.total || paginationData.data.length,
          },
        };
      }
      // Check if it's direct array (fallback)
      if (Array.isArray(paginationData)) {
        return {
          data: paginationData,
          meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            per_page: limit,
            to: paginationData.length,
            total: paginationData.length,
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

    throw new Error("Failed to fetch muadzins");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch muadzins"
    );
  }
};
