import { axiosInstance } from "@/lib/axios";
import { Admin } from "@/types/admin";

export const updateAdminStatus = async (
  id: number,
  isActive: boolean
): Promise<Admin> => {
  try {
    console.log(
      `📤 Updating admin ${id} status to ${isActive ? "active" : "inactive"}`
    );

    const response = await axiosInstance.patch(
      `/api/superadmin/admins/${id}/status`,
      {
        is_active: isActive,
      }
    );

    console.log("📥 Backend response:", response.data);

    // Handle AdminResource format from Laravel backend
    if (response.data?.data) {
      const adminData = response.data.data;
      console.log("✅ Admin status updated successfully:", adminData);
      return adminData;
    }

    console.log("❌ Unexpected response structure:", response.data);
    throw new Error("Invalid response structure: expected data property");
  } catch (error) {
    console.error(`❌ Error updating admin ${id} status:`, error);

    // Enhanced error handling
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Failed to update admin status to ${isActive ? "active" : "inactive"}`
    );
  }
};
