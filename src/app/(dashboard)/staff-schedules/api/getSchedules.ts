import { axiosInstance } from "@/lib/axios";
import { StaffSchedule } from "@/types/staff";
import page from "../../calenders/page";

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

// Get staff schedules
export const getStaffSchedules = async (
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<StaffSchedule>> => {
  try {
    const response = await axiosInstance.get("/api/admin/jadwal-khutbahs", {
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

      // If not paginated, return as a single page
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

    throw new Error("Failed to fetch staff schedules");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch staff schedules"
    );
  }
};
