// Models
export * from "./models/product.model";

// Services (Server-side)
export * as productService from "./services/product.service";

// Services (Client-side)
export * as productClientService from "./services/product.client.service";

// React Query Hooks
export {
  useProducts,
  useProductsQuery,
  productKeys,
} from "./queries/use-products";
export { useProduct } from "./queries/use-product";
export { useCreateProduct } from "./queries/use-create-product";
export { useUpdateProduct } from "./queries/use-update-product";
export { useDeleteProduct } from "./queries/use-delete-product";
export {
  useCategories,
  useCategory,
  categoryKeys,
} from "./queries/use-categories";
export { useCreateCategory } from "./queries/use-create-category";
export { useUpdateCategory } from "./queries/use-update-category";
export { useDeleteCategory } from "./queries/use-delete-category";

// Actions
export * from "./queries/product-actions";
