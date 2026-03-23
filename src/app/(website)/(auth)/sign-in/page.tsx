import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { ROUTES } from "@/utils/routes";
import { SignInForm } from "@/components/features/auth/sign-in-form";
import { AuthDecoPanel } from "@/components/features/auth/auth-deco-panel";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte",
};

const { HOME, SIGN_UP } = ROUTES;

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-slate-950">
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-12">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm lg:min-w-lg">
            <Brand />
            <Heading />
            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
              <SignInForm />
            </div>
          </div>
        </div>
      </div>

      <AuthDecoPanel />
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={HOME}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10
          text-white/50 hover:text-white hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <p className="text-sm text-white/40">
        Pas encore de compte ?{" "}
        <Link
          href={SIGN_UP}
          className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 mb-8">
      <div
        className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center
          justify-center shadow-lg shadow-emerald-900/40"
      >
        <Zap className="w-4 h-4 text-white" />
      </div>
      <span className="text-white font-semibold text-sm">Kickstart</span>
    </div>
  );
}

function Heading() {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-bold text-white mb-1">Bon retour 👋</h1>
      <p className="text-sm text-white/40">Connectez-vous pour continuer</p>
    </div>
  );
}
