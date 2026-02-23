import { getLogger } from "@config/logger.config";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "@lib/product/models/product.model";
import { Page } from "@lib/shared/models/response.model";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import * as productService from "@lib/product/services/product.client.service";

const logger = getLogger();

// ============================================================================
// Products Actions
// ============================================================================

/**
 * Fetch products action
 */
export async function fetchProductsAction(
  filters?: ProductFilters,
): Promise<Page<Product[]> | CrudApiError | undefined> {
  try {
    return await productService.fetchProducts(filters);
  } catch (error) {
    logger.debug("Fetch products failed", { error });
    return undefined;
  }
}

/**
 * Fetch single product action
 */
export async function fetchProductAction(
  id: number,
): Promise<Product | CrudApiError | undefined> {
  try {
    return await productService.fetchProduct(id);
  } catch (error) {
    logger.debug("Fetch product failed", { error, id });
    return undefined;
  }
}

/**
 * Create product action
 */
export async function createProductAction(
  product: ProductCreate,
): Promise<Product | CrudApiError | undefined> {
  try {
    return await productService.createProduct(product);
  } catch (error) {
    logger.debug("Create product failed", { error });
    return undefined;
  }
}

/**
 * Update product action
 */
export async function updateProductAction(
  id: number,
  product: ProductUpdate,
): Promise<Product | CrudApiError | undefined> {
  try {
    return await productService.updateProduct(id, product);
  } catch (error) {
    logger.debug("Update product failed", { error, id });
    return undefined;
  }
}

/**
 * Delete product action
 */
export async function deleteProductAction(
  id: number,
): Promise<{ success: boolean } | CrudApiError | undefined> {
  try {
    return await productService.deleteProduct(id);
  } catch (error) {
    logger.debug("Delete product failed", { error, id });
    return undefined;
  }
}

// ============================================================================
// Category Actions
// ============================================================================

/**
 * Fetch categories action
 */
export async function fetchCategoriesAction(): Promise<
  Category[] | CrudApiError | undefined
> {
  try {
    return await productService.fetchCategories();
  } catch (error) {
    logger.debug("Fetch categories failed", { error });
    return undefined;
  }
}

/**
 * Fetch single category action
 */
export async function fetchCategoryAction(
  id: number,
): Promise<Category | CrudApiError | undefined> {
  try {
    return await productService.fetchCategory(id);
  } catch (error) {
    logger.debug("Fetch category failed", { error, id });
    return undefined;
  }
}

/**
 * Create category action
 */
export async function createCategoryAction(
  category: CategoryCreate,
): Promise<Category | CrudApiError | undefined> {
  try {
    return await productService.createCategory(category);
  } catch (error) {
    logger.debug("Create category failed", { error });
    return undefined;
  }
}

/**
 * Update category action
 */
export async function updateCategoryAction(
  id: number,
  category: CategoryUpdate,
): Promise<Category | CrudApiError | undefined> {
  try {
    return await productService.updateCategory(id, category);
  } catch (error) {
    logger.debug("Update category failed", { error, id });
    return undefined;
  }
}

/**
 * Delete category action
 */
export async function deleteCategoryAction(
  id: number,
): Promise<{ success: boolean } | CrudApiError | undefined> {
  try {
    return await productService.deleteCategory(id);
  } catch (error) {
    logger.debug("Delete category failed", { error, id });
    return undefined;
  }
}
