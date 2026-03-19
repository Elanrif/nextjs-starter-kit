import { ProductDetail } from "@/components/features/dashboard/products/product-detail";

export const metadata = {
  title: "Product Details",
  description: "View details of a product",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
