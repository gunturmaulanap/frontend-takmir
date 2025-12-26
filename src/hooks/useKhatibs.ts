"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Khatib } from "@/types/staff";
import {
  getKhatibs,
  getKhatib,
} from "@/app/(dashboard)/staffs/api/khatib/getKhatibs";
import { createKhatib } from "@/app/(dashboard)/staffs/api/khatib/createKhatib";
import { updateKhatib } from "@/app/(dashboard)/staffs/api/khatib/updateKhatib";
import { deleteKhatib } from "@/app/(dashboard)/staffs/api/khatib/deleteKhatib";
import { KhatibFormValues } from "@/app/(dashboard)/staffs/schema/khatibSchema";

// Type for update form (data only, without id)
export type KhatibEditFormValues = Partial<KhatibFormValues>;

export const khatibKeys = {
  all: ["khatibs"] as const,
  lists: () => [...khatibKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...khatibKeys.lists(), { filters }] as const,
  details: () => [...khatibKeys.all, "detail"] as const,
  detail: (id: number) => [...khatibKeys.details(), id] as const,
};

export function useKhatibs(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: [...khatibKeys.lists(), { page, limit }],
    queryFn: () => getKhatibs(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useKhatib(id: number) {
  return useQuery({
    queryKey: khatibKeys.detail(id),
    queryFn: () => getKhatib(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

export function useCreateKhatib() {
  const queryClient = useQueryClient();

  return useMutation<Khatib, Error, KhatibFormValues>({
    mutationFn: async (data: KhatibFormValues) => {
      return await createKhatib(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch khatibs list
      queryClient.invalidateQueries({ queryKey: khatibKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating khatib:", error);
    },
  });
}

export function useUpdateKhatib() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: KhatibEditFormValues;
    }) => {
      return await updateKhatib(id, data);
    },

    // On success: update cache optimistically like takmir
    onSuccess: (updatedKhatib, { id }) => {
      console.log("✅ Khatib updated, updating caches:", {
        id,
        updatedKhatib,
      });

      queryClient.setQueriesData(
        {
          queryKey: khatibKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((khatib: Khatib) =>
              khatib.id === id ? { ...khatib, ...updatedKhatib } : khatib
            ),
          };
        }
      );
      queryClient.setQueryData(khatibKeys.detail(id), updatedKhatib);
    },
    onError: (error) => {
      console.error("Error updating khatib:", error);
    },
  });
}

export function useDeleteKhatib() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteKhatib(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: khatibKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter((khatib: Khatib) => khatib.id !== id),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: khatibKeys.detail(id) });

      console.log("🗑️ Khatib removed from cache smoothly");
    },
    onError: (error) => {
      console.error("❌ Error deleting khatib:", error);
    },
  });
}
