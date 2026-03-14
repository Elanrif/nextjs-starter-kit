import { headers } from "next/headers";
import { fetchAllUser } from "@/lib/user/services/user.service";
import { User } from "@/lib/user/models/user.model";
import { UserListPage } from "@/components/kickstart/dashboard/users/UserListPage";

export const metadata = {
  title: "Users",
  description: "Manage your users",
};

export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  // Server-side fetching
  const res = await fetchAllUser(config);
  let initialUsers: User[] = [];
  if (res.ok) {
    initialUsers = res.data || [];
  }

  return <UserListPage initialUsers={initialUsers} />;
}
