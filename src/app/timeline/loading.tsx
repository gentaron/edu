export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-edu-surface" />
        <div className="h-4 w-72 animate-pulse rounded bg-edu-surface" />
        <div className="edu-card h-24 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="edu-card h-20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
