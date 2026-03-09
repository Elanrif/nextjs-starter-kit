import { ProductListPage } from "@/components/kickstart/dashboard/products/ProductListPage";
import { fetchProducts } from "@/lib/products/services/product.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Products",
  description: "Manage your products",
};

export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchProducts(config);
  let initialProducts: any[] = [];
  if (!res.ok) {
    initialProducts = [];
  }

  return <ProductListPage initialProducts={initialProducts} />;
}
