import { getUserVerifiedSession, verifySession } from "@/lib/auth/session/dal.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

/**
 * Dashboard Page (Protected)
 *
 * This is a Server Component that:
 * 1. Fetches the session on the server
 * 2. Redirects to sign-in if not authenticated
 * 3. Displays user information from the session
 *
 * The middleware also protects this route, but we add a server-side
 * check as an additional security layer.
 */
export default async function DashboardPage() {
  const session = await verifySession();
  const auth = await getUserVerifiedSession();

  if ("error" in auth) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {auth.firstName?.toUpperCase() ||
              auth.email?.toUpperCase() ||
              "U"}
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {auth.firstName || "User"}!
            </h2>
            <p className="text-gray-600">{auth.email}</p>
          </div>
        </div>
      </div>

      {/* Session Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Session Information
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-sm text-gray-900">{auth.id}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="text-gray-900">{auth.email}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Name</span>
            <span className="text-gray-900">{auth.firstName || "Not set"}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Email Verified</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                auth.emailVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {auth.emailVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-600">Session Expires</span>
            <span className="text-gray-900">
              {session.expiresAt
                ? new Date(session.expiresAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/profile"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold text-gray-900">Profile</h4>
          <p className="text-sm text-gray-600">Manage your profile settings</p>
        </a>

        <a
          href="/settings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold text-gray-900">Settings</h4>
          <p className="text-sm text-gray-600">Configure your preferences</p>
        </a>

        <a
          href="/account"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold text-gray-900">Account</h4>
          <p className="text-sm text-gray-600">Manage account security</p>
        </a>
      </div>
    </div>
  );
}
