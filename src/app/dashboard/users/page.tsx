import { headers } from "next/headers";
import { fetchAllUser } from "@/lib/user/services/user.service";
import { User } from "@/lib/user/models/user.model";
import { UserListPage } from "@/components/kickstart/dashboard/users/UserListPage";
import { auth } from "@/lib/auth/wrapper/auth";

export const metadata = {
  title: "Users",
  description: "Manage your users",
};

export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  const response = await auth.api.getCurrentUser();
  if (!response.ok) {
    // Handle unauthorized access, e.g., redirect to login page
    return <div>You are not authorized to view this page.</div>;
  }
  const { user } = response.data;
  // Server-side fetching
  const res = await fetchAllUser(config);
  let initialUsers: User[] = [];
  if (res.ok) {
    initialUsers = (res.data || []).filter((u) => u.id !== user.id);
  }

  return <UserListPage initialUsers={initialUsers} />;
}
