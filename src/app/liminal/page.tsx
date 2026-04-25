"use client"
import Link from "next/link"
import { Radio, ArrowDown, Zap, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { PLATFORMS } from "@/lib/liminal-data"

export default function LiminalPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Radio className="w-6 h-6 text-gold-accent" />}
          title={<Link href="/wiki#リミナル・フォージ" className="text-cosmic-gradient hover:underline">リミナル・フォージ</Link>}
          subtitle="Liminal Forge — E528からAD2026へ、時空を超えた放送プロジェクト"
          wikiHref="/wiki#リミナル・フォージ"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* Broadcasting mechanism */}
            <div className="glass-card rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gold-accent mb-4">時相放送の仕組み</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center text-center">
                <div className="bg-nebula-purple/15 border border-nebula-purple/30 rounded-lg p-4 min-w-[160px]">
                  <p className="text-xs text-cosmic-muted mb-1">起点</p>
                  <p className="text-sm font-bold text-nebula-purple">E528</p>
                  <p className="text-xs text-cosmic-muted"><Link href="/wiki#AURALIS" className="hover:text-nebula-purple hover:underline">AURALIS</Link>本部</p>
                </div>
                <ArrowDown className="w-5 h-5 text-cosmic-muted rotate-90 sm:rotate-0 shrink-0" />
                <div className="bg-electric-blue/15 border border-electric-blue/30 rounded-lg p-4 min-w-[200px]">
                  <p className="text-xs text-cosmic-muted mb-1">経由</p>
                  <p className="text-sm font-bold text-electric-blue">
                    <Link href="/wiki#ペルセポネ" className="text-electric-blue hover:underline">ペルセポネ</Link>仮想宇宙
                  </p>
                  <p className="text-xs text-cosmic-muted">× <Link href="/wiki#次元極地平" className="text-electric-blue hover:underline">Dimension Horizon</Link></p>
                </div>
                <ArrowDown className="w-5 h-5 text-cosmic-muted rotate-90 sm:rotate-0 shrink-0" />
                <div className="bg-gold-accent/15 border border-gold-accent/30 rounded-lg p-4 min-w-[160px]">
                  <p className="text-xs text-cosmic-muted mb-1">到達点</p>
                  <p className="text-sm font-bold text-gold-accent">AD2026</p>
                  <p className="text-xs text-cosmic-muted">地球インターネット</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-cosmic-dark/50 rounded-lg border border-cosmic-border/50">
                <h4 className="text-sm font-bold text-cosmic-text mb-2">なぜ2026年？</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-cosmic-muted">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                    <p>AI技術臨界点 — 地球文明の技術発展が時空通信を可能にする</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                    <p>E16文明の遠い原点 — 人類の旅路の始まりに敬意を込めて</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform table */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-electric-blue mb-4">放送プラットフォーム</h3>
              <div className="space-y-3">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border ${p.color} ${p.bg} transition-all hover:scale-[1.01]`}>
                    <Badge variant="outline" className={`w-fit text-[10px] ${p.color} shrink-0`}>{p.type}</Badge>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                      <p className="text-sm font-mono text-cosmic-text truncate">{p.name}</p>
                      <p className="text-xs text-cosmic-muted">{p.desc}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <footer className="relative border-t border-cosmic-border/50 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="text-xs text-cosmic-muted hover:text-gold-accent transition-colors">← トップページに戻る</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
