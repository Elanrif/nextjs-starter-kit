/**
 * Product Model
 * Define the product data structure
 */

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  products?: Category[];
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Category creation payload
 */
export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

/**
 * Category update payload (all fields optional)
 */
export type CategoryUpdate = Partial<CategoryCreate>;

/**
 * Category filters for listing
 */
export interface CategoryFilters {
  search?: string;
  parent_id?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Product creation payload
 */
export interface ProductCreate {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId?: number;
}

/**
 * Product update payload (all fields optional)
 */
export type ProductUpdate = Partial<ProductCreate>;

/**
 * Product filters for listing
 */
export interface ProductFiltersParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  sortBy?: string;
}

/**
 * Paginated response for products
 */
export interface PageResponseProductDTO {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
