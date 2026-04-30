import React from "react"
import Link from "next/link"
import { Globe2 } from "lucide-react"
import { RevealSection, RevealGrid, SectionHeader } from "@/components/edu/reveal-section"
import { SECTION_PAGES } from "./home-data"

export function SectionGrid() {
  return (
    <section id="sections" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
            title="統合時空構造書 — セクション一覧"
            subtitle="各セクションの詳細ページへ移動"
          />
        </RevealSection>
        <RevealGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerMs={80}>
          {SECTION_PAGES.map((s) => (
            <Link key={s.href} href={s.href} className="edu-card group p-6 flex flex-col gap-3">
              <span className="text-edu-accent">{s.icon}</span>
              <h3 className="text-sm font-bold text-edu-text mb-1">{s.title}</h3>
              <p className="text-xs text-edu-muted leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </RevealGrid>
      </div>
    </section>
  )
}
