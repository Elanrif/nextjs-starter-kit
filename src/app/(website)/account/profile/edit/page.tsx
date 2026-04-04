import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";

export const metadata = {
  title: "Modifier mon profil",
  description: "Mettre à jour vos informations personnelles",
};

// On a triché juste pour montrer loadin.tsx sinon ❌ mauvaise pratique
// page.tsx n'est pas async et ne fait pas de fetch (await fetch) donc pas de loading.tsx
export default async function Page() {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return <ProfileEditForm />;
}
