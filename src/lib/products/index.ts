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

// Actions
export * from "./queries/product-actions";
