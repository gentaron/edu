"use client"
import Link from "next/link"
import { Globe2, Star } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"

export default function UniversePage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Globe2 className="w-6 h-6 text-nebula-purple" />}
          title="宇宙・星系構造"
          subtitle="E16連星系 — M104銀河ハローに浮かぶ人類の新たな故郷"
          wikiHref="/wiki#E16連星系"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* E16 Binary Star System */}
              <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300">
                <h3 className="text-lg font-bold text-electric-blue mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />{" "}
                  <Link href="/wiki#E16連星系" className="text-electric-blue hover:underline">
                    E16連星系
                  </Link>
                </h3>
                <div className="space-y-3">
                  {[
                    ["所在", "M104銀河ハロー某所"],
                    ["主星", "Ea16（黄白色巨星）"],
                    ["伴星", "Eb16（赤色矮星）"],
                    ["主要惑星", <Link key="s" href="/wiki#シンフォニー・オブ・スターズ" className="text-cosmic-muted hover:text-electric-blue hover:underline">シンフォニー・オブ・スターズ</Link>],
                    ["自転周期", "44時間4分"],
                    ["暦法", "東暦（E暦）E1 = AD 3501"],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex gap-3 text-sm">
                      <span className="text-gold-accent font-medium shrink-0 w-20">{k}</span>
                      <span className="text-cosmic-muted">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symphony of Stars Geography */}
              <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300">
                <h3 className="text-lg font-bold text-gold-accent mb-4 flex items-center gap-2">
                  <Globe2 className="w-5 h-5" />{" "}
                  <Link href="/wiki#シンフォニー・オブ・スターズ" className="text-gold-accent hover:underline">
                    シンフォニー・オブ・スターズ
                  </Link>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* West Continent */}
                  <div className="bg-cosmic-dark/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-nebula-purple mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-nebula-purple" />
                      西大陸:{" "}
                      <Link href="/wiki#ギガポリス" className="text-nebula-purple hover:underline">
                        Gigapolis
                      </Link>
                      圈
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: "Chem", wiki: null },
                        { name: "Abrivo", wiki: null },
                        { name: "Troyane", wiki: null },
                        { name: "Ronve", wiki: null },
                        { name: "Poitiers", wiki: null },
                        { name: "Lille", wiki: null },
                        { name: "Valoria", wiki: "/wiki#Valoria連合圏" },
                        { name: "地下街", wiki: null },
                        { name: "Persepolis", wiki: null },
                      ].map((city) => (
                        <span
                          key={city.name}
                          className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted"
                        >
                          {city.wiki ? (
                            <Link href={city.wiki} className="hover:text-electric-blue hover:underline">{city.name}</Link>
                          ) : city.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* East Continent */}
                  <div className="bg-cosmic-dark/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-electric-blue mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-electric-blue" />
                      東大陸: クレセント大地方
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: "ヴァーミリオン", wiki: "/wiki#ヴァーミリオン" },
                        { name: "ブルー・ローズ", wiki: "/wiki#ブルーローズ" },
                        { name: "ミエルテンガ", wiki: "/wiki#ミエルテンガ" },
                        { name: "クロセヴィア", wiki: null },
                        { name: "SSレンジ", wiki: null },
                        { name: "アイアン・シンジケート", wiki: null },
                        { name: "SUDOM", wiki: null },
                        { name: "ファティマ連邦", wiki: null },
                        { name: "スターク三国", wiki: null },
                      ].map((city) => (
                        <span
                          key={city.name}
                          className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted"
                        >
                          {city.wiki ? (
                            <Link href={city.wiki} className="hover:text-electric-blue hover:underline">{city.name}</Link>
                          ) : city.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
