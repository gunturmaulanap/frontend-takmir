import { axiosInstance } from "@/lib/axios";

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete<{ data: number }>(
      `/api/admin/categories/${id}`
    );
    console.log("✅ Delete Category Response:", response.data);
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    throw error;
  }
};
