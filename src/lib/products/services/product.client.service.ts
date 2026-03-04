import { AxiosResponse } from "axios";
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

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */

const {
  api: {
    endpoints: { products: PRODUCTS_URL },
  },
} = proxyEnvironment;

/**
 * Fetch all products with optional filters (client-side)
 */
export async function fetchProducts(
  filters?: ProductFiltersParams,
): Promise<PageProduct<Product[]> | CrudApiError> {
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
}

/**
 * Fetch a single product by ID (client-side)
 */
export async function fetchProduct(
  id: number,
): Promise<Product | CrudApiError> {
  const res = await frontendHttp().get<unknown, AxiosResponse<Product>>(
    `${PRODUCTS_URL}/${id}`,
  );
  return res.data;
}

/**
 * Create a new product (client-side)
 */
export async function createProduct(
  product: ProductCreate,
): Promise<Product | CrudApiError> {
  const res = await frontendHttp().post<unknown, AxiosResponse<Product>>(
    PRODUCTS_URL,
    product,
  );
  return res.data;
}

/**
 * Update an existing product (client-side)
 */
export async function updateProduct(
  id: number,
  product: ProductUpdate,
): Promise<Product | CrudApiError> {
  const res = await frontendHttp().patch<unknown, AxiosResponse<Product>>(
    `${PRODUCTS_URL}/${id}`,
    product,
  );
  return res.data;
}

/**
 * Delete a product (client-side)
 */
export async function deleteProduct(
  id: number,
): Promise<{ success: boolean } | CrudApiError> {
  await frontendHttp().delete(`${PRODUCTS_URL}/${id}`);
  return { success: true };
}
