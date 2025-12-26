import { axiosInstance } from "@/lib/axios";
import { Admin } from "@/types/admin";

interface UpdateAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface UpdateAdminData {
  name: string;
  email: string;
  username: string;
  password?: string;
  password_confirmation?: string;
  profile_masjid_id?: number | null;
}

export const updateAdmin = async (
  id: number,
  data: UpdateAdminData
): Promise<Admin> => {
  const response = await axiosInstance.put<UpdateAdminResponse>(
    `/api/superadmin/admins/${id}`,
    data
  );

  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error("Invalid response structure: expected data property");
};
