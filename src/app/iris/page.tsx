"use client"
import Link from "next/link"
import React from "react"
import { Shield, Crown } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { IRIS_TIMELINE, IRIS_ABILITIES, IRIS_RELATIONS } from "@/lib/iris-data"
import { locColor } from "@/lib/timeline-data"

export default function IrisPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Shield className="w-6 h-6 text-rose-400" />}
          title="アイリス"
          subtitle={
            <>
              Iris —{" "}
              <Link href="/wiki#ヴァーミリオン" className="text-rose-400 hover:underline">
                ヴァーミリオン
              </Link>{" "}
              の英雄、{" "}
              <Link href="/wiki#トリニティ・アライアンス" className="text-rose-400 hover:underline">
                トリニティ・アライアンス
              </Link>{" "}
              指導者
            </>
          }
          wikiHref="/wiki#アイリス"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-cosmic-text mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-400" /> アイリスとは
              </h2>
              <div className="space-y-3 text-sm text-cosmic-muted leading-relaxed">
                <p>
                  <span className="text-rose-400 font-medium">アイリス</span>は、E16連星系において
                  <span className="text-cosmic-text font-medium">Tier 1（現役最強）</span>
                  の戦闘能力を持つ英雄である。かつては
                  <span className="text-electric-blue hover:underline">ヴァーミリオン</span>
                  の諜報機関長を務めていたが、現在は
                  <span className="text-cyan-400 hover:underline">トリニティ・アライアンス</span>
                  の指導者として、E16星系全体の秩序維持と平和構築に奔走している。その冷徹かつ
                  strategic な性格は、複雑な国際情勢の中で的確な判断を下す原動力となっている。
                </p>
                <p>
                  アイリスの外見的特徴は青いボディスーツに白いショール、背中のジッパーと黒いダイスという装飾が挙げられる。これらは単なるファッションではなく、彼女の戦闘スタイルや哲学的背景を反映したものである。戦闘能力は極めて高く、IRIS
                  ランキングにおいて不動の1位を獲得しているが、その力を私的な利益ではなく星系全体の安定のために用いている点が、彼女を真の英雄たらしめている。
                </p>
                <p>
                  E520年に結成されたトリニティ・アライアンスは、ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンの3勢力による連合である。一方、フィオナが率いる
                  <span className="text-blue-400 hover:underline">V7（Vital Seven）</span>
                  は7カ国連合として対抗勢力を形成しており、さらに
                  <span className="text-red-400 hover:underline">アルファ・ヴェノム</span>
                  を率いるイズミの暗黒組織が暗躍するなど、E16星系は三つどもえ以上の複雑な力学の中にある。アイリスはこれらの勢力間の均衡を図りながら、アルファ・ヴェノムの脅威に立ち向かっている。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Character Portrait */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                  <div className="relative">
                    <img
                      src="https://raw.githubusercontent.com/gentaron/image/main/Iris.png"
                      alt="アイリス"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-gold-accent/20 border border-gold-accent/40 text-gold-accent">
                        <Crown className="w-3 h-3" /> IRIS 1位
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xl font-bold text-cosmic-text">アイリス</p>
                      <p className="text-xs text-rose-400">Iris — Dominion Vermillion</p>
                      <p className="text-[10px] text-cosmic-muted mt-1">
                        トリニティ・アライアンス指導者
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-rose-400 mb-4 uppercase tracking-wider">
                    プロフィール
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    {(
                      [
                        [
                          "所属",
                          <Link
                            key="wl1"
                            href="/wiki#トリニティ・アライアンス"
                            className="text-electric-blue hover:underline"
                          >
                            トリニティ・アライアンス
                          </Link>,
                        ],
                        [
                          "前所属",
                          <React.Fragment key="wl2">
                            <Link
                              href="/wiki#ヴァーミリオン"
                              className="text-electric-blue hover:underline"
                            >
                              ヴァーミリオン
                            </Link>
                            諜報機関長
                          </React.Fragment>,
                        ],
                        ["外見", "青いボディスーツ・白いショール"],
                        ["特徴", "背中ジッパー・黒いダイス"],
                        ["性格", "冷徹・ strategic・仲間思い"],
                        ["Tier", "Tier 1（現役最強）"],
                      ] as [string, React.ReactNode][]
                    ).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-cosmic-muted text-xs mb-0.5">{k}</p>
                        <p className="text-cosmic-text font-medium">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">
                    能力・装備
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {IRIS_ABILITIES.map((ability) => (
                      <div
                        key={ability.name}
                        className={`p-3 rounded-lg border ${ability.color} transition-all hover:scale-[1.02]`}
                      >
                        <p className="text-sm font-bold mb-1">{ability.name}</p>
                        <p className="text-[11px] opacity-80">{ability.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Relationships */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-pink-400 mb-4 uppercase tracking-wider">
                    主要関係者
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {IRIS_RELATIONS.map((rel) => (
                      <div
                        key={rel.name}
                        className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${rel.color} hover:bg-cosmic-dark/50 transition-colors`}
                      >
                        <span className="text-cosmic-muted mt-0.5 shrink-0 text-xs">▸</span>
                        <div className="min-w-0">
                          <p className="text-sm text-cosmic-text font-medium">{rel.name}</p>
                          <p className="text-[11px] text-cosmic-muted">{rel.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Iris Story Timeline */}
            <div className="mt-8 glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold text-rose-400 mb-4 uppercase tracking-wider">
                アイリス物語年表
              </h3>
              <div className="space-y-2 ml-2 border-l-2 border-rose-400/30 pl-4">
                {IRIS_TIMELINE.map((t, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 text-sm items-start">
                    <span className="text-rose-400 font-bold shrink-0 w-16">{t.year}</span>
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${locColor[t.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                    >
                      {t.loc}
                    </span>
                    <span className="text-cosmic-text/90">{t.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-5 border border-cyan-400/20">
                <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <Link
                    href="/wiki#トリニティ・アライアンス"
                    className="text-cyan-400 hover:underline"
                  >
                    トリニティ・アライアンス
                  </Link>
                </h4>
                <p className="text-xs text-cosmic-muted mb-3">
                  アイリスが指導する3勢力連合。E520年結成。
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["ヴァーミリオン", "ミエルテンガ", "ボグダス・ジャベリン"].map((n) => (
                    <span
                      key={n}
                      className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-5 border border-blue-400/20">
                <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <Link href="/wiki#V7" className="text-blue-400 hover:underline">
                    V7
                  </Link>{" "}
                  (Vital Seven)
                </h4>
                <p className="text-xs text-cosmic-muted mb-3">
                  <Link href="/wiki#フィオナ" className="hover:text-nebula-purple hover:underline">
                    フィオナ
                  </Link>
                  が急先鋒の7カ国連合。E515年設立。
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "ブルーローズ",
                    "SSレンジ",
                    "クロセヴィア",
                    "アイアン・シンジケート",
                    "ファティマ連邦",
                  ].map((n) => (
                    <span
                      key={n}
                      className="text-[10px] bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-5 border border-red-400/20">
                <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <Link href="/wiki#アルファ・ヴェノム" className="text-red-400 hover:underline">
                    アルファ・ヴェノム
                  </Link>
                </h4>
                <p className="text-xs text-cosmic-muted mb-3">
                  <Link href="/wiki#イズミ" className="hover:text-nebula-purple hover:underline">
                    イズミ
                  </Link>
                  率いる暗黒組織。シルバー・ヴェノムの後継。
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["イズミ", "ボブリスティ", "ギル", "カタリナ", "ゴルディロックス", "AJ"].map(
                    (n) => (
                      <span
                        key={n}
                        className="text-[10px] bg-red-500/15 text-red-300 px-2 py-0.5 rounded border border-red-500/20"
                      >
                        {n}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* External link */}
            <div className="mt-6 text-center">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                <Shield className="w-4 h-4" /> EDU小説集を読む
              </Link>
            </div>
          </div>
        </RevealSection>

        <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="text-xs text-cosmic-muted hover:text-gold-accent transition-colors"
            >
              ← トップページに戻る
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
