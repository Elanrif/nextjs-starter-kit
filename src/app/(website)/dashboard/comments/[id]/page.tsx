import { notFound } from "next/navigation";
import { CommentDetail } from "@/components/features/dashboard/comments/comment-detail";
import { fetchCommentById } from "@/lib/comments/services/comment.server";

export const metadata = {
  title: "Détail commentaire",
  description: "Voir les détails d'un commentaire",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
// SSR is intentional here: a detail page either has data or doesn't exist.
// notFound() on the server gives a clean 404 without a client-side loading state.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const { id } = await params;
  const res = await fetchCommentById(Number(id));
  if (!res.ok) notFound();

  return <CommentDetail comment={res.data} />;
}
