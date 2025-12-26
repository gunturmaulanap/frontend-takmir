import { axiosInstance } from "@/lib/axios";
import { Khatib } from "@/types/staff";

export const getKhatib = async (id: number): Promise<Khatib> => {
  const response = await axiosInstance.get<{ data: Khatib }>(`/api/admin/khatibs/${id}`);
  return response.data.data;
};