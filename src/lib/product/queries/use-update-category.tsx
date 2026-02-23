"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryUpdate } from "@lib/product/models/product.model";
import { updateCategoryAction } from "./product-actions";
import { categoryKeys } from "./use-categories";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

interface UpdateCategoryInput {
  id: number;
  category: CategoryUpdate;
}

/**
 * Hook to update an existing category
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateCategory({
 *   onSuccess: (data) => console.log('Category updated:', data),
 * });
 *
 * mutate({ id: 5, category: { name: 'Updated Name' } });
 * ```
 */
export const useUpdateCategory = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }: UpdateCategoryInput) =>
      updateCategoryAction(id, category),
    onSuccess: (data, variables) => {
      logger.debug("Update category success", { data, id: variables.id });
      // Invalidate specific category and list
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error("Update category failed", { error });
      options?.onError?.(error);
    },
  });
};
