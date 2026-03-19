import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/features/dashboard/products/product-detail";
import { fetchProductById } from "@/lib/products/services/product.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Product Details",
  description: "View details of a product",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchProductById(config, Number(id));
  if (!res.ok) notFound();

  return <ProductDetail product={res.data} />;
}
