export default function Loading() {
  return (
    <div className="min-h-screen bg-edu-bg px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-edu-surface" />
        <div className="h-4 w-72 animate-pulse rounded bg-edu-surface" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="edu-card h-32 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
