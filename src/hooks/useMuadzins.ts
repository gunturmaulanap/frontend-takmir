"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Muadzin } from "@/types/staff";
import {
  getMuadzins,
  getMuadzin,
} from "@/app/(dashboard)/staffs/api/muadzin/getMuadzins";
import { createMuadzin } from "@/app/(dashboard)/staffs/api/muadzin/createMuadzin";
import { updateMuadzin } from "@/app/(dashboard)/staffs/api/muadzin/updateMuadzin";
import { deleteMuadzin } from "@/app/(dashboard)/staffs/api/muadzin/deleteMuadzin";
import { MuadzinFormValues } from "@/app/(dashboard)/staffs/schema/muadzinSchema";

// Type for update form (data only, without id)
export type MuadzinEditFormValues = Partial<MuadzinFormValues>;

export const muadzinKeys = {
  all: ["muadzins"] as const,
  lists: () => [...muadzinKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...muadzinKeys.lists(), { filters }] as const,
  details: () => [...muadzinKeys.all, "detail"] as const,
  detail: (id: number) => [...muadzinKeys.details(), id] as const,
};

export function useMuadzins(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: [...muadzinKeys.lists(), { page, limit }],
    queryFn: () => getMuadzins(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useMuadzin(id: number) {
  return useQuery({
    queryKey: muadzinKeys.detail(id),
    queryFn: () => getMuadzin(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

export function useCreateMuadzin() {
  const queryClient = useQueryClient();

  return useMutation<Muadzin, Error, MuadzinFormValues>({
    mutationFn: async (data: MuadzinFormValues) => {
      return await createMuadzin(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch muadzins list
      queryClient.invalidateQueries({ queryKey: muadzinKeys.lists() });
    },
    onError: (error) => {},
  });
}

export function useUpdateMuadzin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: MuadzinEditFormValues;
    }) => {
      return await updateMuadzin(id, data);
    },

    // On success: update cache optimistically like takmir
    onSuccess: (updatedMuadzin, { id }) => {
      // console.log("✅ Muadzin updated, updating caches:", {
      //   id,
      //   updatedMuadzin,
      // });

      queryClient.setQueriesData(
        {
          queryKey: muadzinKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((muadzin: Muadzin) =>
              muadzin.id === id ? { ...muadzin, ...updatedMuadzin } : muadzin
            ),
          };
        }
      );
      queryClient.setQueryData(muadzinKeys.detail(id), updatedMuadzin);
    },
    onError: (error) => {
      console.error("Error updating muadzin:", error);
    },
  });
}

export function useDeleteMuadzin() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteMuadzin(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: muadzinKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter((muadzin: Muadzin) => muadzin.id !== id),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: muadzinKeys.detail(id) });

      console.log("🗑️ Muadzin removed from cache smoothly");
    },
    onError: (error) => {
      console.error("❌ Error deleting muadzin:", error);
    },
  });
}
