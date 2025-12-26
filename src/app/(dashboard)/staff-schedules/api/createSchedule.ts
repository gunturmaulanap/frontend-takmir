import { axiosInstance } from "@/lib/axios";
import { StaffSchedule } from "@/types/staff";
import { StaffScheduleFormValues } from "../schema/staffScheduleSchema";

export async function createStaffSchedule(
  data: StaffScheduleFormValues
): Promise<StaffSchedule> {
  try {
    const response = await axiosInstance.post<{ data: StaffSchedule }>(
      "/api/admin/jadwal-khutbahs",
      data
    );

    // Handle response structure dari controller Laravel
    if (!response.data.data) {
      //   return response.data.data;
      throw new Error("Invalid response format from server");
    } else {
      return response.data.data;
    }
  } catch (error: any) {
    // Log detailed error response dari Laravel

    throw error;
  }
}
