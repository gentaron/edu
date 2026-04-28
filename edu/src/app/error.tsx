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
    <div className="min-h-screen bg-edu-bg flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-xl font-bold text-edu-text">エラーが発生しました</h2>
        <p className="text-sm text-edu-muted">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 text-sm rounded-lg bg-edu-accent2/20 border border-edu-accent2/40 text-edu-accent2 hover:bg-edu-accent2/30 transition-colors"
          >
            再試行
          </button>
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-lg bg-edu-surface border border-edu-border text-edu-muted hover:text-edu-text transition-colors"
          >
            ホームへ
          </Link>
        </div>
      </div>
    </div>
  )
}
