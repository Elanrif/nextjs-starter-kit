import { ProductEditPage } from "@/components/kickstart/dashboard/products/ProductEditPage";

export const metadata = {
  title: "Edit Product",
  description: "Edit a product",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ProductEditPage id={id} />;
}
