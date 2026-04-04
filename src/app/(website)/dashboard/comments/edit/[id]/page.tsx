import { notFound } from "next/navigation";
import { CommentEditForm } from "@/components/features/dashboard/comments/comment-edit-form";
import { fetchCommentById } from "@/lib/comments/services/comment.service";

export const metadata = {
  title: "Modifier commentaire",
  description: "Modifier un commentaire existant",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const { id } = await params;

  const res = await fetchCommentById(Number(id));
  if (!res.ok) notFound();

  return <CommentEditForm loadedComment={res.data} />;
}
