import { axiosInstance } from "@/lib/axios";
import { Jamaah } from "@/types/jamaah";
import { JamaahFormValues } from "../schema/jamaahSchema";

export const updateJamaah = async (
  id: number,
  data: Partial<JamaahFormValues>
): Promise<Jamaah> => {
  const response = await axiosInstance.put<{ data: Jamaah }>(
    `/api/admin/jamaahs/${id}`,
    data
  );
  return response.data.data;
};
