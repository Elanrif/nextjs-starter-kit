import { CategoryDetailPage } from "@/components/kickstart/dashboard/categories/CategoryDetailPage";
import { fetchCategory } from "@/lib/categories/services/category.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Category Details",
  description: "View details of a category",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchCategory(config, Number(id));
  let category: any = null;
  if ("id" in res) {
    category = res;
  }
  return <CategoryDetailPage data={category} />;
}
