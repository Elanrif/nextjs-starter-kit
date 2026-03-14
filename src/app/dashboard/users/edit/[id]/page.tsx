import { UserEditPage } from "@/components/kickstart/dashboard/users/UserEditPage";
import { User } from "@/lib/user/models/user.model";
import { fetchUserById } from "@/lib/user/services/user.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Edit User",
  description: "Edit a user",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchUserById(Number(id), config);
  let fetchedUser: User | null = null;
  if (res.ok) {
    fetchedUser = res.data;
  }
  console.log("Fetched user data:", fetchedUser);
  return <UserEditPage loadedUser={fetchedUser} />;
}
