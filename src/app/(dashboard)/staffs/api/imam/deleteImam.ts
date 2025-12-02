import { axiosInstance } from "@/lib/axios";
export const deleteImam = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/imams/${id}`);
    console.log("✅ Imam deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting imam:", error);
    throw error;
  }
};
