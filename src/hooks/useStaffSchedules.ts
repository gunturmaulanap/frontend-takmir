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

export type StaffScheduleEditFormValues = Partial<StaffSchedule>;

export const staffScheduleKeys = {
  all: ["staff-schedules"] as const,
  lists: () => [...staffScheduleKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...staffScheduleKeys.lists(), { filters }] as const,
  details: () => [...staffScheduleKeys.all, "detail"] as const,
  detail: (id: number) => [...staffScheduleKeys.details(), id] as const,
};

export function useStaffSchedules(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: [...staffScheduleKeys.lists(), { page, limit }],
    queryFn: () => getStaffSchedules(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useDeleteStaffSchedule() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteStaffSchedule(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.lists(),
        refetchType: "all",
      });

      queryClient.removeQueries({
        queryKey: staffScheduleKeys.detail(id),
      });
    },
  });
}
