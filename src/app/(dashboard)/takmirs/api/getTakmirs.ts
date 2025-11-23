import { axiosInstance } from "@/lib/axios";
import { Takmir } from "@/types/takmir";

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

export const getTakmirs = async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Takmir>> => {
  try {
    const response = await axiosInstance.get("/api/admin/takmirs", {
      params: {
        page,
        limit,
      },
    });

    if (response.data && response.data.data) {
      const paginationData = response.data.data;
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
      console.log("📊 Unexpected structure in data.data");
    }
    console.warn("⚠️ Unexpected response structure, returning empty array");
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
    console.error("❌ Error fetching takmirs:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch takmirs"
    );
  }
};
