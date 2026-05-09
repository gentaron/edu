"use client"

import React from "react"
import Link from "next/link"
import { Globe2 } from "lucide-react"
import { useLang } from "@/lib/use-lang"
import { RevealSection, RevealGrid, SectionHeader } from "@/platform/reveal-section"
import { SECTION_PAGES } from "./home-data"

export function SectionGrid() {
  const { lang } = useLang()

  return (
    <section id="sections" className="py-20 px-4 relative">
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 edu-grid-bg opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <RevealSection>
          <SectionHeader
            icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
            title={
              lang === "en"
                ? "Unified Spatiotemporal Codex — Sections"
                : "統合時空構造書 — セクション一覧"
            }
            subtitle={
              lang === "en"
                ? "Navigate to detailed section pages"
                : "各セクションの詳細ページへ移動"
            }
          />
        </RevealSection>
        <RevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerMs={80}>
          {SECTION_PAGES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="edu-card edu-glow group p-6 flex flex-col gap-3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <span className="text-edu-accent">{s.icon}</span>
              <h3 className="text-sm font-bold text-edu-text mb-1">
                {lang === "en" && s.titleEn ? s.titleEn : s.title}
              </h3>
              <p className="text-xs text-edu-muted leading-relaxed">
                {lang === "en" && s.descEn ? s.descEn : s.desc}
              </p>
            </Link>
          ))}
        </RevealGrid>
      </div>
    </section>
  )
}
