import { axiosInstance } from "@/lib/axios";
import { Takmir, TakmirUpdateWithUserData } from "@/types/takmir";

export const updateTakmir = async (
  id: number,
  data: TakmirUpdateWithUserData
): Promise<Takmir> => {
  const response = await axiosInstance.put<{ data: Takmir }>(
    `/api/admin/takmirs/${id}`,
    data
  );

  console.log("✅ Update Takmir Response DEBUG:", response.data);

  if (!response.data.data) {
    throw new Error("Invalid response: No data received from server");
  }

  return response.data.data;
};
