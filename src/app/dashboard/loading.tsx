import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-full p-4 max-w-md mx-auto pt-20">
      <Skeleton className="w-32 h-7 mb-2" />
      <Skeleton className="w-20 h-4 mb-6" />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4">
        <Skeleton className="w-24 h-4 mb-3" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
            <Skeleton className="w-14 h-3" />
            <Skeleton className="w-32 h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
