import { axiosInstance } from "@/lib/axios";
import { Imam } from "@/types/staff";
import { ImamFormValues } from "@/app/(dashboard)/staffs/schema/imamSchema";

export const createImam = async (data: ImamFormValues): Promise<Imam> => {
  try {
    const response = await axiosInstance.post<{ data: Imam }>(
      "/api/admin/imams",
      data
    );
    console.log("✅ Create Imam Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
   
    throw error;
  }
};