import { ProductDetailPage } from "@/components/kickstart/dashboard/products/ProductDetailPage";

export const metadata = {
  title: "Product Details",
  description: "View details of a product",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ProductDetailPage id={id} />;
}
