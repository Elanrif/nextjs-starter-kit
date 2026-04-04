import { CommentList } from "@/components/features/dashboard/comments/comment-list";

export const metadata = {
  title: "Commentaires",
  description: "Gérer les commentaires",
};

// ✅Best practices : Pas de loading.tsx, le composant PostList gère lui-même son état
// de chargement avec React Query, pas besoin d'un skeleton global pour toute la page.
export default function Page() {
  return <CommentList />;
}
