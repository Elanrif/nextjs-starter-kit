import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound } from "lucide-react";

export default function ChangePasswordLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full
            bg-orange-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full
            bg-red-500/15 blur-3xl"
        />

        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/20 ring-1 ring-orange-400/30">
            <KeyRound className="w-5 h-5 text-orange-300" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-6 w-60 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
      </div>

      {/* Form Card Skeleton */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-5">
        {/* FormError */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Old Password Field */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        <div className="h-px bg-gray-100" />

        {/* New Password Field */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        {/* Password Strength Checklist Skeleton */}
        <div className="mt-3 p-3 rounded-xl space-y-1.5 bg-gray-50 border border-gray-100">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-60" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-64" />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Skeleton className="h-4 w-32 ml-auto" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <Skeleton className="flex-1 h-11 rounded-xl" />
          <Skeleton className="flex-1 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
