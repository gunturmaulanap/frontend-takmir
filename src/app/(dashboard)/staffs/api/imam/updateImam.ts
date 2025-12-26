import { axiosInstance } from "@/lib/axios";
import { Imam } from "@/types/staff";
import { ImamFormValues } from "@/app/(dashboard)/staffs/schema/imamSchema";

export const updateImam = async (
  id: number,
  data: Partial<ImamFormValues>
): Promise<Imam> => {
  const response = await axiosInstance.put<{ data: Imam }>(
    `/api/admin/imams/${id}`,
    data
  );
  return response.data.data;
};