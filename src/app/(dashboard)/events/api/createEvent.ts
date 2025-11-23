import { axiosInstance } from "@/lib/axios";
import { Event } from "@/types/event";
import { EventFormValues } from "../schema/eventSchema";

export const createEvent = async (data: EventFormValues): Promise<Event> => {
  try {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("deskripsi", data.deskripsi);
    formData.append("category_id", data.category_id.toString());
    formData.append("tanggal_event", data.tanggal_event);
    formData.append("waktu_event", data.waktu_event);
    formData.append("tempat_event", data.tempat_event);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<{ data: Event }>(
      "/api/admin/events",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Create Event Response:", response.data);

    if (!response.data.data) {
      throw new Error("Invalid response: No data received from server");
    }

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating event:", error);
    throw error;
  }
};
