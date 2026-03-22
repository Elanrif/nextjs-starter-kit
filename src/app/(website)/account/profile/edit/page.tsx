"use client";

import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";
import { useAuthUser } from "@/lib/auth/context/auth.user.context";

export default function Page() {
  const { user } = useAuthUser();
  if (!user) return null;

  return <ProfileEditForm loadedUser={user} />;
}
