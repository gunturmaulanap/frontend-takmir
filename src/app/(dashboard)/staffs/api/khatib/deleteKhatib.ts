import { axiosInstance } from "@/lib/axios";
export const deleteKhatib = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/khatibs/${id}`);
    console.log("✅ Khatib deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting khatib:", error);
    throw error;
  }
};
