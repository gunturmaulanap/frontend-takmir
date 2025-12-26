import { axiosInstance } from "@/lib/axios";
import { Asatidz } from "@/types/asatidz";

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

// Get single asatidz by ID
export const getAsatidz = async (id: number): Promise<Asatidz> => {
  try {
    const response = await axiosInstance.get<{ data: Asatidz }>(
      `/api/admin/asatidzs/${id}`
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    throw new Error("Asatidz not found");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch asatidz"
    );
  }
};

// Get asatidz by slug
export const getAsatidzBySlug = async (slug: string): Promise<Asatidz> => {
  try {
    const response = await axiosInstance.get<{ data: Asatidz[] }>(
      "/api/admin/asatidzs",
      {
        params: {
          page: 1,
          limit: 100, // Fetch enough to find the asatidz
        },
      }
    );

    if (response.data && response.data.data) {
      const asatidz = response.data.data.find((a) => a.slug === slug);
      if (asatidz) {
        return asatidz;
      }
    }

    throw new Error("Asatidz not found");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch asatidz"
    );
  }
};

export const getAsatidzs = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Asatidz>> => {
  try {
    const response = await axiosInstance.get("/api/admin/asatidzs", {
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

    return {
      data: [],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: limit,
        to: 0,
        total: 0,
      },
    };
  } catch (error) {
    // ✅ Throw error agar Tanstack Query bisa handle retry & error state
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch asatidzs"
    );
  }
};
