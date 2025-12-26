"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { StaffSchedule } from "@/types/staff";
import { getStaffSchedules } from "@/app/(dashboard)/staff-schedules/api/getSchedules";
import { deleteStaffSchedule } from "@/app/(dashboard)/staff-schedules/api/deleteSchedule";
import { createStaffSchedule } from "@/app/(dashboard)/staff-schedules/api/createSchedule";
import { axiosInstance } from "@/lib/axios";
import { updateStaffSchedule } from "@/app/(dashboard)/staff-schedules/api/updateSchedule";
import { StaffScheduleFormValues } from "@/app/(dashboard)/staff-schedules/schema/staffScheduleSchema";

export type StaffScheduleEditFormValues = Partial<StaffSchedule>;

export const staffScheduleKeys = {
  all: ["staff-schedules"] as const,
  lists: () => [...staffScheduleKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...staffScheduleKeys.lists(), { filters }] as const,
  details: () => [...staffScheduleKeys.all, "detail"] as const,
  detail: (id: number) => [...staffScheduleKeys.details(), id] as const,
};

export function useStaffSchedules(page: number = 1, limit: number = 4) {
  return useQuery({
    queryKey: [...staffScheduleKeys.lists(), { page, limit }],
    queryFn: () => getStaffSchedules(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useCreateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation<StaffSchedule, Error, StaffScheduleFormValues>({
    mutationFn: async (data: StaffScheduleFormValues) => {
      return await createStaffSchedule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.lists(),
        // refetchType: "all",
      });
    },
  });
}

export function useGetStaffScheduleById(id: number) {
  return useQuery({
    queryKey: staffScheduleKeys.detail(id),
    queryFn: async () => {
      // Get individual staff schedule by ID
      const response = await axiosInstance.get<{ data: StaffSchedule }>(
        `/api/admin/jadwal-khutbahs/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: StaffScheduleFormValues;
    }) => {
      return await updateStaffSchedule(id, data);
    },
    onSuccess: (updateStaffSchedule, { id }) => {
      queryClient.setQueriesData(
        {
          queryKey: staffScheduleKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((staffSchedule: StaffSchedule) =>
              staffSchedule.id === id
                ? { ...staffSchedule, ...updateStaffSchedule }
                : staffSchedule
            ),
          };
        }
      );

      queryClient.setQueryData(
        staffScheduleKeys.detail(id),
        updateStaffSchedule
      );

      console.log("🎯 Staff schedule caches updated smoothly (no re-fetch)");
    },
    onError: (error) => {
      console.error("Error updating staff schedule:", error);
    },
  });
}

export function useDeleteStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteStaffSchedule(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: staffScheduleKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter(
              (staffSchedule: StaffSchedule) => staffSchedule.id !== id
            ),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({
        queryKey: staffScheduleKeys.detail(id),
      });
    },
    onError: (error) => {
      console.error("❌ Error deleting staff schedule:", error);
    },
  });
}
