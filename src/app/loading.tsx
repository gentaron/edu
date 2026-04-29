export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-edu-surface" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="edu-card h-48 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
