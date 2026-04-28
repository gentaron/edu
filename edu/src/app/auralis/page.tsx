import Link from "next/link"
import { Sparkles } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"

export default function AuralisPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Sparkles className="w-6 h-6 text-edu-accent2" />}
          title={
            <Link href="/wiki/AURALIS" className="text-edu-text hover:underline">
              AURALIS Collective
            </Link>
          }
          subtitle="「光と音を永遠にする — Where Light and Sound Become Eternal」"
          wikiHref="/wiki/AURALIS"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="edu-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-edu-accent2" /> AURALIS Collective とは
              </h2>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  <span className="text-edu-accent2 font-medium">AURALIS Collective</span>
                  は、E16連星系における最重要の芸術・文化組織である。その理念は「光と音を永遠にする」であり、音楽・視覚芸術・文学を中心に、E16文明の文化的アイデンティティを形成し続けてきた。AURALIS
                  は単なる芸術集団ではなく、政治的影響力も持ち、歴史上度々権力との対立を経験してきた。
                </p>
                <p>
                  <span className="text-edu-accent2 font-medium">第一世代（E290〜E420）</span>は
                  Kate Claudia と Lily Steiner
                  を中心に創設され、セリア・ドミニクスの黄金期に最盛期を迎えた。しかし、E400年のエヴァトロン弾圧により組織は解体され、創設者たちは逮捕・消息不明となった。唯一、Layla
                  Virell Nova は冷凍保存によって時を超え、第二世代への橋渡し役となる。
                </p>
                <p>
                  <span className="text-edu-accent2 font-medium">第二世代（E522〜現在）</span>
                  は5人のメンバーで構成され、現代のE16文明において文化的・技術的な中核を担っている。Kate
                  Patton、Lillie Ardent、Layla Virell Nova（冷凍保存からの復活）、Mina Eureka
                  Ernst（AI研究員）、Ninny Offenbach（原初個体はAlpha
                  Kane時代に別惑星へ離脱、クローン技術で遺伝子継承ののち再帰還）の5人は、それぞれが独自の背景と能力を持ち、AURALIS
                  を新たな段階へと導いている。
                </p>
              </div>
            </div>

            {/* AURALIS Group Image Banner */}
            <div className="edu-card rounded-xl overflow-hidden mb-8">
              <div className="relative">
                <img
                  src="/edu-aurali.png"
                  alt="AURALIS Collective"
                  className="w-full h-64 sm:h-80 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-edu-bg via-edu-bg/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-edu-accent2/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-edu-accent2" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-edu-text">AURALIS Collective</p>
                      <p className="text-xs text-edu-muted">第二世代 — E522〜現在</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* First Generation */}
              <div className="edu-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative h-40 bg-gradient-to-br from-edu-accent2/30 to-edu-accent2/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-edu-accent2/50">I</span>
                    <p className="text-xs text-edu-muted mt-1">FIRST GENERATION</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-edu-accent2">
                    第一世代{" "}
                    <span className="text-xs text-edu-muted font-normal">E290〜E420</span>
                  </h3>
                  <div className="space-y-2 text-sm text-edu-muted">
                    <p>
                      <span className="text-edu-text">E270頃:</span> AURALIS Proto（
                      <Link
                        href="/wiki/Diana"
                        className="text-edu-muted hover:text-edu-accent2 hover:underline"
                      >
                        Diana
                      </Link>
                      時代の前身組織）
                    </p>
                    <p>
                      <span className="text-edu-text">E290:</span> 正式組織化
                    </p>
                    <p>
                      <span className="text-edu-text">創設者:</span>{" "}
                      <Link
                        href="/wiki/Kate Claudia"
                        className="text-edu-muted hover:text-edu-accent2 hover:underline"
                      >
                        Kate Claudia
                      </Link>
                      ,{" "}
                      <Link
                        href="/wiki/Lily Steiner"
                        className="text-edu-muted hover:text-edu-accent2 hover:underline"
                      >
                        Lily Steiner
                      </Link>
                    </p>
                    <p>
                      <span className="text-edu-text">参加:</span>{" "}
                      <Link
                        href="/wiki/レイラ・ヴィレル・ノヴァ"
                        className="text-edu-muted hover:text-edu-accent2 hover:underline"
                      >
                        Layla Virell Nova
                      </Link>{" "}
                      (E325以降)
                    </p>
                  </div>
                  <div className="bg-edu-accent/10 border border-edu-accent/30 rounded-lg p-3 text-xs text-edu-accent">
                    <p className="font-bold mb-1">⚠️ 重要ノート</p>
                    <p className="text-edu-muted leading-relaxed">
                      初代は5名ではなかった。Kate Claudia・Lily
                      Steinerを中心とする集団で、Laylaを含む複数の参加者がいたが、正確な人数は不明。第二世代の5人体制とは異なる。
                    </p>
                  </div>
                  <div className="text-sm text-edu-muted">
                    <p>
                      <span className="text-edu-text">E335〜E370:</span>{" "}
                      <Link
                        href="/wiki/セリア・ドミニクス"
                        className="text-edu-muted hover:text-edu-accent2 hover:underline"
                      >
                        セリア黄金期
                      </Link>
                      に最盛期
                    </p>
                    <p>
                      <span className="text-edu-text">E400:</span> エヴァトロン弾圧で解体。Kate
                      Claudia・Lily Steinerは逮捕・消息不明
                    </p>
                    <p>
                      <span className="text-edu-text">Layla:</span>{" "}
                      冷凍保存（サイバネティクスによる長命ではない）
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Generation */}
              <div className="edu-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative h-40 bg-gradient-to-br from-edu-accent2/30 to-edu-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-edu-accent2/50">II</span>
                    <p className="text-xs text-edu-muted mt-1">SECOND GENERATION — 現在</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-edu-accent2">
                    第二世代{" "}
                    <span className="text-xs text-edu-muted font-normal">E522〜現在</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        name: "Kate Patton",
                        desc: "大地の豊かさ・安定",
                        color: "bg-green-500/20 border-green-500/40",
                        img: "https://raw.githubusercontent.com/gentaron/image/main/KatePatton.png",
                        wiki: "/wiki/Kate Patton",
                      },
                      {
                        name: "Lillie Ardent",
                        desc: "情熱的で大胆",
                        color: "bg-red-500/20 border-red-500/40",
                        img: "https://raw.githubusercontent.com/gentaron/image/main/LillieArdent.png",
                        wiki: "/wiki/Lillie Ardent",
                      },
                      {
                        name: "Layla Virell Nova",
                        desc: "Pink Voltage — 冷凍保存から復活、ミナたちと同年代",
                        color: "bg-pink-500/20 border-pink-500/40",
                        img: "https://raw.githubusercontent.com/gentaron/image/main/LaylaVirellNova.png",
                        wiki: "/wiki/レイラ・ヴィレル・ノヴァ",
                      },
                      {
                        name: "Mina Eureka Ernst",
                        desc: "celestial × avant-garde, AI研究員",
                        color: "bg-blue-500/20 border-edu-accent2/40",
                        img: "https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png",
                        wiki: "/wiki/ミナ・エウレカ・エルンスト",
                      },
                      {
                        name: "Ninny Offenbach",
                        desc: "無邪気で爆発的な活力 — 原初個体はAlpha Kane時代に別惑星へ、クローン技術で遺伝子継承ののちGigapolisに再帰還",
                        color: "bg-yellow-500/20 border-edu-accent/40",
                        img: "https://raw.githubusercontent.com/gentaron/image/main/NinnyOffenbach.png",
                        wiki: "/wiki/Ninny Offenbach",
                      },
                    ].map((m) => (
                      <div
                        key={m.name}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border ${m.color} group transition-all duration-200 cursor-default`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-edu-border/50 shrink-0 group-hover:border-edu-accent2/50 transition-colors">
                          <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-edu-text truncate">
                            <Link
                              href={m.wiki}
                              className="hover:text-edu-accent2 hover:underline"
                            >
                              {m.name}
                            </Link>
                          </p>
                          <p className="text-xs text-edu-muted line-clamp-2">{m.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-edu-bg/50 border border-edu-accent/20 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-edu-accent mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      ニニーの特別な来歴
                    </h4>
                    <div className="space-y-2 text-xs text-edu-muted leading-relaxed">
                      <p>
                        ニニーの<span className="text-edu-text font-medium">原初個体</span>は
                        <Link
                          href="/wiki/アルファ・ケイン"
                          className="text-edu-muted hover:text-edu-accent2 hover:underline"
                        >
                          Alpha Kane
                        </Link>
                        時代のGigapolisに存在していたが、Kaneと袂を分かち別惑星へ離脱した。
                      </p>
                      <p>
                        そこから<span className="text-edu-accent2 font-medium">クローン技術</span>
                        で遺伝子が世代を超えて継承され、現代のNinnyがGigapolisに
                        <span className="text-edu-accent font-medium">再帰還</span>
                        してミナと出会い、第二世代に加入した。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
