import { axiosInstance } from "@/lib/axios";

export const deleteStaffSchedule = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/jadwal-khutbahs/${id}`);
    console.log("✅ Staff schedule deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting staff schedule:", error);
    throw error;
  }
};
