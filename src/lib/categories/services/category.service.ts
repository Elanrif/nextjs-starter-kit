import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "@lib/categories/models/category.model";

// ============================================================================
// Categories API Service (Server-side)
// ============================================================================

/**
 * Use this service in:
 * - Server Components
 * - Route Handlers (API routes)
 * - Server Actions
 */

// API endpoints from environment config
const {
  api: {
    rest: {
      endpoints: { categories: CATEGORIES_URL },
    },
  },
} = environment;

const logger = getLogger("server");

// ============================================================================
// Categories CRUD
// ============================================================================

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
    logger.debug("Categories fetched", { count: res.data.length });
    return res.data;
  } catch (error) {
    logger.error("Failed to fetch categories");
    return crudApiErrorResponse(error, "fetchCategories");
  }
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategory(
  config: Config,
  id: number,
): Promise<Category | CrudApiError> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      status: 400,
      message: "Invalid category ID",
      error: "Bad Request",
    };
  }

  try {
    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<Category>
    >(`${CATEGORIES_URL}/${id}`);
    return res.data;
  } catch (error) {
    logger.error("Failed to fetch category", { id });
    return crudApiErrorResponse(error, "fetchCategory");
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  config: Config,
  category: CategoryCreate,
): Promise<Category | CrudApiError> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!category?.name) {
    return {
      status: 400,
      message: "Field `name` is required",
      error: "Bad Request",
    };
  }

  try {
    const res = await apiClient(true, config).post<
      unknown,
      AxiosResponse<Category>
    >(CATEGORIES_URL, category);
    logger.info("Category created successfully", {
      id: res.data.id,
      name: res.data.name,
    });
    return res.data;
  } catch (error) {
    logger.error("Failed to create category", { categoryName: category.name });
    return crudApiErrorResponse(error, "createCategory");
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
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      status: 400,
      message: "Invalid category ID",
      error: "Bad Request",
    };
  }

  if (Object.keys(category).length === 0) {
    return {
      status: 400,
      message: "Request body cannot be empty",
      error: "Bad Request",
    };
  }

  try {
    const res = await apiClient(true, config).patch<
      unknown,
      AxiosResponse<Category>
    >(`${CATEGORIES_URL}/${id}`, category);
    logger.info("Category updated successfully", { id, name: res.data.name });
    return res.data;
  } catch (error) {
    logger.error("Failed to update category", { id });
    return crudApiErrorResponse(error, "updateCategory");
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(
  config: Config,
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      status: 400,
      message: "Invalid category ID",
      error: "Bad Request",
    };
  }

  try {
    await apiClient(true, config).delete(`${CATEGORIES_URL}/${id}`);
    logger.info("Category deleted successfully", { id });
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete category", { id });
    return crudApiErrorResponse(error, "deleteCategory");
  }
}
