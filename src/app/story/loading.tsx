export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-48 animate-pulse rounded bg-edu-surface" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded bg-edu-surface" />
        </div>
        {/* Chapter skeleton */}
        <div className="space-y-4">
          <div className="edu-card h-32 animate-pulse" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="edu-card h-40 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
