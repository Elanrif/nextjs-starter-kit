import { ProfileEditForm } from "@/components/features/account/profile-edit-form";

export const metadata = {
  title: "Modifier mon profil",
  description: "Mettre à jour vos informations personnelles",
};

export default async function Page() {
  return <ProfileEditForm />;
}
