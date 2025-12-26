import { axiosInstance } from "@/lib/axios";

export const deleteAsatidz = async (id: number): Promise<void> => {
  try {
    const baseURL = axiosInstance.defaults.baseURL;
    const fullURL = `${baseURL}/api/admin/asatidzs/${id}`;

    console.log("🔍 Deleting asatidz with URL:", fullURL);

    await axiosInstance.delete(`/api/admin/asatidzs/${id}`);
    console.log("✅ Asatidz deleted successfully");
  } catch (error: any) {
    console.error("❌ Error deleting asatidz:", error);

    // Log detailed error response
    if (error.response?.data) {
      console.error("🔍 Laravel validation errors:", error.response.data);

      // Create more specific error message
      const errorMessage = error.response.data.message || error.message;
      throw new Error(errorMessage);
    }

    throw error;
  }
};
