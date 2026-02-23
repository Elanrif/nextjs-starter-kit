"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryCreate } from "@lib/product/models/product.model";
import { createCategoryAction } from "./product-actions";
import { categoryKeys } from "./use-categories";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

/**
 * Hook to create a new category
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateCategory({
 *   onSuccess: (data) => console.log('Category created:', data),
 * });
 *
 * mutate({ name: 'New Category', slug: 'new-category' });
 * ```
 */
export const useCreateCategory = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CategoryCreate) => createCategoryAction(category),
    onSuccess: (data) => {
      logger.debug("Create category success", { data });
      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error("Create category failed", { error });
      options?.onError?.(error);
    },
  });
};
