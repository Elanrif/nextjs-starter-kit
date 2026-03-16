import { ProfileEditPage } from "@/components/kickstart/account/profile/ProfileEditPage";
import { getUserVerifiedSession } from "@/lib/auth/session/dal.service";

export const metadata = {
  title: "Edit Profile",
  description: "Edit my profile",
};

export default async function Page() {
  const res = await getUserVerifiedSession();
  if (!res.ok) {
    // Handle error, e.g., redirect to sign-in
    return <div>Error: Unauthorized</div>;
  }
  const user = res.data;

  return <ProfileEditPage loadedUser={user} />;
}
