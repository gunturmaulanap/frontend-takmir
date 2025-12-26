import { axiosInstance } from "@/lib/axios";
import { Asatidz } from "@/types/asatidz";
import { AsatidzFormValues } from "../schema/asatidzSchema";

export const updateAsatidz = async (
  id: number,
  data: Partial<AsatidzFormValues>
): Promise<Asatidz> => {
  try {
    const response = await axiosInstance.put<{ data: Asatidz }>(
      `/api/admin/asatidzs/${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error updating asatidz:", error);
    throw error;
  }
};
