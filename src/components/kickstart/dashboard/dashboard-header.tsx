import Link from "next/link";
import { SignOutButton } from "@/components/kickstart/auth/SignOutButton";
import { ROUTES } from "@/utils/routes";

export default function DashboardHeader() {
  return (
    <header className="bg-linear-to-r from-emerald-600 to-teal-500 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white drop-shadow">
            Dashboard
          </h1>
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors shadow"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-.586-1.414l-7-7a2 2 0 00-2.828 0l-7 7A2 2 0 003 7v11a2 2 0 002 2h3"
              />
            </svg>
            Accueil
          </Link>
        </div>
        <SignOutButton variant="destructive" />
      </div>
    </header>
  );
}
