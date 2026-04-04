import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full
            bg-blue-500/20 blur-3xl"
        />

        <div className="relative flex items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="shrink-0">
            <Skeleton className="h-20 w-20 rounded-2xl" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and Role Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            {/* Email */}
            <Skeleton className="h-4 w-72" />
            {/* Member Since */}
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Status Badge (desktop) */}
          <div className="hidden md:block">
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5
              shadow-sm"
          >
            {/* Icon */}
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            {/* Label and Value */}
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Status Card (mobile) */}
      <div className="md:hidden border rounded-2xl">
        <div
          className="bg-white p-5 shadow-sm rounded-2xl border border-gray-100 flex items-center
            gap-3"
        >
          <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
