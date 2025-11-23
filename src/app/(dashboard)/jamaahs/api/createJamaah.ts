import { axiosInstance } from "@/lib/axios";
import { Jamaah } from "@/types/jamaah";
import { JamaahFormValues } from "../schema/jamaahSchema";

export const createJamaah = async (data: JamaahFormValues): Promise<Jamaah> => {
  try {
    const response = await axiosInstance.post<{ data: Jamaah }>(
      "/api/admin/jamaahs",
      data
    );
    console.log("✅ Create Jamaah Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating jamaah:", error);
    throw error;
  }
};
