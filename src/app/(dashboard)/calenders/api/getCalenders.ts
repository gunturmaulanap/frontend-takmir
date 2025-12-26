import { axiosInstance } from "@/lib/axios";

// Interface untuk EventView response dari backend
export interface EventViewResponse {
  id: number;
  title: string;
  time: string | null;
  type: "event" | "jadwal_khutbah";
  description: string | null;
  related_data?: {
    category?: string;
    image?: string;
    khatib?: string;
    imam?: string;
    muadzin?: string;
    tema_khutbah?: string;
  };
  date?: string; // Tambahkan field date dari parent
  uniqueId?: string; // Untuk mencegah duplikasi
}

export interface BackendCalendarResponse {
  success: boolean;
  message: string;
  data: {
    calendar: Array<{
      date: string;
      day: number;
      events: EventViewResponse[];
    }>;
    summary: {
      year: number;
      month: number;
      month_name: string;
      total_events: number;
      total_jadwal_khutbah: number;
      total_items: number;
    };
  };
}

export const getCalenders = async (month?: number, year?: number): Promise<EventViewResponse[]> => {
  try {
    // Add month and year parameters to filter data
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());

    const response = await axiosInstance.get(`/api/admin/event-views?${params}`);

    if (response.data && response.data.success && response.data.data) {
      // Check if response has calendar structure (grouped by date)
      if (response.data.data.calendar && Array.isArray(response.data.data.calendar)) {
        const calendarData = response.data.data.calendar;
        const allEvents: EventViewResponse[] = [];

        calendarData.forEach((day: any) => {
          if (day.events && Array.isArray(day.events)) {
            day.events.forEach((event: any) => {
              // Create a unique key for later deduplication in hook
              const eventKey = `${event.type}-${event.id}`;

              // Clean and validate event data
              const cleanedEvent: EventViewResponse = {
                id: event.id,
                title: event.title || 'Untitled Event',
                time: event.time || null,
                type: event.type || 'event',
                description: event.description || null,
                related_data: event.related_data || {},
                date: day.date,
                uniqueId: eventKey
              };

              allEvents.push(cleanedEvent);
            });
          }
        });

        return allEvents;
      }

      // Fallback: if no calendar structure, return empty array
      console.warn("Unexpected response structure:", response.data);
      return [];
    }

    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("getCalenders error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch calenders"
    );
  }
};
