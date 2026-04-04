import { CommentList } from "@/components/features/dashboard/comments/comment-list";

export const metadata = {
  title: "Commentaires",
  description: "Gérer les commentaires",
};

// ⚠️ Pas de loading.tsx : page.tsx n'est pas async et ne fait pas de fetch (await fetch)
// ✓ Pas de loading.tsx : React Query gère le chargement client
// ✓ DataTable affiche les skeletons inline via loading={isLoading}
// ✓ Cache automatique et invalidation après mutations
export default function Page() {
  return <CommentList />;
}
