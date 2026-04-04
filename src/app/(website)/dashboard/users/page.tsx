import { UserList } from "@/components/features/dashboard/users/user-list";

export const metadata = {
  title: "Users",
  description: "Manage your users",
};

// ✅Best practices : Pas de loading.tsx, le composant PostList gère lui-même son état
// de chargement avec React Query, pas besoin d'un skeleton global pour toute la page.
export default function Page() {
  return <UserList />;
}
