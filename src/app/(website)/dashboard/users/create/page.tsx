import { UserCreateForm } from "@/components/features/dashboard/users/user-create-form";

export const metadata = {
  title: "Créer utilisateur",
  description: "Créer un nouvel utilisateur",
};

// Pas de loading.tsx : formulaire simple, pas besoin de skeleton
// Y'a rien à cacher derrière un loader, autant afficher le formulaire directement
export default function Page() {
  return <UserCreateForm />;
}
