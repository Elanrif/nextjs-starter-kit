"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CategoryCreate,
  CategoryUpdate,
} from "@/lib/categories/models/category.model";
import {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.client.service";
import { getLogger } from "@config/logger.config";

/**
 * Query key factory for categories
 */
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch categories list
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

const logger = getLogger();

/**
 * Hook to create a new category
 */
export const useCreateCategory = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: CategoryCreate) => createCategory(category),
    onSuccess: (data) => {
      logger.debug("Create category success", { data });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error("Create category failed", { error });
      options?.onError?.(error);
    },
  });
};

interface UpdateCategoryInput {
  id: number;
  category: CategoryUpdate;
}

/**
 * Hook to update an existing category
 */
export const useUpdateCategory = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: UpdateCategoryInput) =>
      updateCategory(id, category),
    onSuccess: (data, variables) => {
      logger.debug("Update category success", { data, id: variables.id });
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

/**
 * Hook to delete a category
 */
export const useDeleteCategory = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (data, id) => {
      logger.debug("Delete category success", { id });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      options?.onSuccess?.();
    },
    onError: (error) => {
      logger.error("Delete category failed", { error });
      options?.onError?.(error);
    },
  });
};
