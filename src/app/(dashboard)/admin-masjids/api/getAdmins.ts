import { axiosInstance } from "@/lib/axios";
import { Admin } from "@/types/admin";

interface AdminsResponse {
  data: Admin[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const getAdmins = async (
  page: number = 1,
  limit: number = 10
): Promise<AdminsResponse> => {
  try {
    // console.log(`📤 Fetching admins page ${page} with limit ${limit}`);

    const response = await axiosInstance.get(`/api/superadmin/admins`, {
      params: {
        page,
        per_page: limit,
      },
    });

    // console.log("📥 Backend response:", response.data);

    if (response.data?.data) {
      const adminsData = response.data.data;
      // console.log("✅ Admins fetched successfully:", adminsData);
      return response.data;
    }

    // console.log("❌ Unexpected response structure:", response.data);
    throw new Error("Invalid response structure: expected data property");
  } catch (error) {
    // console.error("❌ Error fetching admins:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to fetch admins");
  }
};
