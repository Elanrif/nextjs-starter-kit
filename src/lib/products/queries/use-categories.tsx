"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesAction, fetchCategoryAction } from "./product-actions";

/**
 * Query key factory for categories
 */
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCategories();
 * ```
 */
export const useCategories = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => fetchCategoriesAction(),
    enabled: options?.enabled ?? true,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
  });
};

/**
 * Hook to fetch a single category by ID
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCategory(5);
 * ```
 */
export const useCategory = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryAction(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: 10 * 60 * 1000,
  });
};
