import {
  getSession,
  getUserVerifiedSession,
} from "@/lib/auth/session/dal.service";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account",
  description: "My personal account settings",
};

/**
 * Account Page (Protected)
 *
 * This is a Server Component that:
 * 1. Fetches the session on the server
 * 2. Redirects to sign-in if not authenticated
 * 3. Displays user information from the session
 *
 * The middleware also protects this route, but we add a server-side
 * check as an additional security layer.
 */
export default async function AccountPage() {
  const session = await getSession();
  const auth = await getUserVerifiedSession();

  if (!session.ok || !auth.ok) {
    redirect("/sign-in?callbackUrl=/account");
  }
  return (
    <div className="w-full min-h-[80vh] max-w-6xl mx-auto p-6 bg-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile card */}
        <div className="lg:col-span-2">
          <div className="bg-linear-to-r from-white via-slate-50 to-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {auth.data.firstName?.toUpperCase()?.slice(0, 2) ||
                  auth.data.email?.slice(0, 2)?.toUpperCase() ||
                  "U"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {auth.data.firstName || "User"}
                  </h1>
                  <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold">
                    {auth.data.role || "User"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{auth.data.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since:{" "}
                  {auth.data.createdAt
                    ? new Date(auth.data.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end gap-3">
                <a
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
                >
                  Edit profile
                </a>
                <a
                  href="/settings"
                  className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Settings
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-sm font-semibold text-gray-700">Session</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Session expires</span>
                  <span className="font-mono text-gray-900">
                    {session.data?.expiresAt
                      ? new Date(session.data.expiresAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>User ID</span>
                  <span className="font-mono text-gray-900">
                    {auth.data.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Verification
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {auth.data.email}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${auth.data.emailVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {auth.data.emailVerified ? "Verified" : "Not verified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar actions */}
        <aside className="space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Quick actions
            </h4>
            <div className="mt-3 flex flex-col gap-3">
              <a
                href="/profile"
                className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                View profile
              </a>
              <a
                href="/account/security"
                className="w-full text-center px-4 py-2 border border-slate-200 rounded-lg"
              >
                Security
              </a>
              <a
                href="/support"
                className="w-full text-center px-4 py-2 border border-slate-200 rounded-lg"
              >
                Contact support
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="text-sm font-semibold text-gray-700">Activity</h4>
            <p className="text-sm text-gray-500 mt-2">No recent activity</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
