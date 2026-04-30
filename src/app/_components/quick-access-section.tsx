import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { QUICK_ACCESS_CARDS } from "./home-data"
import { RevealGrid } from "@/components/edu/reveal-section"

export function QuickAccessSection() {
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
              className="edu-card group p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-edu-accent">{card.icon}</span>
                <span className="text-[10px] font-bold tracking-widest text-edu-accent opacity-50">
                  {card.tag}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-edu-text mb-1 flex items-center gap-1.5">
                  {card.title}
                  <ExternalLink className="w-3.5 h-3.5 text-edu-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-edu-muted leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </RevealGrid>
      </div>
    </section>
  )
}
