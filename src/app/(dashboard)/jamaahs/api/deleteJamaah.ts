import { axiosInstance } from "@/lib/axios";

export const deleteJamaah = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/jamaahs/${id}`);
    console.log("✅ Jamaah deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting jamaah:", error);
    throw error;
  }
};
