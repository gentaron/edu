import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export function PageHeader({
  icon,
  title,
  subtitle,
  wikiHref,
  extra,
}: {
  icon: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  wikiHref?: string
  extra?: ReactNode
}) {
  return (
    <div className="pt-14 sm:pt-20 pb-6 sm:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-edu-muted hover:text-edu-accent transition-colors mb-5 sm:mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> トップ
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
              <span className="text-edu-muted">{icon}</span>
              <h1 className="text-lg sm:text-2xl font-medium text-edu-text tracking-wide break-words">
                {title}
              </h1>
            </div>
            {subtitle && <p className="text-sm text-edu-muted leading-relaxed">{subtitle}</p>}
            {wikiHref && (
              <Link
                href={wikiHref}
                className="inline-flex items-center gap-1 text-sm text-edu-accent hover:text-edu-accent2 mt-3 transition-colors"
              >
                Wiki で詳しく →
              </Link>
            )}
          </div>
          {extra && <div className="shrink-0 mt-1">{extra}</div>}
        </div>
        <hr className="edu-divider mt-6 sm:mt-8" />
      </div>
    </div>
  )
}
