import { AxiosError, AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "@/lib/products/models/product.model";

const {
  api: {
    rest: {
      endpoints: { categories: CATEGORIES_URL },
    },
  },
} = environment;

const logger = getLogger("server");

/**
 * Fetch all categories
 */
export async function fetchCategories(
  config: Config,
): Promise<Category[] | CrudApiError> {
  try {
    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<Category[]>
    >(CATEGORIES_URL);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error fetching categories", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to fetch categories",
    };
  }
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategory(
  config: Config,
  id: number,
): Promise<Category | CrudApiError> {
  try {
    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<Category>
    >(`${CATEGORIES_URL}/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error fetching category", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Category not found",
    };
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  config: Config,
  category: CategoryCreate,
): Promise<Category | CrudApiError> {
  try {
    const res = await apiClient(true, config).post<
      unknown,
      AxiosResponse<Category>
    >(CATEGORIES_URL, category);
    logger.info("Category created", { id: res.data.id, name: res.data.name });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error creating category", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to create category",
    };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  config: Config,
  id: number,
  category: CategoryUpdate,
): Promise<Category | CrudApiError> {
  try {
    const res = await apiClient(true, config).patch<
      unknown,
      AxiosResponse<Category>
    >(`${CATEGORIES_URL}/${id}`, category);
    logger.info("Category updated", { id, name: res.data.name });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error updating category", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to update category",
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(
  config: Config,
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  try {
    await apiClient(true, config).delete(`${CATEGORIES_URL}/${id}`);
    logger.info("Category deleted", { id });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error deleting category", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to delete category",
    };
  }
}
