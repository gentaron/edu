"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useLang } from "@/lib/use-lang"
import { QUICK_ACCESS_CARDS } from "./home-data"
import { RevealGrid, SectionHeader } from "@/platform/reveal-section"

export function QuickAccessSection() {
  const { lang } = useLang()

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealGrid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          staggerMs={100}
        >
          {QUICK_ACCESS_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="edu-glass group p-6 flex flex-col gap-3 transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-1"
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-edu-accent">{card.icon}</span>
                <span className="text-[10px] font-bold tracking-widest text-edu-accent opacity-50">
                  {card.tag}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-edu-text mb-1 flex items-center gap-1.5">
                  {lang === "en" && card.titleEn ? card.titleEn : card.title}
                  <ExternalLink className="w-3.5 h-3.5 text-edu-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-edu-muted leading-relaxed">
                  {lang === "en" && card.descEn ? card.descEn : card.desc}
                </p>
              </div>
            </Link>
          ))}
        </RevealGrid>
      </div>
    </section>
  )
}
