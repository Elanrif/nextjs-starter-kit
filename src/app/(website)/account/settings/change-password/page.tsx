import { ChangePasswordForm } from "@/components/features/account/change-password-form";

export const metadata = {
  title: "Change Password",
  description: "Change your password",
};

export default async function Page() {
  return <ChangePasswordForm />;
}
