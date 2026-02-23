"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductUpdate } from "@lib/product/models/product.model";
import { updateProductAction } from "./product-actions";
import { productKeys } from "./use-products";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

interface UpdateProductInput {
  id: number;
  product: ProductUpdate;
}

/**
 * Hook to update an existing product
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateProduct({
 *   onSuccess: (data) => console.log('Product updated:', data),
 * });
 *
 * mutate({ id: 123, product: { name: 'Updated Name', price: 149.99 } });
 * ```
 */
export const useUpdateProduct = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: UpdateProductInput) =>
      updateProductAction(id, product),
    onSuccess: (data, variables) => {
      logger.debug("Update product success", { data, id: variables.id });
      // Invalidate specific product and list
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error("Update product failed", { error });
      options?.onError?.(error);
    },
  });
};
