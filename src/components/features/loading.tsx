"use client";
import { cx } from "class-variance-authority";
import { Loader2 } from "lucide-react";

type LoadingPageProps = {
  isLoading: boolean;
  setLoading?: (val: boolean) => void;
  blur?: boolean;
  text?: string;
};

export default function LoadingPage({
  isLoading,
  blur = true,
  text,
}: LoadingPageProps) {
  if (!isLoading) return null;
  return (
    <div
      className={cx(
        "fixed inset-0 z-50 flex items-center justify-center animate-fade",
        blur
          ? "bg-transparent backdrop-blur-sm"
          : "bg-linear-to-br from-emerald-100 via-white to-emerald-200",
      )}
    >
      <div className="flex flex-col items-center gap-6 p-10 bg-white/90 rounded-2xl shadow-2xl border border-emerald-200">
        <div className="relative">
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-emerald-500 drop-shadow-lg" />
          </span>
          <svg
            className="h-16 w-16 text-emerald-100 animate-pulse"
            fill="none"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-emerald-700 tracking-wide animate-fade-in">
          {text || "Chargement..."}
        </span>
        <span className="text-sm text-emerald-400 animate-pulse">
          Veuillez patienter, votre contenu arrive !
        </span>
      </div>
    </div>
  );
}
