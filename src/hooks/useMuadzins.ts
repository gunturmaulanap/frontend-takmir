"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Muadzin } from "@/types/staff";
import { getMuadzins } from "@/app/(dashboard)/staffs/api/muadzin/getMuadzins";
import { deleteMuadzin } from "@/app/(dashboard)/staffs/api/muadzin/deleteMuadzin";

export type MuadzinEditFormValues = Partial<Muadzin>;

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

export function useDeleteMuadzin() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteMuadzin(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: muadzinKeys.lists(),
        refetchType: "all",
      });

      queryClient.removeQueries({
        queryKey: muadzinKeys.detail(id),
      });
    },
  });
}
