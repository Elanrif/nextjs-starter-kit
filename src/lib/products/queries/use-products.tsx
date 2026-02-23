"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductFiltersParams } from "@/lib/products/models/product.model";
import { fetchProductsAction } from "./product-actions";

/**
 * Query key factory for products
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: ProductFiltersParams) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.all, "slug", slug] as const,
  stats: () => [...productKeys.all, "stats"] as const,
};

/**
 * Hook to fetch products list with optional filters
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProducts({ category_id: 1, page: 1 });
 * ```
 */
export const useProducts = (filters?: ProductFiltersParams) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProductsAction(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch products with custom options
 */
export const useProductsQuery = (
  filters?: ProductFiltersParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  },
) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProductsAction(filters),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });
};
