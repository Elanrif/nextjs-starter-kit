import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="min-h-screen p-6 space-y-6 max-w-7xl mx-auto">
      {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full
            bg-blue-500/20 blur-3xl"
        />

        <div className="relative flex items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="relative shrink-0">
            <Skeleton className="h-20 w-20 rounded-2xl" />
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name and Role */}
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            {/* Email */}
            <Skeleton className="h-4 w-80" />
            {/* Member Since */}
            <Skeleton className="h-4 w-60" />
          </div>

          {/* Edit Button (desktop) */}
          <div className="hidden md:block">
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Info Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="h-px bg-gray-50" />
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32 rounded" />
            </div>
          </div>
        </div>

        {/* Email Verification Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-4 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
