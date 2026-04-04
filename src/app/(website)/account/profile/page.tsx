import { ProfileDetail } from "@/components/features/account/profile/profile-detail";

export const metadata = {
  title: "Mon profil",
  description: "Afficher les détails de votre profil",
};

export default async function Page() {
  return <ProfileDetail />;
}
