import Link from "next/link"
import { Radio, ArrowDown, Zap, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { PLATFORMS } from "@/lib/liminal-data"

export default function LiminalPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Radio className="w-6 h-6 text-edu-accent" />}
          title={
            <Link href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`} className="text-edu-text hover:underline">
              リミナル・フォージ
            </Link>
          }
          subtitle="Liminal Forge — E528からAD2026へ、時空を超えた放送プロジェクト"
          wikiHref={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="edu-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-edu-accent" /> リミナル・フォージとは
              </h2>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  <span className="text-edu-accent font-medium">
                    リミナル・フォージ（Liminal Forge）
                  </span>
                  は、E528年の現代からAD
                  2026年の地球へ情報を送信する画期的な時空放送プロジェクトである。このプロジェクトは{" "}
                  <Link href={`/wiki/${encodeURIComponent("AURALIS")}`} className="text-edu-accent2 hover:underline">
                    AURALIS Collective
                  </Link>
                  {" "}第二世代のメンバーである{" "}
                  <Link href={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`} className="text-edu-accent2 hover:underline">
                    ミナ・エウレカ・エルンスト
                  </Link>
                  {" "}が創設し、E16文明が到達した高度な技術を駆使して実現された。
                </p>
                <p>
                  放送の経路は非常に複雑である。まず
                  <span className="text-edu-accent2 font-medium">AURALIS 本部</span>
                  （E528年）から信号が発信され、{" "}
                  <Link href={`/wiki/${encodeURIComponent("ペルセポネ")}`} className="text-edu-accent2 hover:underline">
                    ペルセポネ仮想宇宙
                  </Link>
                  と{" "}
                  <Link href={`/wiki/${encodeURIComponent("次元極地平")}`} className="text-edu-accent2 hover:underline">
                    次元極地平（Dimension Horizon）
                  </Link>
                  {" "}を経由して時空を超え、AD
                  2026年の地球インターネットに到達する。この仕組みは、E16文明が開発した高次元通信技術と量子演算に基づいている。
                </p>
                <p>
                  AD
                  2026年が到達点に選ばれたのには二つの理由がある。第一に、この時代の地球はAI技術の臨界点にあり、時空通信を受信可能な技術レベルに達していたこと。第二に、AD
                  2026年はE16文明の遠い原点 —
                  人類の旅路の始まりに敬意を込めた選択である。リミナル・フォージは複数のプラットフォームを通じて配信されており、それぞれ異なる形式と目的を持った放送を行っている。
                </p>
              </div>
            </div>

            {/* Broadcasting mechanism */}
            <div className="edu-card rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-edu-accent mb-4">時相放送の仕組み</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center text-center">
                <div className="bg-edu-accent2/15 border border-edu-accent2/30 rounded-lg p-4 min-w-[160px]">
                  <p className="text-xs text-edu-muted mb-1">起点</p>
                  <p className="text-sm font-bold text-edu-accent2">E528</p>
                  <p className="text-xs text-edu-muted">
                    <Link href={`/wiki/${encodeURIComponent("AURALIS")}`} className="hover:text-edu-accent2 hover:underline">
                      AURALIS
                    </Link>
                    本部
                  </p>
                </div>
                <ArrowDown className="w-5 h-5 text-edu-muted rotate-90 sm:rotate-0 shrink-0" />
                <div className="bg-edu-accent2/15 border border-edu-accent2/30 rounded-lg p-4 min-w-[200px]">
                  <p className="text-xs text-edu-muted mb-1">経由</p>
                  <p className="text-sm font-bold text-edu-accent2">
                    <Link href={`/wiki/${encodeURIComponent("ペルセポネ")}`} className="text-edu-accent2 hover:underline">
                      ペルセポネ
                    </Link>
                    仮想宇宙
                  </p>
                  <p className="text-xs text-edu-muted">
                    ×{" "}
                    <Link href={`/wiki/${encodeURIComponent("次元極地平")}`} className="text-edu-accent2 hover:underline">
                      Dimension Horizon
                    </Link>
                  </p>
                </div>
                <ArrowDown className="w-5 h-5 text-edu-muted rotate-90 sm:rotate-0 shrink-0" />
                <div className="bg-edu-accent/15 border border-edu-accent/30 rounded-lg p-4 min-w-[160px]">
                  <p className="text-xs text-edu-muted mb-1">到達点</p>
                  <p className="text-sm font-bold text-edu-accent">AD2026</p>
                  <p className="text-xs text-edu-muted">地球インターネット</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-edu-bg/50 rounded-lg border border-edu-border/50">
                <h4 className="text-sm font-bold text-edu-text mb-2">なぜ2026年？</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-edu-muted">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-edu-accent shrink-0 mt-0.5" />
                    <p>AI技術臨界点 — 地球文明の技術発展が時空通信を可能にする</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-edu-accent shrink-0 mt-0.5" />
                    <p>E16文明の遠い原点 — 人類の旅路の始まりに敬意を込めて</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform table */}
            <div className="edu-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-edu-accent2 mb-4">放送プラットフォーム</h3>
              <div className="space-y-3">
                {PLATFORMS.map((p) => (
                  <div
                    key={p.name}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border ${p.color} ${p.bg} transition-all`}
                  >
                    <Badge variant="outline" className={`w-fit text-[10px] ${p.color} shrink-0`}>
                      {p.type}
                    </Badge>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
                    >
                      <p className="text-sm font-mono text-edu-text truncate">{p.name}</p>
                      <p className="text-xs text-edu-muted">{p.desc}</p>
                    </a>
                  </div>
                ))}
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
