"use client"
import Link from "next/link"
import { Scroll } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { TIMELINE_DATA, locColor } from "@/lib/timeline-data"

export default function TimelinePage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Scroll className="w-6 h-6 text-gold-accent" />}
          title="統合年表"
          subtitle="E16連星系の人類史 — AD 3500からE528現代まで"
        />

        <RevealSection>
          <div className="max-w-4xl mx-auto px-4 pb-20">
            <Accordion type="multiple" className="space-y-3">
              {TIMELINE_DATA.map((period, idx) => (
                <AccordionItem
                  key={idx}
                  value={`period-${idx}`}
                  className={`glass-card rounded-xl border ${period.borderColor} px-0 overflow-hidden transition-all duration-300`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-cosmic-surface/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className={`font-bold text-sm sm:text-base ${period.color}`}>
                        {period.period}
                      </span>
                      <span className="text-xs text-cosmic-muted">{period.range}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-2.5 ml-2 border-l-2 border-cosmic-border pl-4">
                      {period.events.map((ev, evIdx) => (
                        <div key={evIdx} className="flex flex-wrap gap-2 text-sm items-start">
                          <span className="text-cosmic-muted mt-0.5 shrink-0">▸</span>
                          {ev.loc && (
                            <Link
                              href={`/wiki#${encodeURIComponent(ev.loc)}`}
                              className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 hover:opacity-80 transition-opacity ${locColor[ev.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                            >
                              {ev.loc}
                            </Link>
                          )}
                          <span className="text-cosmic-text/90">{ev.text}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </RevealSection>

        <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="text-xs text-cosmic-muted hover:text-gold-accent transition-colors">
              ← トップページに戻る
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
