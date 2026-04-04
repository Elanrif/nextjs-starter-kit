import { CommentCreateForm } from "@/components/features/dashboard/comments/comment-create-form";

export const metadata = {
  title: "Nouveau commentaire",
  description: "Créer un nouveau commentaire",
};

// Pas de loading.tsx : formulaire simple, pas besoin de skeleton
// Y'a rien à cacher derrière un loader, autant afficher le formulaire directement
export default function Page() {
  return <CommentCreateForm />;
}
