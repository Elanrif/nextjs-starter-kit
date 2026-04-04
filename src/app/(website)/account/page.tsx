import AccountProfilePage from "@/components/features/account/account-profile-page";

export const metadata = {
  title: "Mon compte",
  description: "Gérez votre compte et vos paramètres",
};

// On a triché juste pour montrer loadin.tsx sinon ❌ mauvaise pratique
// page.tsx n'est pas async et ne fait pas de fetch (await fetch) donc pas de loading.tsx
export default async function AccountPage() {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return <AccountProfilePage />;
}
