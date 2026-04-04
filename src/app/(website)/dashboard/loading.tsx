import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero skeleton */}
      <Skeleton className="h-40 w-full bg-white rounded-2xl" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
