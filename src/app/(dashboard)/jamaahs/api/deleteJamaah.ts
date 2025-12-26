import { axiosInstance } from "@/lib/axios";

export const deleteJamaah = async (id: number): Promise<void> => {
  try {
    const baseURL = axiosInstance.defaults.baseURL;
    const fullURL = `${baseURL}/api/admin/jamaahs/${id}`;

    console.log("🔍 Deleting jamaah with URL:", fullURL);

    await axiosInstance.delete(`/api/admin/jamaahs/${id}`);
    console.log("✅ Jamaah deleted successfully");
  } catch (error: any) {
    console.error("❌ Error deleting jamaah:", error);

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
