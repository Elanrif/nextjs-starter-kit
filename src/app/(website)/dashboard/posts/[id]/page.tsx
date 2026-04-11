import { notFound } from "next/navigation";
import { PostDetail } from "@/components/features/dashboard/posts/post-detail";
import { fetchPostById } from "@/lib/posts/services/post.server";

export const metadata = {
  title: "Détail post",
  description: "Voir les détails d'un post",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
// SSR is intentional here: a detail page either has data or doesn't exist.
// notFound() on the server gives a clean 404 without a client-side loading state.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const { id } = await params;

  const res = await fetchPostById(Number(id));
  if (!res.ok) notFound();

  return <PostDetail post={res.data} />;
}
