import { PostList } from "@/components/features/dashboard/posts/post-list";

export const metadata = {
  title: "Posts",
  description: "Gérer les posts",
};

// ✅Best practices : Pas de loading.tsx, le composant PostList gère lui-même son état
// de chargement avec React Query, pas besoin d'un skeleton global pour toute la page.
export default function Page() {
  return <PostList />;
}
