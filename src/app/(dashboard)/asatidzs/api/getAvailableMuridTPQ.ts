import { axiosInstance } from "@/lib/axios";
import { MuridTPQ } from "@/types/asatidz";

export const getAvailableMuridTPQ = async (): Promise<MuridTPQ[]> => {
  try {
    const response = await axiosInstance.get<{ data: MuridTPQ[] }>(
      "/api/admin/asatidzs/murid-tpq/available"
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("❌ Error fetching available murid TPQ:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch murid TPQ"
    );
  }
};
