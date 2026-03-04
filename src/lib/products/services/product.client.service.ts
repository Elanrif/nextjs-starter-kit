import { AxiosError, AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFiltersParams,
  PageProduct,
} from "@/lib/products/models/product.model";

// ============================================================================
// Products Client Service (Client-side)
// ============================================================================

/**
 * Use this service in:
 * - Client Components ('use client')
 * - React Query mutations/queries
 * - Browser-side operations
 */

// API endpoints from proxy config
const {
  api: {
    endpoints: { products: PRODUCTS_URL },
  },
} = proxyEnvironment;

// ============================================================================
// Products CRUD
// ============================================================================

/**
 * Fetch all products with optional filters (client-side)
 */
export async function fetchProducts(
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

    const res = await frontendHttp().get<
      unknown,
      AxiosResponse<PageProduct<Product[]>>
    >(url);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching products", err.response?.data);
    return {
      status: err.response?.status || 500,
      message: "Failed to fetch products",
    };
  }
}

/**
 * Fetch a single product by ID (client-side)
 */
export async function fetchProduct(
  id: number,
): Promise<Product | CrudApiError> {
  try {
    const res = await frontendHttp().get<unknown, AxiosResponse<Product>>(
      `${PRODUCTS_URL}/${id}`,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching product", err.response?.data);
    return {
      status: err.response?.status || 500,
      message: "Product not found",
    };
  }
}

/**
 * Create a new product (client-side)
 */
export async function createProduct(
  product: ProductCreate,
): Promise<Product | CrudApiError> {
  try {
    const res = await frontendHttp().post<unknown, AxiosResponse<Product>>(
      PRODUCTS_URL,
      product,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error creating product", err.response?.data);
    return {
      status: err.response?.status || 500,
      message: "Failed to create product",
    };
  }
}

/**
 * Update an existing product (client-side)
 */
export async function updateProduct(
  id: number,
  product: ProductUpdate,
): Promise<Product | CrudApiError> {
  try {
    const res = await frontendHttp().patch<unknown, AxiosResponse<Product>>(
      `${PRODUCTS_URL}/${id}`,
      product,
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error updating product", err.response?.data);
    return {
      status: err.response?.status || 500,
      message: "Failed to update product",
    };
  }
}

/**
 * Delete a product (client-side)
 */
export async function deleteProduct(
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  try {
    await frontendHttp().delete(`${PRODUCTS_URL}/${id}`);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error deleting product", err.response?.data);
    return {
      status: err.response?.status || 500,
      message: "Failed to delete product",
    };
  }
}
