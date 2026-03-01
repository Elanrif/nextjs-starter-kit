"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import { signOut } from "./betterAuthOptions";

interface SignOutButtonProps {
  /** Text to display on the button */
  children?: React.ReactNode;
  /** URL to redirect to after sign out */
  redirectTo?: string;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: "default" | "outline" | "ghost" | "destructive";
}

/**
 * Sign Out Button Component
 *
 * A client-side button for signing out users using Better Auth.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SignOutButton />
 *
 * // With custom text
 * <SignOutButton>Log out</SignOutButton>
 *
 * // With redirect
 * <SignOutButton redirectTo="/">Sign Out</SignOutButton>
 *
 * // With custom styling
 * <SignOutButton className="bg-red-500" variant="destructive">
 *   Sign Out
 * </SignOutButton>
 * ```
 */
export function SignOutButton({
  children = "Sign Out",
  redirectTo = ROUTES.HOME,
  className = "",
  variant = "default",
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(redirectTo);
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  const variantStyles = {
    default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? "Signing out..." : children}
    </button>
  );
}
