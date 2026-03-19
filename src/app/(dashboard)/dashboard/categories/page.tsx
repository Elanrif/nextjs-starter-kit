import { CategoryList } from "@/components/features/dashboard/categories/category-list";

export const metadata = {
  title: "Categories",
  description: "Manage your categories",
};

export default function Page() {
  return <CategoryList />;
}
