import { CategoryEditPage } from "@/components/kickstart/dashboard/categories/CategoryEditPage";

export const metadata = {
  title: "Edit Category",
  description: "Edit an existing category",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CategoryEditPage id={id} />;
}
