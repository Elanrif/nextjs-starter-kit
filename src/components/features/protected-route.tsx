"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/auth/context/auth.user.context";
import { UserRole } from "@/lib/users/models/user.model";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push(redirectTo);
      return;
    }
    if (adminOnly && user.role !== UserRole.ADMIN) {
      router.push("/account");
    }
  }, [user, isLoading, router, adminOnly, redirectTo]);

  if (isLoading || !user) return null;
  if (adminOnly && user.role !== UserRole.ADMIN) return null;

  return <>{children}</>;
}
