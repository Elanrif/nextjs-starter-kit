import { UserList } from "@/components/features/dashboard/users/user-list";

export const metadata = {
  title: "Users",
  description: "Manage your users",
};

export default function Page() {
  return <UserList />;
}
