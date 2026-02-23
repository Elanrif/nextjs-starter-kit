"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductAction } from "./product-actions";
import { productKeys } from "./use-products";

/**
 * Hook to fetch a single product by ID
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProduct(123);
 * ```
 */
export const useProduct = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductAction(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
