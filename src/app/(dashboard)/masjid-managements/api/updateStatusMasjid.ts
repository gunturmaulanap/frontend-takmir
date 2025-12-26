import { axiosInstance } from "@/lib/axios";
import { Masjid } from "@/types/masjid";

export const updateMasjidStatus = async (
  id: number,
  isActive: boolean
): Promise<Masjid> => {
  try {
    // console.log(
    //   `📤 Updating masjid ${id} status to ${isActive ? "active" : "inactive"}`
    // );

    const response = await axiosInstance.patch(
      `/api/superadmin/profile-masjids/${id}/status`,
      {
        is_active: isActive,
      }
    );

    // console.log("📥 Backend response:", response.data);

    // Handle ProfileMasjidResource format from Laravel backend
    if (response.data?.data) {
      const masjidData = response.data.data;
      // console.log("✅ Masjid status updated successfully:", masjidData);
      return masjidData;
    }

    console.log("❌ Unexpected response structure:", response.data);
    throw new Error("Invalid response structure: expected data property");
  } catch (error) {
    console.error(`❌ Error updating masjid ${id} status:`, error);

    // Enhanced error handling
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Failed to update masjid status to ${isActive ? "active" : "inactive"}`
    );
  }
};
