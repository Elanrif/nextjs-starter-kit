import { ChangePasswordForm } from "@/components/features/account/change-password-form";

export const metadata = {
  title: "Changer le mot de passe",
  description: "Modifier votre mot de passe",
};

export default async function Page() {
  return <ChangePasswordForm />;
}
