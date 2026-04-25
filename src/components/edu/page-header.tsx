"use client"
import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export function PageHeader({ icon, title, subtitle, wikiHref }: {
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  wikiHref?: string;
}) {
  return (
    <div className="relative pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-cosmic-muted hover:text-cosmic-text transition-colors mb-6">
          <ChevronLeft className="w-3 h-3" /> トップページに戻る
        </Link>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-nebula-purple/20 mb-4 glow-purple">
            {icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cosmic-gradient mb-2">{title}</h1>
          {subtitle && <p className="text-cosmic-muted text-sm max-w-xl mx-auto">{subtitle}</p>}
          {wikiHref && (
            <Link href={wikiHref} className="inline-flex items-center gap-1 text-xs text-gold-accent hover:text-gold-accent/80 mt-3 transition-colors">
              Wiki で詳しく見る →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
