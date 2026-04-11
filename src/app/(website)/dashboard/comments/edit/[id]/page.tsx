import { notFound } from "next/navigation";
import { CommentEditForm } from "@/components/features/dashboard/comments/comment-edit-form";
import { fetchCommentById } from "@/lib/comments/services/comment.server";

export const metadata = {
  title: "Modifier commentaire",
  description: "Modifier un commentaire existant",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
// SSR is intentional here: the edit form needs data immediately to pre-fill fields
// (no skeleton pattern applies cleanly to forms), and notFound() gives a proper 404
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    // Simulate a slow network for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const { id } = await params;

  const res = await fetchCommentById(Number(id));
  if (!res.ok) notFound();

  return <CommentEditForm loadedComment={res.data} />;
}
