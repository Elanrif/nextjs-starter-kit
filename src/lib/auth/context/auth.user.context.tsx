"use client";

import { User } from "@/lib/users/models/user.model";
import { createContext, useContext, useState } from "react";

const AUTH_KEY = "auth_user";

interface AuthUserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
}

const AuthUserContext = createContext<AuthUserContextType | null>(null);

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const isLoading = false;

  const setUser = (u: User) => {
    setUserState(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  };

  const signOut = () => {
    setUserState(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthUserContext.Provider value={{ user, isLoading, setUser, signOut }}>
      {children}
    </AuthUserContext.Provider>
  );
}

export function useAuthUser(): AuthUserContextType {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useAuthUser must be used inside AuthUserProvider");
  return ctx;
}
