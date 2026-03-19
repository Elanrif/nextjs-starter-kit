import { fetchProducts } from "@/lib/products/services/product.service";
import { headers } from "next/headers";
import { Product } from "@/lib/products/models/product.model";
import { ProductList } from "@/components/features/dashboard/products/product-list";

export const metadata = {
  title: "Products",
  description: "Manage your products",
};

export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchProducts(config);
  let initialProducts: Product[] = [];
  if (res.ok) {
    initialProducts = res.data.content || [];
  }

  return <ProductList initialProducts={initialProducts} />;
}
