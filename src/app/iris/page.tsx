import Link from "next/link"
import React from "react"
import { Shield, Crown } from "lucide-react"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { IRIS_TIMELINE, IRIS_ABILITIES, IRIS_RELATIONS } from "@/lib/iris-data"
import { locColor } from "@/lib/timeline-data"

export default function IrisPage() {
  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Shield className="w-6 h-6 text-rose-400" />}
        title="アイリス"
        subtitle={
          <>
            Iris —{" "}
            <Link
              href={`/wiki/${encodeURIComponent("ヴァーミリオン")}`}
              className="text-rose-400 hover:underline"
            >
              ヴァーミリオン
            </Link>{" "}
            の英雄、{" "}
            <Link
              href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
              className="text-rose-400 hover:underline"
            >
              トリニティ・アライアンス
            </Link>{" "}
            指導者
          </>
        }
        wikiHref={`/wiki/${encodeURIComponent("アイリス")}`}
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" /> アイリスとは
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              <p>
                <span className="text-rose-400 font-medium">アイリス</span>は、E16連星系において
                <span className="text-edu-text font-medium">Tier 1（現役最強）</span>
                の戦闘能力を持つ英雄である。かつては{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("ヴァーミリオン")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  ヴァーミリオン
                </Link>{" "}
                の諜報機関長を務めていたが、現在は{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                  className="text-cyan-400 hover:underline"
                >
                  トリニティ・アライアンス
                </Link>{" "}
                の指導者として、E16星系全体の秩序維持と平和構築に奔走している。その冷徹かつ
                strategic な性格は、複雑な国際情勢の中で的確な判断を下す原動力となっている。
              </p>
              <p>
                アイリスの外見的特徴は青いボディスーツに白いショール、背中のジッパーと黒いダイスという装飾が挙げられる。これらは単なるファッションではなく、彼女の戦闘スタイルや哲学的背景を反映したものである。戦闘能力は極めて高く、IRIS
                ランキングにおいて不動の1位を獲得しているが、その力を私的な利益ではなく星系全体の安定のために用いている点が、彼女を真の英雄たらしめている。
              </p>
              <p>
                E520年に結成されたトリニティ・アライアンスは、ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンの3勢力による連合である。一方、
                <Link
                  href={`/wiki/${encodeURIComponent("フィオナ")}`}
                  className="text-edu-accent2 hover:underline"
                >
                  フィオナ
                </Link>
                が率いる{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("V7")}`}
                  className="text-blue-400 hover:underline"
                >
                  V7（Vital Seven）
                </Link>{" "}
                は7カ国連合として対抗勢力を形成しており、さらに{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("アルファ・ヴェノム")}`}
                  className="text-red-400 hover:underline"
                >
                  アルファ・ヴェノム
                </Link>{" "}
                を率いる{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("イズミ")}`}
                  className="text-red-400 hover:underline"
                >
                  イズミ
                </Link>{" "}
                の暗黒組織が暗躍するなど、E16星系は三つどもえ以上の複雑な力学の中にある。アイリスはこれらの勢力間の均衡を図りながら、アルファ・ヴェノムの脅威に立ち向かっている。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="lg:col-span-1">
              <div className="edu-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative">
                  <img
                    src="https://raw.githubusercontent.com/gentaron/image/main/Iris.png"
                    alt="アイリス"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-edu-bg via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-edu-accent/20 border border-edu-accent/40 text-edu-accent">
                      <Crown className="w-3 h-3" /> IRIS 1位
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-edu-text">アイリス</p>
                    <p className="text-xs text-rose-400">Iris — Dominion Vermillion</p>
                    <p className="text-[10px] text-edu-muted mt-1">
                      トリニティ・アライアンス指導者
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="edu-card rounded-xl p-6">
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
                          href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                          className="text-edu-accent2 hover:underline"
                        >
                          トリニティ・アライアンス
                        </Link>,
                      ],
                      [
                        "前所属",
                        <React.Fragment key="wl2">
                          <Link
                            href={`/wiki/${encodeURIComponent("ヴァーミリオン")}`}
                            className="text-edu-accent2 hover:underline"
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
                      <p className="text-edu-muted text-xs mb-0.5">{k}</p>
                      <p className="text-edu-text font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="edu-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">
                  能力・装備
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {IRIS_ABILITIES.map((ability) => (
                    <div
                      key={ability.name}
                      className={`p-3 rounded-lg border ${ability.color} transition-all`}
                    >
                      <p className="text-sm font-bold mb-1">{ability.name}</p>
                      <p className="text-[11px] opacity-80">{ability.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Relationships */}
              <div className="edu-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-pink-400 mb-4 uppercase tracking-wider">
                  主要関係者
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {IRIS_RELATIONS.map((rel) => (
                    <div
                      key={rel.name}
                      className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${rel.color} hover:bg-edu-bg/50 transition-colors`}
                    >
                      <span className="text-edu-muted mt-0.5 shrink-0 text-xs">▸</span>
                      <div className="min-w-0">
                        <p className="text-sm text-edu-text font-medium">{rel.name}</p>
                        <p className="text-[11px] text-edu-muted">{rel.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Iris Story Timeline */}
          <div className="mt-8 edu-card rounded-xl p-6">
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
                  <span className="text-edu-text/90">{t.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="edu-card rounded-xl p-5 border border-cyan-400/20">
              <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <Link
                  href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                  className="text-cyan-400 hover:underline"
                >
                  トリニティ・アライアンス
                </Link>
              </h4>
              <p className="text-xs text-edu-muted mb-3">
                アイリスが指導する3勢力連合。E520年結成。
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "ヴァーミリオン", id: "ヴァーミリオン" },
                  { name: "ミエルテンガ", id: "ミエルテンガ" },
                  { name: "ボグダス・ジャベリン", id: "ボグダス・ジャベリン" },
                ].map((n) => (
                  <Link
                    key={n.name}
                    href={`/wiki/${encodeURIComponent(n.id)}`}
                    className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 hover:bg-cyan-500/25 transition-colors"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="edu-card rounded-xl p-5 border border-blue-400/20">
              <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <Link
                  href={`/wiki/${encodeURIComponent("V7")}`}
                  className="text-blue-400 hover:underline"
                >
                  V7
                </Link>{" "}
                (Vital Seven)
              </h4>
              <p className="text-xs text-edu-muted mb-3">
                <Link
                  href={`/wiki/${encodeURIComponent("フィオナ")}`}
                  className="hover:text-edu-accent2 hover:underline"
                >
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
            <div className="edu-card rounded-xl p-5 border border-red-400/20">
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <Link
                  href={`/wiki/${encodeURIComponent("アルファ・ヴェノム")}`}
                  className="text-red-400 hover:underline"
                >
                  アルファ・ヴェノム
                </Link>
              </h4>
              <p className="text-xs text-edu-muted mb-3">
                <Link
                  href={`/wiki/${encodeURIComponent("イズミ")}`}
                  className="hover:text-edu-accent2 hover:underline"
                >
                  イズミ
                </Link>
                率いる暗黒組織。{" "}
                <Link
                  href={`/wiki/${encodeURIComponent("シルバー・ヴェノム")}`}
                  className="hover:text-edu-accent2 hover:underline"
                >
                  シルバー・ヴェノム
                </Link>
                の後継。
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
            >
              <Shield className="w-4 h-4" /> EDU小説集を読む
            </Link>
          </div>
        </div>
      </RevealSection>

      <footer className="relative border-t border-edu-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-accent transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </footer>
    </div>
  )
}
