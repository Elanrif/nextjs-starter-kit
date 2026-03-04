import { SignOutButton } from "./SignOutButton";

/**
 * User Session Display Component (Server Component)
 *
 * Displays the current user's session information.
 * This is a Server Component that fetches the session on the server.
 *
 * @example
 * ```tsx
 * // In a layout or page (Server Component)
 * import { UserSession } from "@/components/auth/UserSession";
 *
 * export default async function Layout({ children }) {
 *   return (
 *     <div>
 *       <header>
 *         <UserSession />
 *       </header>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */
export async function UserSession(req: any) {
  const session = { "user": { "name": "Elanrif", "email": "elanrif@gmail.com" } }; // mock session for testing

  if (!session?.user) {
    return (
      <div className="flex items-center gap-4">
        <a
          href="/sign-in"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </a>
        <a
          href="/sign-up"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          {session.user.name?.[0]?.toUpperCase() ||
            session.user.email?.[0]?.toUpperCase() ||
            "U"}
        </div>

        {/* User Info */}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {session.user.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
      </div>

      <SignOutButton variant="outline" className="text-sm">
        Sign Out
      </SignOutButton>
    </div>
  );
}

/**
 * User Avatar Component
 * A smaller component that just displays the user avatar
 */
export async function UserAvatar(req: any) {
  const session = { "user": { "name": "Elanrif", "email": "elanrif@gmail.com" } }; // mock session for testing

  if (!session?.user) {
    return null;
  }

  return (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
      {session.user.name?.[0]?.toUpperCase() ||
        session.user.email?.[0]?.toUpperCase() ||
        "U"}
    </div>
  );
}
