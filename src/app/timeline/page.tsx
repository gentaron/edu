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
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Scroll className="w-6 h-6 text-edu-accent" />}
          title="統合年表"
          subtitle="E16連星系の人類史 — AD 3500からE528現代まで"
        />

        <RevealSection>
          <div className="max-w-4xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="edu-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-edu-accent" /> 統合年表とは
              </h2>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  E16連星系の人類史は、
                  <span className="text-edu-accent font-medium">AD 3500年の地球離脱</span>
                  から始まり、<span className="text-edu-accent2 font-medium">E528年の現代</span>
                  に至るまで、約2000年以上にわたる壮大なドラマを紡いできた。この年表は、各時代の主要な出来事を場所別に整理し、E16文明の全体像を俯瞰できるように構成されている。各時代は異なる背景色で識別され、重要な出来事には対応する場所のバッジが付与されている。
                </p>
                <p>
                  年表は大きく<span className="text-edu-text font-medium">地球時代</span>、
                  <span className="text-edu-text font-medium">開拓期</span>、
                  <span className="text-edu-text font-medium">E16文明の発展期</span>、そして
                  <span className="text-edu-text font-medium">現代（E520年代）</span>
                  の主要なフェーズに分けられる。開拓期にはテクロサス帝国やセリア・ドミニクスのような初期国家が台頭し、その後のE16文明の政治・文化・技術の基盤を形成した。E400年代のエヴァトロン弾圧は文明全体に深い傷跡を残し、その余波は現代の国際情勢にも影響を及ぼしている。
                </p>
                <p>
                  各イベントには場所情報が付与されており、対応するバッジをクリックすることで Wiki
                  の該当項目にジャンプできる。出来事の発生源となった都市や組織を視覚的に把握しながら歴史を追うことができる設計になっている。
                </p>
              </div>
            </div>

            <Accordion type="multiple" className="space-y-3">
              {TIMELINE_DATA.map((period, idx) => (
                <AccordionItem
                  key={idx}
                  value={`period-${idx}`}
                  className={`edu-card rounded-xl border ${period.borderColor} px-0 overflow-hidden transition-all duration-300`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-edu-surface/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className={`font-bold text-sm sm:text-base ${period.color}`}>
                        {period.period}
                      </span>
                      <span className="text-xs text-edu-muted">{period.range}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-2.5 ml-2 border-l-2 border-edu-border pl-4">
                      {period.events.map((ev, evIdx) => (
                        <div key={evIdx} className="flex flex-wrap gap-2 text-sm items-start">
                          <span className="text-edu-muted mt-0.5 shrink-0">▸</span>
                          {ev.loc && (
                            <Link
                              href={`/wiki#${encodeURIComponent(ev.loc)}`}
                              className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 hover:opacity-80 transition-opacity ${locColor[ev.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                            >
                              {ev.loc}
                            </Link>
                          )}
                          <span className="text-edu-text/90">{ev.text}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </RevealSection>

        <footer className="relative border-t border-edu-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="text-xs text-edu-muted hover:text-edu-accent transition-colors"
            >
              ← トップページに戻る
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
