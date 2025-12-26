import { axiosInstance } from "@/lib/axios";
import { Admin } from "@/types/admin";

interface AdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export const getAdminById = async (id: number): Promise<Admin> => {
  const response = await axiosInstance.get<AdminResponse>(
    `/api/superadmin/admins/${id}`
  );

  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error("Invalid response structure: expected data property");
};
