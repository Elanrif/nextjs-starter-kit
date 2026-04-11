import { notFound } from "next/navigation";
import { PostEditForm } from "@/components/features/dashboard/posts/post-edit-form";
import { fetchPostById } from "@/lib/posts/services/post.server";

export const metadata = {
  title: "Modifier post",
  description: "Modifier un post existant",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
// SSR is intentional here: the edit form needs data immediately to pre-fill fields
// (no skeleton pattern applies cleanly to forms), and notFound() gives a proper 404
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  const { id } = await params;

  const res = await fetchPostById(Number(id));
  if (!res.ok) notFound();

  return <PostEditForm loadedPost={res.data} />;
}
