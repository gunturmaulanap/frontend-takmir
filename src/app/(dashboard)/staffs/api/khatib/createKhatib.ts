import { axiosInstance } from "@/lib/axios";
import { Khatib } from "@/types/staff";
import { KhatibFormValues } from "@/app/(dashboard)/staffs/schema/khatibSchema";

export const createKhatib = async (data: KhatibFormValues): Promise<Khatib> => {
  try {
    const response = await axiosInstance.post<{ data: Khatib }>(
      "/api/admin/khatibs",
      data
    );
    console.log("✅ Create Khatib Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating khatib:", error);
    throw error;
  }
};