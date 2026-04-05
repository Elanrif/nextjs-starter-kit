import ProfileDetail from "@/components/features/account/profile/profile-detail";

export const metadata = {
  title: "Mon compte",
  description: "Gérez votre profil et vos paramètres",
};

export default async function Page() {
  return <ProfileDetail />;
}
