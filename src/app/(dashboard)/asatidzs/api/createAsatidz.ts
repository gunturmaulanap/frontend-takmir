import { axiosInstance } from "@/lib/axios";
import { Asatidz } from "@/types/asatidz";
import { AsatidzFormValues } from "../schema/asatidzSchema";

export const createAsatidz = async (
  data: AsatidzFormValues
): Promise<Asatidz> => {
  try {
    const response = await axiosInstance.post<{ data: Asatidz }>(
      "/api/admin/asatidzs",
      data
    );
    console.log("✅ Create Asatidz Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating asatidz:", error);
    throw error;
  }
};
