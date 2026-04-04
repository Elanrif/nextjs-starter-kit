import { PostCreateForm } from "@/components/features/dashboard/posts/post-create-form";

export const metadata = {
  title: "Nouveau post",
  description: "Créer un nouveau post",
};

// Pas de loading.tsx : formulaire simple, pas besoin de skeleton
// Y'a rien à cacher derrière un loader, autant afficher le formulaire directement
export default function Page() {
  return <PostCreateForm />;
}
