import { ProfileDetailPage } from "@/components/features/account/profile/ProfileDetailPage";

export const metadata = {
  title: "Profile Details",
  description: "View details of your profile",
};

export default async function Page() {
  return <ProfileDetailPage />;
}
