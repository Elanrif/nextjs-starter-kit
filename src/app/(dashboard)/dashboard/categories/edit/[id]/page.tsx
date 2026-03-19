import { CategoryEditForm } from "@/components/features/dashboard/categories/category-edit-form";

export const metadata = {
  title: "Edit Category",
  description: "Edit an existing category",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CategoryEditForm id={id} />;
}
