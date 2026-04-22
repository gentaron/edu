"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-xl font-bold text-cosmic-text">エラーが発生しました</h2>
        <p className="text-sm text-cosmic-muted">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm rounded-lg bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple hover:bg-nebula-purple/30 transition-colors"
          >
            再試行
          </button>
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-lg bg-cosmic-surface border border-cosmic-border text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            ホームへ
          </Link>
        </div>
      </div>
    </div>
  )
}
