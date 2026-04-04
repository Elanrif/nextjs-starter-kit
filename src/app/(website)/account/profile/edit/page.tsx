import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Modifier mon profil",
  description: "Mettre à jour vos informations personnelles",
};

export default async function Page() {
  const res = await auth();
  if (!res.ok) {
    redirect("/sign-in?callbackUrl=/account/profile/edit");
  }

  return <ProfileEditForm user={res.data.user} />;
}
