import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";
import { auth } from "@/lib/auth/api/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Profile",
  description: "Edit my profile",
};

export default async function Page() {
  const res = await auth();
  if (!res.ok) {
    redirect("/sign-in?callbackUrl=/account/profile/edit");
  }

  return <ProfileEditForm user={res.data.user} />;
}
