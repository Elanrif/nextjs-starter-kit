import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full
            bg-blue-500/20 blur-3xl"
        />

        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
            <Pencil className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-6 w-52 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Form Card Skeleton */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-5">
        {/* FormError */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Avatar Section */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="pt-1 flex gap-4 items-start">
            <Skeleton className="h-32 w-32 rounded-xl" />
            <div className="flex-1 space-y-2 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* FirstName Field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* LastName Field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Skeleton className="flex-1 h-11 rounded-xl" />
          <Skeleton className="flex-1 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
