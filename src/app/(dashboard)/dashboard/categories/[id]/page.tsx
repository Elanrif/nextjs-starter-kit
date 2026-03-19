import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/features/dashboard/categories/category-detail";
import { fetchCategory } from "@/lib/categories/services/category.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Category Details",
  description: "View details of a category",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchCategory(config, Number(id));
  if (!res.ok) notFound();

  return <CategoryDetail data={res.data} />;
}
