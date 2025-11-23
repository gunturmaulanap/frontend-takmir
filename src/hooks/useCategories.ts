/**
 * ============================================
 * CATEGORY HOOKS dengan TANSTACK QUERY
 * ============================================
 * Custom hooks untuk manage category data dengan caching
 * - useCategories: Fetch all categories
 * - useCategory: Fetch single category
 * - useCreateCategory: Create new category
 * - useUpdateCategory: Update existing category
 * - useDeleteCategory: Delete category
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { Category } from "@/types/category";
import { getCategories } from "@/app/(dashboard)/categories/api/getCategories";
import { getCategoryDetail } from "@/app/(dashboard)/categories/api/getCategoryDetail";
import { createCategory } from "@/app/(dashboard)/categories/api/createCategory";
import { updateCategory } from "@/app/(dashboard)/categories/api/updateCategory";
import { deleteCategory } from "@/app/(dashboard)/categories/api/deleteCategory";
import { CategoryFormValues } from "@/app/(dashboard)/categories/schema/categorySchema";

export const categoryKeys = {
  all: ["categories"] as const, // Base key
  lists: () => [...categoryKeys.all, "list"] as const, // List key
  list: (filters: Record<string, string | number | boolean>) =>
    [...categoryKeys.lists(), { filters }] as const, // Filtered list
  details: () => [...categoryKeys.all, "detail"] as const, // Detail base
  detail: (id: number) => [...categoryKeys.details(), id] as const, // Specific category by ID
};

export function useCategories(page: number = 1, limit: number = 6) {
  // Get current user token to make query key unique per user

  return useQuery({
    queryKey: [...categoryKeys.lists(), { page, limit }],
    queryFn: () => getCategories(page, limit),
    staleTime: 5 * 60 * 1000, // Fresh for 5 mins
    gcTime: 10 * 60 * 1000, // Cache for 10 mins
    retry: 2, // Retry 2x on fail
    retryDelay: 1000, // 1s between retries
    placeholderData: keepPreviousData,
  });
}

//get category detail by ID (for edit/detail pages)
export function useCategoryDetail(id: number) {
  return useQuery({
    queryKey: [...categoryKeys.detail(id)],
    queryFn: () => getCategoryDetail(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // Only run if ID exists
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      return await createCategory(data);
    },

    // On success: invalidate list to trigger refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },

    // On error: log error
    onError: (error) => {
      console.error("❌ Error creating category:", error);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CategoryFormValues;
    }) => {
      return await updateCategory(id, data);
    },

    // On success: minimal cache invalidation (no flicker)
    onSuccess: (updatedCategory, { id }) => {
      console.log("✅ Category updated, updating caches:", {
        id,
        updatedCategory,
      });

      queryClient.setQueriesData(
        {
          queryKey: categoryKeys.lists(),
          exact: false,
        },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((cat: Category) =>
              cat.id === id ? { ...cat, ...updatedCategory } : cat
            ),
          };
        }
      );

      // 2. Update detail cache (if exists)
      queryClient.setQueryData(categoryKeys.detail(id), updatedCategory);

      console.log("🎯 Category caches updated smoothly (no re-fetch)");
    },

    onError: (error) => {
      console.error("❌ Error updating category:", error);
    },
  });
}

/**ke
 * ============================================
 * 5. DELETE CATEGORY MUTATION
 * ============================================
 * Hook untuk delete category
 * - Remove from cache completely
 * - Invalidate list
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteCategory(id);
    },

    // On success: optimistic cache update (no flicker)
    onSuccess: (_, id) => {
      // Remove category from list cache instantly
      queryClient.setQueryData(categoryKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.filter((cat: Category) => cat.id !== id);
      });

      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });

      console.log("🗑️ Category removed from cache smoothly");
    },

    onError: (error) => {
      console.error("❌ Error deleting category:", error);
    },
  });
}
