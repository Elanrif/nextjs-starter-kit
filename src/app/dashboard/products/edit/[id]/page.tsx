import { ProductEditPage } from "@/components/kickstart/dashboard/products/ProductEditPage";
import { fetchProductById } from "@/lib/products/services/product.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Edit Product",
  description: "Edit a product",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchProductById(config, Number(id));
  let fetchedProduct: any = null;
  if ("id" in res) {
    fetchedProduct = res;
  }
  return <ProductEditPage loadedProduct={fetchedProduct} />;
}
