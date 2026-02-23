"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCreate } from "@lib/product/models/product.model";
import { createProductAction } from "./product-actions";
import { productKeys } from "./use-products";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

/**
 * Hook to create a new product
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateProduct({
 *   onSuccess: (data) => console.log('Product created:', data),
 * });
 *
 * mutate({ name: 'New Product', price: 99.99, ... });
 * ```
 */
export const useCreateProduct = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductCreate) => createProductAction(product),
    onSuccess: (data) => {
      logger.debug("Create product success", { data });
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error("Create product failed", { error });
      options?.onError?.(error);
    },
  });
};
