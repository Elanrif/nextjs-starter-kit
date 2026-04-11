import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/features/dashboard/users/user-edit-form";
import { fetchUserById } from "@/lib/users/services/user.server";

export const metadata = {
  title: "Edit User",
  description: "Edit a user",
};

// ✅ loading.tsx est nécessaire à cause du fetch côté serveur (SSR)
// SSR is intentional here: the edit form needs data immediately to pre-fill fields
// (no skeleton pattern applies cleanly to forms), and notFound() gives a proper 404
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "development") {
    // Simulate a slow network for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const { id } = await params;

  const res = await fetchUserById(Number(id));
  if (!res.ok) notFound();

  return <UserEditForm loadedUser={res.data} />;
}
