import { axiosInstance } from "@/lib/axios";
import { Event } from "@/types/event";

export const getEventDetail = async (id: number): Promise<Event> => {
  try {
    const response = await axiosInstance.get<{ data: Event }>(
      `/api/admin/events/${id}`
    );
    console.log("✅ Category Detail Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching category detail:", error);
    throw error;
  }
};
