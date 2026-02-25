import { CategoryDetailPage } from "@/components/kickstart/dashboard/categories/CategoryDetailPage";

export const metadata = {
  title: "Category Details",
  description: "View details of a category",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CategoryDetailPage id={id} />;
}
