import { axiosInstance } from "@/lib/axios";
import { Takmir } from "@/types/takmir";



export const updateTakmirStatus = async (id: number, isActive: boolean): Promise<Takmir> => {
  try {
    console.log(`📤 Updating takmir ${id} status to ${isActive ? 'active' : 'inactive'}`);

    const response = await axiosInstance.patch(`/api/admin/takmirs/${id}/status`, {
      is_active: isActive
    });

    console.log("📥 Backend response:", response.data);

    // Handle TakmirResource format from Laravel backend
    if (response.data?.data) {
      const takmirData = response.data.data;
      console.log("✅ Takmir status updated successfully:", takmirData);
      return takmirData;
    }

    console.log("❌ Unexpected response structure:", response.data);
    throw new Error("Invalid response structure: expected data property");
  } catch (error) {
    console.error(`❌ Error updating takmir ${id} status:`, error);

    // Enhanced error handling
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(`Failed to update takmir status to ${isActive ? 'active' : 'inactive'}`);
  }
};