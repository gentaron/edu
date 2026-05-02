"use client"

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
    console.error(error)
  }, [error])

  return (
    <html lang="ja">
      <body className="bg-edu-bg text-edu-text font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="edu-card max-w-md p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-edu-accent">
              予期せぬエラーが発生しました
            </h2>
            <p className="mb-6 text-edu-muted">
              アプリケーションで予期せぬエラーが発生しました。ページを再読み込みしてください。
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
                className="rounded-md bg-edu-surface border border-edu-border px-6 py-2 text-sm font-medium text-edu-muted hover:text-edu-text transition-colors"
              >
                ホームへ
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
