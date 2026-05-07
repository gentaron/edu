"use client"

import Link from "next/link"
import { Scroll } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/platform/ui/accordion"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"
import { LangToggle } from "@/platform/lang-toggle"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"
import { TIMELINE_DATA, locColor } from "@/lib/timeline-data"

export default function TimelinePage() {
  const { lang, setLang } = useLang()

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Scroll className="w-6 h-6 text-edu-accent" />}
        title={tl("統合年表", "Integrated Timeline", lang)}
        subtitle={
          lang === "en"
            ? "Human history of the E16 binary system — From AD 3500 to the present E528"
            : "E16連星系の人類史 — AD 3500からE528現代まで"
        }
        extra={<LangToggle lang={lang} setLang={setLang} />}
      />

      <RevealSection>
        <div className="max-w-4xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-edu-accent" />{" "}
              {tl("統合年表とは", "About This Timeline", lang)}
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              {lang === "en" ? (
                <>
                  <p>
                    The human history of the E16 binary system spans a grand drama of over 2,000
                    years, beginning with{" "}
                    <span className="text-edu-accent font-medium">
                      humanity's departure from Earth in AD 3500
                    </span>{" "}
                    and continuing to the{" "}
                    <span className="text-edu-accent2 font-medium">present in E528</span>. This
                    timeline organizes major events by location across each era, providing a
                    bird's-eye view of the entire E16 civilization. Each era is identified by a
                    different background color, and corresponding location badges are attached to
                    important events.
                  </p>
                  <p>
                    The timeline is broadly divided into the{" "}
                    <span className="text-edu-text font-medium">Earth Era</span>,{" "}
                    <span className="text-edu-text font-medium">Colonization Period</span>,{" "}
                    <span className="text-edu-text font-medium">
                      E16 Civilization's Development
                    </span>
                    , and the <span className="text-edu-text font-medium">Present Day (E520s)</span>
                    . During the Colonization Period, early states like{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Tekrosas Empire
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("セリア・ドミニクス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Celia Dominicus
                    </Link>{" "}
                    rose to power, forming the political, cultural, and technological foundations of
                    E16 civilization. The{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("エヴァトロン")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Evatron suppression
                    </Link>{" "}
                    in the E400s left deep scars across the civilization, with repercussions still
                    affecting modern international affairs.
                  </p>
                  <p>
                    Each event includes location information, and clicking the corresponding badge
                    jumps to the relevant Wiki entry. The design allows you to trace history while
                    visually tracking the cities and organizations that spawned each event.
                  </p>
                </>
              ) : (
                <>
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
                    の主要なフェーズに分けられる。開拓期には
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      テクロサス帝国
                    </Link>
                    や
                    <Link
                      href={`/wiki/${encodeURIComponent("セリア・ドミニクス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      セリア・ドミニクス
                    </Link>
                    のような初期国家が台頭し、その後のE16文明の政治・文化・技術の基盤を形成した。E400年代の
                    <Link
                      href={`/wiki/${encodeURIComponent("エヴァトロン")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      エヴァトロン弾圧
                    </Link>
                    は文明全体に深い傷跡を残し、その余波は現代の国際情勢にも影響を及ぼしている。
                  </p>
                  <p>
                    各イベントには場所情報が付与されており、対応するバッジをクリックすることで Wiki
                    の該当項目にジャンプできる。出来事の発生源となった都市や組織を視覚的に把握しながら歴史を追うことができる設計になっている。
                  </p>
                </>
              )}
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
                      {lang === "en" && period.periodEn ? period.periodEn : period.period}
                    </span>
                    <span className="text-xs text-edu-muted">
                      {lang === "en" && period.rangeEn ? period.rangeEn : period.range}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2.5 ml-2 border-l-2 border-edu-border pl-4">
                    {period.events.map((ev, evIdx) => (
                      <div key={evIdx} className="flex flex-wrap gap-2 text-sm items-start">
                        <span className="text-edu-muted mt-0.5 shrink-0">▸</span>
                        {ev.loc && (
                          <Link
                            href={`/wiki/${encodeURIComponent(ev.loc)}`}
                            className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 hover:opacity-80 transition-opacity ${locColor[ev.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                          >
                            {ev.loc}
                          </Link>
                        )}
                        <span className="text-edu-text/90">
                          {lang === "en" ? ev.textEn : ev.text}
                        </span>
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
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-accent transition-colors">
            ← {tl("トップページに戻る", "Back to top page", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
