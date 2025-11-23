import { axiosInstance } from "@/lib/axios";

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/admin/events/${id}`);
  } catch (error) {
    throw error;
  }
};
