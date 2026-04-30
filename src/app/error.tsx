"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-edu-bg px-4">
      <div className="edu-card max-w-md p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-edu-accent">エラーが発生しました</h2>
        <p className="mb-2 text-sm text-edu-muted">{error.message}</p>
        <p className="mb-6 text-edu-muted">
          予期せないエラーが発生しました。もう一度お試しください。
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md bg-edu-accent2 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-edu-accent2/80"
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
