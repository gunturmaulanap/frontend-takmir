"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Admin } from "@/types/admin";
import { getAdmins } from "@/app/(dashboard)/admin-masjids/api/getAdmins";
import { updateAdminStatus } from "@/app/(dashboard)/admin-masjids/api/updateStatusAdmin";
import { getAdminById } from "@/app/(dashboard)/admin-masjids/api/getAdminById";
import { updateAdmin, UpdateAdminData } from "@/app/(dashboard)/admin-masjids/api/updateAdmin";

export const adminKeys = {
  all: ["admins"] as const,
  detail: (id: number) => [...adminKeys.all, id] as const,
  lists: () => ["admins"] as const,
};

// GET ADMINS HOOK (with pagination)
export function useAdmins(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...adminKeys.lists(), { page, limit }],
    queryFn: () => getAdmins(page!, limit!),
    staleTime: 5 * 1000,
    placeholderData: keepPreviousData,
  });
}

// GET ADMIN BY ID HOOK
export function useAdmin(id: number) {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => getAdminById(id),
    enabled: !!id,
    staleTime: 5 * 1000,
  });
}

// UPDATE ADMIN HOOK
export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdminData }) =>
      updateAdmin(id, data),
    onSuccess: (updatedAdmin, { id }) => {
      console.log("✅ Admin updated successfully:", { id, updatedAdmin });

      // Update cache directly
      queryClient.setQueriesData(
        {
          queryKey: adminKeys.detail(id),
        },
        updatedAdmin
      );

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`❌ Failed to update admin ${id}:`, error);
    },
  });
}

// UPDATE ADMIN STATUS HOOK
export function useUpdateAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateAdminStatus(id, isActive),
    onSuccess: (updatedAdmin, { id }) => {
      console.log(" Admin status updated successfully:", { id, updatedAdmin });

      // Update cache directly
      queryClient.setQueriesData(
        {
          queryKey: adminKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((admin: Admin) =>
              admin.id === id
                ? { ...admin, is_active: updatedAdmin.is_active }
                : admin
            ),
          };
        }
      );

      // Invalidate queries for fresh data
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
    onError: (error, { id }) => {
      console.error(`L Failed to update admin ${id} status:`, error);
    },
  });
}
