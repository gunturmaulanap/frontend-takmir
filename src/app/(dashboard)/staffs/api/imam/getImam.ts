import { axiosInstance } from "@/lib/axios";
import { Imam } from "@/types/staff";

export const getImam = async (id: number): Promise<Imam> => {
  const response = await axiosInstance.get<{ data: Imam }>(`/api/admin/imams/${id}`);
  return response.data.data;
};