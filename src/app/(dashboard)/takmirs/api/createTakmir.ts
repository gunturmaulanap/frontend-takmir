import { axiosInstance } from "@/lib/axios";
import { Takmir } from "@/types/takmir";
import { TakmirFormValues } from "../schema/takmirSchema";

export const createTakmir = async (data: TakmirFormValues): Promise<Takmir> => {
  try {
    const response = await axiosInstance.post<{ data: Takmir }>(
      "/api/admin/takmirs",
      data
    );
    console.log("✅ Create Takmir Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating takmir:", error);
    throw error;
  }
};
