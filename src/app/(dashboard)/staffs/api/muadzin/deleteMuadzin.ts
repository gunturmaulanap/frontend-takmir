import { axiosInstance } from "@/lib/axios";
export const deleteMuadzin = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/muadzins/${id}`);
    console.log("✅ Muadzin deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting muadzin:", error);
    throw error;
  }
};
