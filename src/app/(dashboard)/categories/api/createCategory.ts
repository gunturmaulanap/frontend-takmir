import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category";
import { CategoryFormValues } from "../schema/categorySchema";

export const createCategory = async (
  data: CategoryFormValues
): Promise<Category> => {
  try {
    const response = await axiosInstance.post<{ data: Category }>(
      "/api/admin/categories",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Create Category Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating category:", error);
    throw error;
  }
};
