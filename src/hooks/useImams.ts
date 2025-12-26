"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Imam } from "@/types/staff";
import {
  getImams,
  getImam,
} from "@/app/(dashboard)/staffs/api/imam/getImams";
import { createImam } from "@/app/(dashboard)/staffs/api/imam/createImam";
import { updateImam } from "@/app/(dashboard)/staffs/api/imam/updateImam";
import { deleteImam } from "@/app/(dashboard)/staffs/api/imam/deleteImam";
import { ImamFormValues } from "@/app/(dashboard)/staffs/schema/imamSchema";

// Type for update form (data only, without id)
export type ImamEditFormValues = Partial<ImamFormValues>;

export const imamKeys = {
  all: ["imams"] as const,
  lists: () => [...imamKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...imamKeys.lists(), { filters }] as const,
  details: () => [...imamKeys.all, "detail"] as const,
  detail: (id: number) => [...imamKeys.details(), id] as const,
};

export function useImams(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: [...imamKeys.lists(), { page, limit }],
    queryFn: () => getImams(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useImam(id: number) {
  return useQuery({
    queryKey: imamKeys.detail(id),
    queryFn: () => getImam(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

export function useCreateImam() {
  const queryClient = useQueryClient();

  return useMutation<Imam, Error, ImamFormValues>({
    mutationFn: async (data: ImamFormValues) => {
      return await createImam(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch imams list
      queryClient.invalidateQueries({ queryKey: imamKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating imam:", error);
    },
  });
}

export function useUpdateImam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: ImamEditFormValues;
    }) => {
      return await updateImam(id, data);
    },

    // On success: update cache optimistically like takmir
    onSuccess: (updatedImam, { id }) => {
      console.log("✅ Imam updated, updating caches:", {
        id,
        updatedImam,
      });

      queryClient.setQueriesData(
        {
          queryKey: imamKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((imam: Imam) =>
              imam.id === id ? { ...imam, ...updatedImam } : imam
            ),
          };
        }
      );
      queryClient.setQueryData(imamKeys.detail(id), updatedImam);
    },
    onError: (error) => {
      console.error("Error updating imam:", error);
    },
  });
}

export function useDeleteImam() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteImam(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: imamKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter((imam: Imam) => imam.id !== id),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: imamKeys.detail(id) });

      console.log("🗑️ Imam removed from cache smoothly");
    },
    onError: (error) => {
      console.error("❌ Error deleting imam:", error);
    },
  });
}
