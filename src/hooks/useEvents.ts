"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Event } from "@/types/event";
import { getEvents } from "@/app/(dashboard)/events/api/getEvents";
import { createEvent } from "@/app/(dashboard)/events/api/createEvent";
import { updateEvent } from "@/app/(dashboard)/events/api/updateEvent";
import { deleteEvent } from "@/app/(dashboard)/events/api/deleteEvent";
import {
  EventFormValues,
  EventEditFormValues,
} from "@/app/(dashboard)/events/schema/eventSchema";
import { get } from "http";
import { getEventDetail } from "@/app/(dashboard)/events/api/getEventDetail";

// ✅ 1. QUERY KEYS - Kunci unik untuk cache
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

// ✅ 2. GET EVENTS HOOK
export function useEvents(page: number = 1, limit: number = 4) {
  // Get current user token to make query key unique per user
  return useQuery({
    queryKey: [...eventKeys.lists(), { page, limit }],
    queryFn: () => getEvents(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

// ✅ 4. CREATE EVENT MUTATION
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, EventFormValues>({
    mutationFn: async (data: EventFormValues) => {
      return await createEvent(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });
}

// ✅ 5. UPDATE EVENT MUTATION
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: EventEditFormValues;
    }) => {
      return await updateEvent(id, data);
    },

    // On success: update cache optimistically like takmir
    onSuccess: (updatedEvent, { id }) => {
      console.log("✅ Event updated, updating caches:", {
        id,
        updatedEvent,
      });

      // 1. Update ALL list cache optimistically (handle PaginatedResponse structure)
      queryClient.setQueriesData({
        queryKey: eventKeys.lists(),
        exact: false // Match ALL queries that start with eventKeys.lists()
      }, (old: any) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: old.data.map((event: Event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          )
        };
      });

      // 2. Update detail cache (if exists)
      queryClient.setQueryData(eventKeys.detail(id), updatedEvent);

      console.log("🎯 Event caches updated smoothly (no re-fetch)");
    },

    onError: (error) => {
      console.error("❌ Error updating event:", error);
    },
  });
}

// ✅ 6. DELETE EVENT MUTATION
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteEvent(id);
    },
    onSuccess: (data, id) => {
      // Invalidate semua query list yang ada.
      // Karena kita menggunakan paginasi, refetch lebih aman daripada setQueryData.
      queryClient.invalidateQueries({
        queryKey: eventKeys.lists(),
        // Force refetch semua halaman list yang ada di cache
        refetchType: "all",
      });

      // Opsional: Hapus detail event yang terhapus dari cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
    },
  });
}
