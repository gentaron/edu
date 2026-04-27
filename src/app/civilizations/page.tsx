"use client"
import Link from "next/link"
import { Crown, Heart, Shield, Scale, Telescope, Sparkles, Package, Radio, Skull, Swords, Globe2, ExternalLink } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { PageHeader } from "@/components/edu/page-header"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { TOP_CIVILIZATIONS, OTHER_CIVILIZATIONS, HISTORICAL_CIVILIZATIONS } from "@/lib/civilization-data"

const ICON_MAP: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Telescope: <Telescope className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Skull: <Skull className="w-6 h-6" />,
  Swords: <Swords className="w-6 h-6" />,
}

export default function CivilizationsPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Globe2 className="w-6 h-6 text-amber-400" />}
          title="宇宙5大文明圏"
          subtitle="グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙勢力の全貌"
          wikiHref="/wiki#グランベル"
        />

        <main className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* 概説 */}
            <RevealSection>
              <div className="glass-card rounded-xl p-6 mb-10">
                <p className="text-sm text-cosmic-muted leading-relaxed">
                  宇宙には多様な文明圏が存在し、それぞれが独自の技術・文化・政治体制で繁栄している。
                  中でも<span className="text-amber-400 font-medium">グランベル</span>を頂点とする5大文明圏は、
                  宇宙の政治・経済・軍事の均衡を左右する重要な勢力である。
                  第一回<a href="/wiki#宇宙連合会合" className="text-gold-accent hover:underline">宇宙連合会合</a>では、
                  全勢力の指導者がオルダシティに集い、宇宙の将来について議論した。
                </p>
              </div>
            </RevealSection>

            {/* 宇宙5大文明圏 */}
            <RevealSection>
              <SectionHeader
                icon={<Crown className="w-6 h-6 text-amber-400" />}
                title="宇宙5大文明圏"
                subtitle="宇宙を左右する5つの主要勢力"
              />
            </RevealSection>
            <RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TOP_CIVILIZATIONS.map((civ) => (
                  <Link
                    key={civ.id}
                    href={civ.href}
                    className={`group glass-card rounded-xl border ${civ.borderColor} bg-gradient-to-br ${civ.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cosmic-dark/50`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center gap-3 ${civ.color}`}>
                        {ICON_MAP[civ.icon] || <Globe2 className="w-6 h-6" />}
                        <div>
                          <h3 className="text-lg font-bold">{civ.name}</h3>
                          <p className="text-xs opacity-70">{civ.nameEn}</p>
                        </div>
                      </div>
                      <span className={`text-2xl font-black ${civ.color} opacity-40`}>#{civ.rank}</span>
                    </div>
                    <p className="text-xs text-cosmic-muted leading-relaxed mb-3">
                      {civ.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-cosmic-muted">
                      <span>{civ.leader}</span>
                      <ExternalLink className={`w-3.5 h-3.5 ${civ.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </Link>
                ))}
              </div>
            </RevealSection>

            {/* その他の文明圏 */}
            <RevealSection>
              <SectionHeader
                icon={<Globe2 className="w-6 h-6 text-nebula-purple" />}
                title="その他の文明圏"
                subtitle="宇宙ランキング第6位〜第8位"
              />
            </RevealSection>
            <RevealSection>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                {OTHER_CIVILIZATIONS.map((civ) => (
                  <div
                    key={civ.id}
                    className={`glass-card rounded-xl border ${civ.borderColor} p-4 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-lg font-bold ${civ.color}`}>#{civ.rank}</span>
                      <h3 className={`text-sm font-bold ${civ.color}`}>{civ.name}</h3>
                      <span className="text-[10px] text-cosmic-muted">{civ.nameEn}</span>
                    </div>
                    <p className="text-xs text-cosmic-muted leading-relaxed mb-2">{civ.description}</p>
                    <p className="text-[10px] text-cosmic-muted">専門: {civ.specialization}</p>
                    {civ.wikiId && (
                      <Link href={`/wiki/${encodeURIComponent(civ.wikiId)}`} className="text-[10px] text-gold-accent hover:underline mt-1 inline-block">
                        Wiki →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* 歴史的文明圏 */}
            <RevealSection>
              <SectionHeader
                icon={<Swords className="w-6 h-6 text-red-400" />}
                title="歴史的文明圏"
                subtitle="アポロン大戦で消滅・変容した文明圏"
              />
            </RevealSection>
            <RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {HISTORICAL_CIVILIZATIONS.map((civ) => (
                  <div
                    key={civ.id}
                    className={`glass-card rounded-xl border ${civ.borderColor} p-5 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        歴史的
                      </span>
                      <h3 className={`text-sm font-bold ${civ.color}`}>{civ.name}</h3>
                    </div>
                    <p className="text-xs text-cosmic-muted leading-relaxed mb-3">{civ.description}</p>
                    {civ.gdp && (
                      <p className="text-[10px] text-cosmic-muted mb-2">GDP: {civ.gdp}</p>
                    )}
                    <Link href={`/wiki/${encodeURIComponent(civ.wikiId)}`} className="text-[10px] text-gold-accent hover:underline inline-block">
                      Wiki で詳しく見る →
                    </Link>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* 関連リンク */}
            <RevealSection>
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-cosmic-text mb-4">関連ページ</h3>
                <div className="flex flex-wrap gap-3">
                  <Link href="/wiki#トゥキディデスの罠" className="text-xs text-gold-accent hover:underline bg-cosmic-surface px-3 py-1.5 rounded-lg border border-cosmic-border/50">トゥキディデスの罠</Link>
                  <Link href="/wiki#宇宙連合会合" className="text-xs text-gold-accent hover:underline bg-cosmic-surface px-3 py-1.5 rounded-lg border border-cosmic-border/50">宇宙連合会合</Link>
                  <Link href="/wiki#アポロン・Dominion大戦" className="text-xs text-gold-accent hover:underline bg-cosmic-surface px-3 py-1.5 rounded-lg border border-cosmic-border/50">アポロン・Dominion大戦</Link>
                  <Link href="/ranking" className="text-xs text-emerald-400 hover:underline bg-cosmic-surface px-3 py-1.5 rounded-lg border border-cosmic-border/50">長者番付</Link>
                  <Link href="/card-game" className="text-xs text-orange-400 hover:underline bg-cosmic-surface px-3 py-1.5 rounded-lg border border-cosmic-border/50">Card Game</Link>
                </div>
              </div>
            </RevealSection>
          </div>
        </main>

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
