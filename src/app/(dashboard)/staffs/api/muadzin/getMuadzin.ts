import { axiosInstance } from "@/lib/axios";
import { Muadzin } from "@/types/staff";

export const getMuadzin = async (id: number): Promise<Muadzin> => {
  const response = await axiosInstance.get<{ data: Muadzin }>(`/api/admin/muadzins/${id}`);
  return response.data.data;
};