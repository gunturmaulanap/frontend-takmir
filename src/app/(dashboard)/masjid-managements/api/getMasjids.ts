import { axiosInstance } from "@/lib/axios";
import { Masjid } from "@/types/masjid";

interface MasjidsResponse {
  data: Masjid[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const getMasjids = async (
  page: number = 1,
  limit: number = 10
): Promise<MasjidsResponse> => {
  try {
    // console.log(`📤 Fetching masjids page ${page} with limit ${limit}`);

    const response = await axiosInstance.get(
      `/api/superadmin/profile-masjids`,
      {
        params: {
          page,
          per_page: limit,
        },
      }
    );

    // console.log("📥 Backend response:", response.data);

    if (response.data?.data) {
      const masjidsData = response.data.data;
      // console.log("✅ Masjids fetched successfully:", masjidsData);
      return response.data;
    }

    console.log("❌ Unexpected response structure:", response.data);
    throw new Error("Invalid response structure: expected data property");
  } catch (error) {
    console.error("❌ Error fetching masjids:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch masjids");
  }
};
