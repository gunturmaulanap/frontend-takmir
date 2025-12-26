"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Asatidz } from "@/types/asatidz";
import {
  getAsatidzs,
  getAsatidz,
} from "@/app/(dashboard)/asatidzs/api/getAsatidzs";
import { createAsatidz } from "@/app/(dashboard)/asatidzs/api/createAsatidz";
import { updateAsatidz } from "@/app/(dashboard)/asatidzs/api/updateAsatidz";
import { deleteAsatidz } from "@/app/(dashboard)/asatidzs/api/deleteAsatidz";
import { AsatidzFormValues } from "@/app/(dashboard)/asatidzs/schema/asatidzSchema";

// Type for update form (data only, without id)
export type AsatidzEditFormValues = Partial<AsatidzFormValues>;

// 1. QUERY KEYS - Kunci unik untuk cache
export const asatidzKeys = {
  all: ["asatidzs"] as const,
  lists: () => [...asatidzKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...asatidzKeys.lists(), { filters }] as const,
  details: () => [...asatidzKeys.all, "detail"] as const,
  detail: (id: number) => [...asatidzKeys.details(), id] as const,
};

// 2. GET ASATIDZS HOOK
export function useAsatidzs(page: number = 1, limit: number = 10) {
  // Get current user token to make query key unique per user
  return useQuery({
    queryKey: [...asatidzKeys.lists(), { page, limit }],
    queryFn: () => getAsatidzs(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

// 2.5. GET SINGLE ASATIDZ HOOK
export function useAsatidz(id: number) {
  return useQuery({
    queryKey: asatidzKeys.detail(id),
    queryFn: () => getAsatidz(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

// 3. CREATE ASATIDZ MUTATION
export function useCreateAsatidz() {
  const queryClient = useQueryClient();

  return useMutation<Asatidz, Error, AsatidzFormValues>({
    mutationFn: async (data: AsatidzFormValues) => {
      return await createAsatidz(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch asatidzs list
      queryClient.invalidateQueries({ queryKey: asatidzKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating asatidz:", error);
    },
  });
}

// 4. UPDATE ASATIDZ MUTATION
export function useUpdateAsatidz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AsatidzEditFormValues;
    }) => {
      return await updateAsatidz(id, data);
    },

    // On success: update cache optimistically
    onSuccess: (updatedAsatidz, { id }) => {
      console.log("Asatidz updated, updating caches:", {
        id,
        updatedAsatidz,
      });

      queryClient.setQueriesData(
        {
          queryKey: asatidzKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((asatidz: Asatidz) =>
              asatidz.id === id ? { ...asatidz, ...updatedAsatidz } : asatidz
            ),
          };
        }
      );
      queryClient.setQueryData(asatidzKeys.detail(id), updatedAsatidz);
    },
    onError: (error) => {
      console.error("Error updating asatidz:", error);
    },
  });
}

// 5. DELETE ASATIDZ MUTATION
export function useDeleteAsatidz() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteAsatidz(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: asatidzKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter((asatidz: Asatidz) => asatidz.id !== id),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: asatidzKeys.detail(id) });

      console.log("Asatidz removed from cache smoothly");
    },
    onError: (error) => {
      console.error("Error deleting asatidz:", error);
    },
  });
}
