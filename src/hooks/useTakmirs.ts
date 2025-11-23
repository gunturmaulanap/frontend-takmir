"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Takmir } from "@/types/takmir";
import { getTakmirs } from "@/app/(dashboard)/takmirs/api/getTakmirs";
import { createTakmir } from "@/app/(dashboard)/takmirs/api/createTakmir";
import { updateTakmirStatus } from "@/app/(dashboard)/takmirs/api/updateTakmirStatus";
import { TakmirFormValues } from "@/app/(dashboard)/takmirs/schema/takmirSchema";
import { TakmirUpdateWithUserData } from "@/types/takmir";
import { updateTakmir } from "@/app/(dashboard)/takmirs/api/updateTakmir";
import { deleteTakmir } from "@/app/(dashboard)/takmirs/api/deleteTakmir";

export const takmirKeys = {
  all: ["takmirs"] as const,
  detail: (id: number) => [...takmirKeys.all, id] as const,
  lists: () => ["takmirs"] as const, // Use ["takmirs"] untuk match dengan useTakmirs()
};

// ✅ 2. GET TAKMIRS HOOK (with pagination)
export function useTakmirs(page: number = 1, limit: number = 4) {
  // Paginasi Normal
  return useQuery({
    queryKey: [...takmirKeys.lists(), { page, limit }],
    queryFn: () => getTakmirs(page!, limit!),
    staleTime: 5 * 1000,
    placeholderData: keepPreviousData, // ✅ Kunci agar tidak flicker
  });
}

export function useCreateTakmir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TakmirFormValues) => createTakmir(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: takmirKeys.lists() }),
  });
}

export function useUpdateTakmirStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateTakmirStatus(id, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: takmirKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update takmir ${id} status:`, error);
    },
  });
}

export function useUpdateTakmir() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: TakmirUpdateWithUserData;
    }) => {
      // ✅ Direct update dengan ID + User data
      return await updateTakmir(id, data);
    },
    onSuccess: (updatedTakmir, { id }) => {
      console.log("✅ Takmir updated successfully:", { id, updatedTakmir });

      queryClient.setQueriesData(
        {
          queryKey: takmirKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((takmir: Takmir) =>
              takmir.id === id ? { ...takmir, ...updatedTakmir } : takmir
            ),
          };
        }
      );

      // Also invalidate queries for fresh data
      queryClient.invalidateQueries({ queryKey: takmirKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update takmir:", error);
    },
  });
}

export function useDeleteTakmir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTakmir(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: takmirKeys.lists() }),
  });
}
