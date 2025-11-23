import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category";

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

export const getCategories = async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Category>> => {
  try {
    const response = await axiosInstance.get<{ data: any }>(
      "/api/admin/categories",
      {
        params: {
          page,
          limit,
        },
      }
    );

    // Extract array dari paginated structure
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
        }
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
        }
      };
    }

    return {
      data: [],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: limit,
        to: 0,
        total: 0,
      }
    };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    throw error;
  }
};
