import { axiosInstance } from "@/lib/axios";
import { StaffSchedule } from "@/types/staff";
import { StaffScheduleFormValues } from "../schema/staffScheduleSchema";

export const updateStaffSchedule = async (
  id: number,
  data: StaffScheduleFormValues
) => {
  try {
    const response = await axiosInstance.put<{ data: StaffSchedule }>(
      `/api/admin/jadwal-khutbahs/${id}`,
      data
    );

    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error updating staff schedule:", error);

    // Log detailed error response dari Laravel
    if (error.response?.data) {
      console.error("🔍 Laravel validation errors:", error.response.data);
    }

    throw error;
  }
};
