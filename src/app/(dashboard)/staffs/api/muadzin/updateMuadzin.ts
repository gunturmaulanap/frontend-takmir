import { axiosInstance } from "@/lib/axios";
import { Muadzin } from "@/types/staff";
import { MuadzinFormValues } from "@/app/(dashboard)/staffs/schema/muadzinSchema";

export const updateMuadzin = async (
  id: number,
  data: Partial<MuadzinFormValues>
): Promise<Muadzin> => {
  const response = await axiosInstance.put<{ data: Muadzin }>(
    `/api/admin/muadzins/${id}`,
    data
  );
  return response.data.data;
};