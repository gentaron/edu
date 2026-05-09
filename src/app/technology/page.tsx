"use client"

import Link from "next/link"
import { Atom, Zap, Globe2, ChevronDown } from "lucide-react"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"
import { TECH_DATA } from "@/lib/tech-data"

export default function TechnologyPage() {
  const { lang } = useLang()

  const ladderData = [
    {
      tier: "Tier Ω",
      label: lang === "en" ? "Higher Dimensional World" : "高次元世界",
      detail:
        lang === "en"
          ? "Huns 8-D / Sasan 9-D / Horazm 10-D / Timur 11-D — Geometric foundation of informational dimensions"
          : "フン8次元 / ササン9次元 / ホラズム10次元 / ティムール11次元 — 情報次元の幾何学的基盤",
      color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
      width: "w-full",
    },
    {
      tier: "Tier Σ",
      label: lang === "en" ? "Persephone Virtual Universe" : "ペルセポネ仮想宇宙",
      detail:
        lang === "en"
          ? "Virtual multiverse on quantum computing cores — Emotion reproduction via Qualia Core. 10^18 qubit ultra-parallel processing"
          : "量子演算コア上の仮想多元宇宙 — クオリア・コアによる感情再現。10^18量子ビット超並列処理",
      color: "bg-purple-500/20 border-purple-500/40 text-purple-300",
      width: "w-11/12",
    },
    {
      tier: "Tier Ε",
      label: lang === "en" ? "E16 Normal Dimension" : "E16通常次元",
      detail:
        lang === "en"
          ? "Physical reality of the E16 binary star system — 4D spacetime (3 spatial + 1 temporal). Connected to higher dimensions via Dimension Horizon"
          : "E16連星系の物理的現実 — 4次元時空（3空間+1時間）。次元極地平で高次元と接続",
      color: "bg-blue-500/20 border-blue-500/40 text-blue-300",
      width: "w-10/12",
    },
    {
      tier: "Tier Δ",
      label: "Earth AD2026",
      detail:
        lang === "en"
          ? "Earth's physical reality — Receiving E528 information via Liminal Forge's Chronocast"
          : "地球の物理的現実 — リミナル・フォージのクロノキャストでE528年情報を受信中",
      color: "bg-green-500/20 border-green-500/40 text-green-300",
      width: "w-9/12",
    },
  ]

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Atom className="w-6 h-6 text-cyan-400" />}
        title={
          <Link href="/wiki" className="text-edu-text hover:underline">
            {lang === "en"
              ? "Technology System — Physics-Consistent Technology"
              : "技術体系 — Physics-Consistent Technology"}
          </Link>
        }
        subtitle={
          lang === "en"
            ? "Core technologies of the E16 binary star system — Technical explanations based on real physics theories"
            : "E16連星系のコア技術群 — 実在の物理学理論に基づく技術的解説"
        }
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Atom className="w-5 h-5 text-cyan-400" />{" "}
              {lang === "en" ? "About the E16 Technology System" : "E16技術体系とは"}
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              {lang === "en" ? (
                <>
                  <p>
                    The technology system of the E16 binary star system is a coherent body of
                    technologies built on{" "}
                    <span className="text-cyan-400 font-medium">real physics theories</span>. Rather
                    than fanciful gadgets, these are technologies logically explainable within the
                    framework of modern physics — general relativity, quantum mechanics, superstring
                    theory, and M-theory. This gives the EDU world's technological aspects
                    scientific depth and credibility.
                  </p>
                  <p>
                    The technology system is organized in a 4-layer structure as the{" "}
                    <span className="text-edu-text font-medium">
                      <Link
                        href={`/wiki/${encodeURIComponent("次元階梯パンディクト")}`}
                        className="hover:text-edu-accent2 hover:underline"
                      >
                        Pandict Dimension Ladder
                      </Link>
                    </span>
                    .<span className="text-green-400 font-medium">Tier Δ</span> (Earth AD2026) forms
                    the foundation, ascending through{" "}
                    <span className="text-blue-400 font-medium">Tier Ε</span> (E16 normal
                    dimension),
                    <span className="text-purple-400 font-medium"> Tier Σ</span> (
                    <Link
                      href={`/wiki/${encodeURIComponent("ペルセポネ")}`}
                      className="text-purple-400 hover:underline"
                    >
                      Persephone
                    </Link>{" "}
                    virtual universe), to <span className="text-cyan-400 font-medium">Tier Ω</span>{" "}
                    (higher dimensional world). Each layer represents a different domain of physical
                    law applicability, and the interactions between layers form the core of E16
                    technology.
                  </p>
                  <p>
                    Each technology entry describes both its physical foundations and applications —
                    explaining which theories they are based on and how they are practically
                    implemented in the E16 star system. Expand each item below to explore the
                    details.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    E16連星系の技術体系は、
                    <span className="text-cyan-400 font-medium">実在の物理学理論</span>
                    に基づいて構築された一貫性のある技術群である。単なる空想的なガジェットではなく、一般相対性理論、量子力学、超弦理論、M理論などの現代物理学の枠組みの中で論理的に説明可能な技術として設計されている。これにより、EDU
                    世界観の技術的側面に科学的な厚みと信憑性が与えられている。
                  </p>
                  <p>
                    技術体系は
                    <span className="text-edu-text font-medium">
                      <Link
                        href={`/wiki/${encodeURIComponent("次元階梯パンディクト")}`}
                        className="hover:text-edu-accent2 hover:underline"
                      >
                        次元階梯パンディクト
                      </Link>
                    </span>
                    として4層構造で整理されている。
                    <span className="text-green-400 font-medium">Tier Δ</span>（地球
                    AD2026）が基盤となり、<span className="text-blue-400 font-medium">Tier Ε</span>
                    （E16通常次元）、<span className="text-purple-400 font-medium">Tier Σ</span>（
                    <Link
                      href={`/wiki/${encodeURIComponent("ペルセポネ")}`}
                      className="text-purple-400 hover:underline"
                    >
                      ペルセポネ
                    </Link>
                    仮想宇宙）、<span className="text-cyan-400 font-medium">Tier Ω</span>
                    （高次元世界）へと階層化されている。それぞれの階層は異なる物理法則の適用領域を表し、階層間の相互作用がE16技術の核心をなしている。
                  </p>
                  <p>
                    各技術項目は物理学的基盤と応用例の両方を記載しており、どのような理論に基づき、E16星系でどのように実用化されているかを理解できる。以下のリストから各技術の詳細を展開して確認してほしい。
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {TECH_DATA.map((tech) => (
              <div
                key={tech.id}
                className={`edu-card rounded-xl border ${tech.borderColor} overflow-hidden transition-all duration-300`}
              >
                <details className="group">
                  <summary className="cursor-pointer px-6 py-5 hover:bg-edu-surface/50 transition-colors select-none">
                    <div className="flex items-start gap-4">
                      <div
                        className={`text-2xl font-black ${tech.color} mt-0.5 shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${tech.bgGlow} border ${tech.borderColor}`}
                      >
                        {tech.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`text-base font-bold ${tech.color}`}>
                            {lang === "en" && tech.nameEn ? tech.nameEn : tech.name}
                          </h3>
                          <span className="text-xs text-edu-muted font-mono">{tech.nameEn}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tech.tagColor}`}
                          >
                            {lang === "en" && tech.tagEn ? tech.tagEn : tech.tag}
                          </span>
                        </div>
                        <p className="text-xs text-edu-muted line-clamp-2">
                          {(lang === "en" && tech.physicsEn ? tech.physicsEn : tech.physics).slice(
                            0,
                            120
                          )}
                          ...
                        </p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-edu-muted shrink-0 mt-1 transition-transform group-open:rotate-180" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <div className="border-t border-edu-border/30 pt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-edu-text mb-2 flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-edu-accent" />{" "}
                          {tl("物理学的基盤", "Physical Foundations", lang)}
                        </h4>
                        <p className="text-sm text-edu-text/85 leading-relaxed">
                          {lang === "en" && tech.physicsEn ? tech.physicsEn : tech.physics}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-edu-text mb-2 flex items-center gap-1.5">
                          <Globe2 className="w-3 h-3 text-edu-accent2" />{" "}
                          {tl("応用・実績", "Applications & Achievements", lang)}
                        </h4>
                        <ul className="space-y-1.5">
                          {(lang === "en" && tech.applicationsEn
                            ? tech.applicationsEn
                            : tech.applications
                          ).map((app, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-edu-muted">
                              <span className="text-edu-accent2 mt-0.5 shrink-0">▸</span>
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* Pandict Dimension Ladder Diagram */}
          <div className="edu-card rounded-xl border border-cyan-500/20 p-6 mt-6 transition-all duration-300">
            <h3 className="text-base font-bold text-edu-text mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              {lang === "en"
                ? "Pandict Dimension Ladder (4-Layer Structure)"
                : "次元階梯パンディクト — Pandict Dimension Ladder (4-Layer Structure)"}
            </h3>
            <div className="flex flex-col items-center gap-1">
              {ladderData.map((layer) => (
                <div
                  key={layer.tier}
                  className={`${layer.width} border ${layer.color} rounded-lg p-3 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black">{layer.tier}</span>
                    <span className="text-[10px] font-bold opacity-80">{layer.label}</span>
                  </div>
                  <p className="text-[11px] opacity-70 leading-relaxed">{layer.detail}</p>
                </div>
              ))}
            </div>
          </div>
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
