interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-zinc-200 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4">
      <Skeleton className="w-16 h-3 mb-2" />
      <Skeleton className="w-12 h-6 mb-1" />
      <Skeleton className="w-10 h-3" />
    </div>
  )
}
