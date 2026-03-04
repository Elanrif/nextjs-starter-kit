import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Session } from "@lib/auth/models/auth.model";

/**
 * Auth Client
 * Provides methods to manage authentication and session data.
 */

const SESSION_KEY = "session";

// Retrieve session from cookies
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const sessionData = Cookies.get(SESSION_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
}

// Save session to cookies
export function saveSession(session: Session): void {
  if (typeof window !== "undefined") {
    console.warn("Saving session to cookies:", session); // Debug log
    Cookies.set(SESSION_KEY, JSON.stringify(session), {
      expires: 7, // Expires in 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}

// Clear session from cookies
export function clearSession(): void {
  if (typeof window !== "undefined") {
    Cookies.remove(SESSION_KEY);
  }
}

// Hook to use authentication state
export function useAuth() {
  const [session, setSession] = useState<Session | null>(getSession());
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      // Simulate API call
      const response = await fakeLoginApi(credentials);
      saveSession(response);
      setSession(response);
    } catch (error_) {
      setError(error_ as Error);
    } finally {
      setIsPending(false);
    }
  };

  const signOut = (): void => {
    clearSession();
    setSession(null);
  };

  return { session, isPending, error, login, signOut };
}

// Simulated login API (replace with real API call)
async function fakeLoginApi(credentials: {
  username: string;
  password: string;
}): Promise<Session> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.username === "admin" &&
        credentials.password === "password"
      ) {
        resolve({
          token: "fake-jwt-token",
          user: { id: 1, name: "Admin", email: "admin@example.com" },
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
}
