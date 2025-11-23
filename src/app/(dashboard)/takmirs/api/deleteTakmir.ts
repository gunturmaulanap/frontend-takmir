import { axiosInstance } from "@/lib/axios";

export async function deleteTakmir(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/api/admin/takmirs/${id}`);
    console.log("✅ Takmir deleted successfully");
  } catch (error) {
    console.log("❌ Error deleting takmir:", error);
    throw error; // Re-throw error untuk proper error handling
  }
}
