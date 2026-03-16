import { ProfileDetailPage } from "@/components/kickstart/account/profile/ProfileDetailPage";
import { getSession } from "@/lib/auth/session/dal.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Details",
  description: "View details of your profile",
};

export default async function Page() {
  const auth = await getSession();
  if (!auth.ok || !auth.data) redirect("/sign-in?callbackUrl=/account/profile");
  return <ProfileDetailPage />;
}
