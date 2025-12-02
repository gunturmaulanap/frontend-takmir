"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Khatib } from "@/types/staff";
import { getKhatibs } from "@/app/(dashboard)/staffs/api/khatib/getKhatibs";
import { deleteKhatib } from "@/app/(dashboard)/staffs/api/khatib/deleteKhatib";

export type KhatibEditFormValues = Partial<Khatib>;

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

export function useDeleteKhatib() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteKhatib(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: khatibKeys.lists(),
        refetchType: "all",
      });

      queryClient.removeQueries({
        queryKey: khatibKeys.detail(id),
      });
    },
  });
}
