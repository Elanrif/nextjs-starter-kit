"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAction } from "./product-actions";
import { productKeys } from "./use-products";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

/**
 * Hook to delete a product
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteProduct({
 *   onSuccess: () => console.log('Product deleted'),
 * });
 *
 * mutate(123); // Delete product with id 123
 * ```
 */
export const useDeleteProduct = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductAction(id),
    onSuccess: (data, id) => {
      logger.debug("Delete product success", { id });
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Remove the specific product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      options?.onSuccess?.();
    },
    onError: (error) => {
      logger.error("Delete product failed", { error });
      options?.onError?.(error);
    },
  });
};
