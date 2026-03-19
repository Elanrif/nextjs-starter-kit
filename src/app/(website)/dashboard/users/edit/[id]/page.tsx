import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/features/dashboard/users/user-edit-form";
import { fetchUserById } from "@/lib/users/services/user.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Edit User",
  description: "Edit a user",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchUserById(Number(id), config);
  if (!res.ok) notFound();

  return <UserEditForm loadedUser={res.data} />;
}
