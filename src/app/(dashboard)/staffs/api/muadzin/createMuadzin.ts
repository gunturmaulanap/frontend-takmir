import { axiosInstance } from "@/lib/axios";
import { Muadzin } from "@/types/staff";
import { MuadzinFormValues } from "@/app/(dashboard)/staffs/schema/muadzinSchema";

export const createMuadzin = async (data: MuadzinFormValues): Promise<Muadzin> => {
  try {
    const response = await axiosInstance.post<{ data: Muadzin }>(
      "/api/admin/muadzins",
      data
    );
    console.log("✅ Create Muadzin Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
   
    throw error;
  }
};