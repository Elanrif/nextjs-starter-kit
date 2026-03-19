"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.client.service";
import type {
  CategoryCreate,
  CategoryUpdate,
} from "@/lib/categories/models/category.model";
import type { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

// ─── Helper ───────────────────────────────────────────────────────────────────

function isCrudError(res: unknown): res is CrudApiError {
  return (
    typeof res === "object" &&
    res !== null &&
    "status" in res &&
    "message" in res
  );
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Liste complète des catégories */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const res = await fetchCategories();
      if (isCrudError(res)) throw new Error(res.message);
      return res;
    },
  });
}

/** Une catégorie par ID */
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const res = await fetchCategory(id);
      if (isCrudError(res)) throw new Error(res.message);
      return res;
    },
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Créer une catégorie */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreate) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

/** Modifier une catégorie */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

/** Supprimer une catégorie */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}
