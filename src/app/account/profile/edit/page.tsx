import { ProfileEditPage } from "@/components/features/account/profile/ProfileEditPage";
import { _getCurrentUser } from "@/lib/auth/jose/jose.service";

export const metadata = {
  title: "Edit Profile",
  description: "Edit my profile",
};

export default async function Page() {
  const res = await _getCurrentUser();
  if (!res.ok) {
    // Handle error, e.g., redirect to sign-in
    return <div>Error: Unauthorized</div>;
  }
  const { user } = res.data;

  return <ProfileEditPage loadedUser={user} />;
}
