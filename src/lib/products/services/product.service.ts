"server-only";

import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
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
 * Build URL with query filters
 */
export function buildProductsUrl(
  baseUrl: string,
  filters?: ProductFiltersParams,
): string {
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }

  const params = new URLSearchParams();

  const filterEntries: Array<[keyof ProductFiltersParams, string]> = [
    ["search", "search"],
    ["categoryId", "categoryId"],
    ["sortBy", "sortBy"],
  ];

  for (const [key, param] of filterEntries) {
    if (filters[key] !== undefined) {
      params.append(param, String(filters[key]));
    }
  }

  if (filters.isActive !== undefined) {
    params.append("isActive", String(filters.isActive));
  }

  return `${baseUrl}?${params}`;
}

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  config: Config,
  filters?: ProductFiltersParams,
): Promise<Result<PageProduct<Product[]>, CrudApiError>> {
  try {
    const url = buildProductsUrl(PRODUCTS_URL, filters);

    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<PageProduct<Product[]>>
    >(url);

    logger.debug("Products fetched", { count: res.data?.content?.length || 0 });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to fetch products", { filters });
    return { ok: false, error: crudApiErrorResponse(error, "fetchProducts") };
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(
  config: Config,
  id: number,
): Promise<Result<Product, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        error: "Bad Request",
        status: 400,
        message: "Invalid product ID",
      } as CrudApiError,
    };
  }

  try {
    const res = await apiClient(true, config).get<
      unknown,
      AxiosResponse<Product>
    >(`${PRODUCTS_URL}/${id}`);

    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to fetch product", { id });
    return {
      ok: false,
      error: crudApiErrorResponse(error, "fetchProductById"),
    };
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  config: Config,
  product: ProductCreate,
): Promise<Result<Product, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  try {
    const res = await apiClient(true, config).post<
      unknown,
      AxiosResponse<Product>
    >(PRODUCTS_URL, product);

    logger.info("Product created successfully", {
      id: res.data.id,
      name: res.data.name,
    });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to create product", { productName: product.name });
    return { ok: false, error: crudApiErrorResponse(error, "createProduct") };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  config: Config,
  id: number,
  product: ProductUpdate,
): Promise<Result<Product, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        error: "Bad Request",
        status: 400,
        message: "Invalid product ID",
      } as CrudApiError,
    };
  }

  try {
    const res = await apiClient(true, config).patch<
      unknown,
      AxiosResponse<Product>
    >(`${PRODUCTS_URL}/${id}`, product);

    logger.info("Product updated successfully", { id, name: res.data.name });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to update product", { id });
    return { ok: false, error: crudApiErrorResponse(error, "updateProduct") };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  config: Config,
  id: number,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        error: "Bad Request",
        status: 400,
        message: "Invalid product ID",
      } as CrudApiError,
    };
  }

  try {
    await apiClient(true, config).delete(`${PRODUCTS_URL}/${id}`);
    logger.info("Product deleted successfully", { id });
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error("Failed to delete product", { id });
    return { ok: false, error: crudApiErrorResponse(error, "deleteProduct") };
  }
}
