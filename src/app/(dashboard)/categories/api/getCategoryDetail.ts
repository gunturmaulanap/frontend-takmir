import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category";

/**
 * Get category detail by ID
 * Used in pages where we resolve slug to ID first
 */
export const getCategoryDetail = async (id: number): Promise<Category> => {
  try {
    const response = await axiosInstance.get<{ data: Category }>(
      `/api/admin/categories/${id}`
    );
    console.log("✅ Category Detail Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching category detail:", error);
    throw error;
  }
};