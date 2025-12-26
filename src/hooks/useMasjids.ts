"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Masjid } from "@/types/masjid";
import { getMasjids } from "@/app/(dashboard)/masjid-managements/api/getMasjids";
import { updateMasjidStatus } from "@/app/(dashboard)/masjid-managements/api/updateStatusMasjid";

export const masjidKeys = {
  all: ["masjids"] as const,
  detail: (id: number) => [...masjidKeys.all, id] as const,
  lists: () => ["masjids"] as const,
};

// GET MASJIDS HOOK (with pagination)
export function useMasjids(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...masjidKeys.lists(), { page, limit }],
    queryFn: () => getMasjids(page!, limit!),
    staleTime: 5 * 1000,
    placeholderData: keepPreviousData,
  });
}

// UPDATE MASJID STATUS HOOK
export function useUpdateMasjidStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateMasjidStatus(id, isActive),
    onSuccess: (updatedMasjid, { id }) => {
      // console.log(" Masjid status updated successfully:", {
      //   id,
      //   updatedMasjid,
      // });

      // Update cache directly
      queryClient.setQueriesData(
        {
          queryKey: masjidKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((masjid: Masjid) =>
              masjid.id === id
                ? {
                    ...masjid,
                    user: masjid.user
                      ? {
                          ...masjid.user,
                          is_active: updatedMasjid.user?.is_active,
                        }
                      : undefined,
                  }
                : masjid
            ),
          };
        }
      );

      // Invalidate queries for fresh data
      queryClient.invalidateQueries({ queryKey: masjidKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`L Failed to update masjid ${id} status:`, error);
    },
  });
}
