import { CategoryList } from "@/components/features/dashboard/categories/category-list";
import { Category } from "@/lib/categories/models/category.model";
import { fetchCategories } from "@/lib/categories/services/category.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Categories",
  description: "Manage your categories",
};

export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  const res = await fetchCategories(config);
  let initialCategory: Category[] = [];
  if (res.ok) {
    initialCategory = res.data || [];
  }
  return <CategoryList initialCategories={initialCategory} />;
}
