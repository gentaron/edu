export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-edu-surface" />
        <div className="h-4 w-72 animate-pulse rounded bg-edu-surface" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-edu-surface" />
          ))}
        </div>
        <div className="h-px w-full bg-edu-border" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-6 animate-pulse rounded bg-edu-surface"
              style={{ width: `${60 + i * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
