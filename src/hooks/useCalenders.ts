"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getCalenders, EventViewResponse } from "@/app/(dashboard)/calenders/api/getCalenders";

// Interface untuk Calendar Event yang cocok dengan react-big-calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: {
    type: "event" | "jadwal_khutbah";
    category?: string;
    categoryColor?: string;
    location?: string;
    description?: string;
    originalData?: EventViewResponse;
  };
}

export const calenderKeys = {
  all: ["calenders"] as const,
  lists: () => [...calenderKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...calenderKeys.lists(), { filters }] as const,
  monthly: () => [...calenderKeys.all, "monthly"] as const,
  monthlyEvents: (month: number, year: number) =>
    [...calenderKeys.monthly(), { month, year }] as const,
  details: () => [...calenderKeys.all, "detail"] as const,
  detail: (id: number) => [...calenderKeys.details(), id] as const,
};

export function useCalenders() {
  return useQuery({
    queryKey: calenderKeys.lists(),
    queryFn: () => getCalenders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

// Hook untuk calendar events dengan format yang sesuai untuk react-big-calendar
export function useCalendarEvents(month?: number, year?: number) {
  const currentMonth = month ?? new Date().getMonth() + 1;
  const currentYear = year ?? new Date().getFullYear();

  return useQuery({
    queryKey: calenderKeys.monthlyEvents(currentMonth, currentYear),
    queryFn: async (): Promise<CalendarEvent[]> => {
      const eventViews = await getCalenders(currentMonth, currentYear);

      // Use Map to prevent duplicates based on unique key
      const uniqueEvents = new Map<string, CalendarEvent>();

      eventViews.forEach((eventView) => {
        if (!eventView.date) {
          return;
        }

        // Create unique key based on type and ID
        const uniqueKey = `${eventView.type}-${eventView.id}`;

        // Skip if already processed this event
        if (uniqueEvents.has(uniqueKey)) {
          return;
        }

        // Combine date and time for start datetime
        const dateStr = eventView.date;
        const timeStr = eventView.time || "00:00";
        const eventDateTime = new Date(`${dateStr} ${timeStr}`);

        if (eventView.type === "event") {
          const calendarEvent: CalendarEvent = {
            id: uniqueKey, // Use uniqueKey instead of event-${eventView.id}
            title: eventView.title,
            start: eventDateTime,
            end: new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000), // +2 hours default
            allDay: false,
            resource: {
              type: "event",
              category: eventView.related_data?.category || "Umum",
              categoryColor: "#3B82F6", // Blue color for events
              location: "Masjid", // Default location
              description: eventView.description || "",
              originalData: eventView,
            },
          };

          uniqueEvents.set(uniqueKey, calendarEvent);

        } else if (eventView.type === "jadwal_khutbah") {
          const khatib = eventView.related_data?.khatib || "";
          const imam = eventView.related_data?.imam || "";
          const tema = eventView.related_data?.tema_khutbah || eventView.title || "Jadwal Khutbah";

          // Buat description yang lebih informatif
          let description = "";
          if (khatib) description += `Khatib: ${khatib}`;
          if (imam) description += (description ? ", " : "") + `Imam: ${imam}`;
          if (eventView.description && eventView.description !== "Khutbah Jumat") {
            description += (description ? "\n" : "") + eventView.description;
          }

          const calendarEvent: CalendarEvent = {
            id: uniqueKey, // Use uniqueKey instead of jadwal-${eventView.id}
            title: tema,
            start: eventDateTime,
            end: new Date(eventDateTime.getTime() + 1 * 60 * 60 * 1000), // +1 hour for khutbah
            allDay: false,
            resource: {
              type: "jadwal_khutbah",
              category: "Jadwal Khatib",
              categoryColor: "#10B981", // Green color for jadwal khutbah
              location: "Masjid",
              description: description || "Jadwal Khutbah Jum'at",
              originalData: eventView,
            },
          };

          uniqueEvents.set(uniqueKey, calendarEvent);
        }
      });

      const finalEvents = Array.from(uniqueEvents.values());
      return finalEvents;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    enabled: true,
  });
}

export function useCalenderDetail(id: number) {
  return useQuery({
    queryKey: calenderKeys.detail(id),
    queryFn: () => getCalenders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

// Hook untuk invalidasi calendar cache
export function useCalendarInvalidate() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: calenderKeys.all });
    },
    invalidateMonthly: (month?: number, year?: number) => {
      const currentMonth = month ?? new Date().getMonth() + 1;
      const currentYear = year ?? new Date().getFullYear();
      queryClient.invalidateQueries({
        queryKey: calenderKeys.monthlyEvents(currentMonth, currentYear)
      });
    },
  };
}
