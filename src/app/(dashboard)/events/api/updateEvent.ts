import { axiosInstance } from "@/lib/axios";
import { Event } from "@/types/event";
import { EventEditFormValues } from "../schema/eventSchema";

export const updateEvent = async (
  id: number,
  data: EventEditFormValues
): Promise<Event> => {
  try {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("deskripsi", data.deskripsi);
    formData.append("category_id", data.category_id.toString());
    formData.append("tanggal_event", data.tanggal_event);
    formData.append("waktu_event", data.waktu_event);
    formData.append("tempat_event", data.tempat_event);
    formData.append("_method", "PUT");

    // ✅ Tambahkan ID event untuk bypass validasi unik pada backend
    formData.append("id", id.toString());
    formData.append("event_id", id.toString());
    formData.append("exclude_id", id.toString());

    // ✅ HANYA append image jika ada DAN merupakan File object yang valid
    if (data.image && data.image instanceof File) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<{ data: Event }>(
      `/api/admin/events/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
