export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Search bar skeleton */}
        <div className="mx-auto max-w-2xl">
          <div className="h-12 animate-pulse rounded-xl bg-edu-surface" />
        </div>
        {/* Category filter skeleton */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-16 animate-pulse rounded-full bg-edu-surface" />
          ))}
        </div>
        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="edu-card h-44 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
