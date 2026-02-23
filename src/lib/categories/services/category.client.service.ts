import { AxiosError, AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "@/lib/products/models/product.model";

// API endpoints from proxy config
const {
  api: {
    endpoints: { categories: CATEGORIES_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all categories (client-side)
 */
export async function fetchCategories(): Promise<Category[] | CrudApiError> {
  try {
    const res = await frontendHttp().get<unknown, AxiosResponse<Category[]>>(
      CATEGORIES_URL,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching categories", err.response?.data);
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to fetch categories",
    };
  }
}

/**
 * Fetch a single category by ID (client-side)
 */
export async function fetchCategory(
  id: number,
): Promise<Category | CrudApiError> {
  try {
    const res = await frontendHttp().get<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching category", err.response?.data);
    return {
      statusCode: err.response?.status || 500,
      message: "Category not found",
    };
  }
}

/**
 * Create a new category (client-side)
 */
export async function createCategory(
  category: CategoryCreate,
): Promise<Category | CrudApiError> {
  try {
    const res = await frontendHttp().post<unknown, AxiosResponse<Category>>(
      CATEGORIES_URL,
      category,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error creating category", err.response?.data);
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to create category",
    };
  }
}

/**
 * Update an existing category (client-side)
 */
export async function updateCategory(
  id: number,
  category: CategoryUpdate,
): Promise<Category | CrudApiError> {
  try {
    const res = await frontendHttp().patch<unknown, AxiosResponse<Category>>(
      `${CATEGORIES_URL}/${id}`,
      category,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error updating category", err.response?.data);
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to update category",
    };
  }
}

/**
 * Delete a category (client-side)
 */
export async function deleteCategory(
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  try {
    await frontendHttp().delete(`${CATEGORIES_URL}/${id}`);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error deleting category", err.response?.data);
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to delete category",
    };
  }
}
