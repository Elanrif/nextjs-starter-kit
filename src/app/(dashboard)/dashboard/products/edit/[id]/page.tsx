import { notFound } from "next/navigation";
import { ProductEditForm } from "@/components/features/dashboard/products/product-edit-form";
import { fetchProductById } from "@/lib/products/services/product.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Edit Product",
  description: "Edit a product",
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

  return <ProductEditForm loadedProduct={res.data} />;
}
