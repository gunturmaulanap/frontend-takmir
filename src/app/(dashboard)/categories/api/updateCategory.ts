import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category";
import { CategoryFormValues } from "../schema/categorySchema";

export const updateCategory = async (
  id: number,
  data: CategoryFormValues
): Promise<Category> => {
  const response = await axiosInstance.put<{ data: Category }>(
    `/api/admin/categories/${id}`,
    data
  );
  return response.data.data;
};
