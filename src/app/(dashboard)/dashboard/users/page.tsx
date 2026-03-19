import { headers } from "next/headers";
import { User } from "@/lib/users/models/user.model";
import { auth } from "@/lib/auth/api/auth";
import { UserList } from "@/components/features/dashboard/users/user-list";
import { fetchAllUsers } from "@/lib/users/services/user.service";

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
  const res = await fetchAllUsers(config);
  let initialUsers: User[] = [];
  if (res.ok) {
    initialUsers = (res.data || []).filter((u) => u.id !== user.id);
  }

  return <UserList initialUsers={initialUsers} />;
}
