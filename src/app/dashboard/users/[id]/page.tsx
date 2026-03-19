import { UserDetailPage } from "@/components/features/dashboard/users/UserDetailPage";

export const metadata = {
  title: "User Details",
  description: "View details of a user",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
}
