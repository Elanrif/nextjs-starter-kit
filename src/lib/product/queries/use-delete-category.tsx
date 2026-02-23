"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAction } from "./product-actions";
import { categoryKeys } from "./use-categories";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

/**
 * Hook to delete a category
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteCategory({
 *   onSuccess: () => console.log('Category deleted'),
 * });
 *
 * mutate(5); // Delete category with id 5
 * ```
 */
export const useDeleteCategory = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategoryAction(id),
    onSuccess: (data, id) => {
      logger.debug("Delete category success", { id });
      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Remove the specific category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      options?.onSuccess?.();
    },
    onError: (error) => {
      logger.error("Delete category failed", { error });
      options?.onError?.(error);
    },
  });
};
