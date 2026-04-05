import AccountProfile from "@/components/features/account/account-profile";

export const metadata = {
  title: "Mon compte",
  description: "Gérez votre profil et vos paramètres",
};

export default async function AccountPage() {
  return <AccountProfile />;
}
