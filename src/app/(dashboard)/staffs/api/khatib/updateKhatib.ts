import { axiosInstance } from "@/lib/axios";
import { Khatib } from "@/types/staff";
import { KhatibFormValues } from "@/app/(dashboard)/staffs/schema/khatibSchema";

export const updateKhatib = async (
  id: number,
  data: Partial<KhatibFormValues>
): Promise<Khatib> => {
  const response = await axiosInstance.put<{ data: Khatib }>(
    `/api/admin/khatibs/${id}`,
    data
  );
  return response.data.data;
};