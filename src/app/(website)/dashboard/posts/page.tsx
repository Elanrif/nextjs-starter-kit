import { PostList } from "@/components/features/dashboard/posts/post-list";

export const metadata = {
  title: "Posts",
  description: "Gérer les posts",
};

// ⚠️ Pas de loading.tsx : page.tsx n'est pas async et ne fait pas de fetch (await fetch)
// ✓ Pas de loading.tsx : React Query gère le chargement client
// ✓ DataTable affiche les skeletons inline via loading={isLoading}
// ✓ Cache automatique et invalidation après mutations
export default async function Page() {
  return <PostList />;
}
