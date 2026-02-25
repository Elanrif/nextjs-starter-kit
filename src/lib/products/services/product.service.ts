import { AxiosError, AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFiltersParams,
  PageProduct,
} from "@/lib/products/models/product.model";

// ============================================================================
// Products API Service (Server-side)
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
      endpoints: { products: PRODUCTS_URL },
    },
  },
} = environment;

const logger = getLogger("server");

// ============================================================================
// Products CRUD
// ============================================================================

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  config: Config,
  filters?: ProductFiltersParams,
): Promise<PageProduct<Product[]> | CrudApiError> {
  try {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.categoryId)
      params.append("categoryId", String(filters.categoryId));
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const url = params.toString() ? `${PRODUCTS_URL}?${params}` : PRODUCTS_URL;

    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<PageProduct<Product[]>>
    >(url);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error fetching products", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to fetch products",
    };
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(
  config: Config,
  id: number,
): Promise<Product | CrudApiError> {
  try {
    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<Product>
    >(`${PRODUCTS_URL}/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error fetching product", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Product not found",
    };
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  config: Config,
  product: ProductCreate,
): Promise<Product | CrudApiError> {
  try {
    const res = await apiClient(true, config).post<
      unknown,
      AxiosResponse<Product>
    >(PRODUCTS_URL, product);
    logger.info("Product created", { id: res.data.id, name: res.data.name });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error creating product", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to create product",
    };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  config: Config,
  id: number,
  product: ProductUpdate,
): Promise<Product | CrudApiError> {
  try {
    const res = await apiClient(true, config).patch<
      unknown,
      AxiosResponse<Product>
    >(`${PRODUCTS_URL}/${id}`, product);
    logger.info("Product updated", { id, name: res.data.name });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error updating product", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to update product",
    };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  config: Config,
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  try {
    await apiClient(true, config).delete(`${PRODUCTS_URL}/${id}`);
    logger.info("Product deleted", { id });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error deleting product", {
      id,
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to delete product",
    };
  }
}
