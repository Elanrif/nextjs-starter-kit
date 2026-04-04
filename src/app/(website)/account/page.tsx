import AccountProfilePage from "@/components/features/account/account-profile-page";

export const metadata = {
  title: "Mon compte",
  description: "Gérez votre compte et vos paramètres",
};

export default async function AccountPage() {
  return <AccountProfilePage />;
}
