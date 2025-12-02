import { axiosInstance } from "@/lib/axios";
import { Imam } from "@/types/staff";

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

// Get single imam by ID
export const getImam = async (id: number): Promise<Imam> => {
  try {
    const response = await axiosInstance.get(`/api/admin/imams/${id}`);

    if (response.data && response.data.data) {
      return response.data.data;
    }

    throw new Error("Imam not found");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch imam"
    );
  }
};

export const getImams = async (
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<Imam>> => {
  try {
    const response = await axiosInstance.get("/api/admin/imams", {
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

      // If not paginated, return all data in a single page format
      return {
        data: paginationData,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: paginationData.length,
          to: paginationData.length,
          total: paginationData.length,
        },
      };
    }

    throw new Error("Failed to fetch imams");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch imams"
    );
  }
};
