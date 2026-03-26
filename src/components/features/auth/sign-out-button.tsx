"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/utils/routes";
import LoadingPage from "@/components/features/loading-page";
import { SESSION_QUERY_KEY } from "@/hooks/use.session";

interface SignOutButtonProps {
  children?: React.ReactNode;
  redirectTo?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  onSignOut?: () => void;
}

export function SignOutButton({
  children = "Sign Out",
  redirectTo = ROUTES.HOME,
  className = "",
  variant = "default",
  onSignOut,
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Use a dedicated app route that clears BOTH BA session cookie and our custom cookies.
      await fetch("/api/sign-out", { method: "POST" });

      // Completely remove session cache
      queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });

      if (onSignOut) onSignOut();

      // Force a small delay then redirect
      await new Promise((resolve) => setTimeout(resolve, 200));
      window.location.href = redirectTo;
    } catch (error) {
      console.error("[SignOut] Error:", error);
      // Even on error, try to clear cache
      queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
      setLoading(false);
    }
  };

  const variantStyles = {
    default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <>
      <LoadingPage loading={loading} text="Déconnexion en cours..." />
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2
          focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${variantStyles[variant]} ${className}`}
      >
        {loading ? "Déconnexion..." : children}
      </button>
    </>
  );
}
