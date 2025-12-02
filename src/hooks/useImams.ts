"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Imam } from "@/types/staff";
import { getImams } from "@/app/(dashboard)/staffs/api/imam/getImams";
import { ImamFormValues } from "@/app/(dashboard)/staffs/schema/imamSchema";
import { deleteImam } from "@/app/(dashboard)/staffs/api/imam/deleteImam";

export type ImamEditFormValues = Partial<Imam>;

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

export function useDeleteImam() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return await deleteImam(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: imamKeys.lists(),
        refetchType: "all",
      });

      queryClient.removeQueries({
        queryKey: imamKeys.detail(id),
      });
    },
  });
}
