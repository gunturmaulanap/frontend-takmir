"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Jamaah } from "@/types/jamaah";
import {
  getJamaahs,
  getJamaah,
} from "@/app/(dashboard)/jamaahs/api/getJamaahs";
import { createJamaah } from "@/app/(dashboard)/jamaahs/api/createJamaah";
import { updateJamaah } from "@/app/(dashboard)/jamaahs/api/updateJamaah";
import { deleteJamaah } from "@/app/(dashboard)/jamaahs/api/deleteJamaah";
import { JamaahFormValues } from "@/app/(dashboard)/jamaahs/schema/jamaahSchema";

// Type for update form (data only, without id)
export type JamaahEditFormValues = Partial<JamaahFormValues>;

// ✅ 1. QUERY KEYS - Kunci unik untuk cache
export const jamaahKeys = {
  all: ["jamaahs"] as const,
  lists: () => [...jamaahKeys.all, "list"] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...jamaahKeys.lists(), { filters }] as const,
  details: () => [...jamaahKeys.all, "detail"] as const,
  detail: (id: number) => [...jamaahKeys.details(), id] as const,
};

// ✅ 2. GET JAMAAHS HOOK
export function useJamaahs(page: number = 1, limit: number = 5) {
  // Get current user token to make query key unique per user
  return useQuery({
    queryKey: [...jamaahKeys.lists(), { page, limit }],
    queryFn: () => getJamaahs(page, limit),
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

// ✅ 2.5. GET SINGLE JAMAAH HOOK
export function useJamaah(id: number) {
  return useQuery({
    queryKey: jamaahKeys.detail(id),
    queryFn: () => getJamaah(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

// ✅ 3. CREATE JAMAAH MUTATION
export function useCreateJamaah() {
  const queryClient = useQueryClient();

  return useMutation<Jamaah, Error, JamaahFormValues>({
    mutationFn: async (data: JamaahFormValues) => {
      return await createJamaah(data);
    },
    onSuccess: () => {
      // Invalidate dan refetch jamaahs list
      queryClient.invalidateQueries({ queryKey: jamaahKeys.lists() });
    },
    onError: (error) => {
      console.error("Error creating jamaah:", error);
    },
  });
}

// ✅ 4. UPDATE JAMAAH MUTATION
export function useUpdateJamaah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: JamaahEditFormValues;
    }) => {
      return await updateJamaah(id, data);
    },

    // On success: update cache optimistically like takmir
    onSuccess: (updatedJamaah, { id }) => {
      console.log("✅ Jamaah updated, updating caches:", {
        id,
        updatedJamaah,
      });

      queryClient.setQueriesData(
        {
          queryKey: jamaahKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((jamaah: Jamaah) =>
              jamaah.id === id ? { ...jamaah, ...updatedJamaah } : jamaah
            ),
          };
        }
      );
      queryClient.setQueryData(jamaahKeys.detail(id), updatedJamaah);
    },
    onError: (error) => {
      console.error("Error updating jamaah:", error);
    },
  });
}

// ✅ 5. DELETE JAMAAH MUTATION
export function useDeleteJamaah() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteJamaah(id);
    },
    onSuccess: (_, id) => {
      // Optimistic cache update (no flicker)
      queryClient.setQueriesData(
        {
          queryKey: jamaahKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.filter((jamaah: Jamaah) => jamaah.id !== id),
          };
        }
      );

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: jamaahKeys.detail(id) });

      console.log("🗑️ Jamaah removed from cache smoothly");
    },
    onError: (error) => {
      console.error("❌ Error deleting jamaah:", error);
    },
  });
}
