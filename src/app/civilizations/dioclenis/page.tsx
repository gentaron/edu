"use client"
import Link from "next/link"
import { Telescope, Globe2 } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { PageHeader } from "@/components/edu/page-header"
import { RevealSection } from "@/components/edu/reveal-section"

export default function DioclenisPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Telescope className="w-6 h-6 text-cyan-400" />}
          title="ディオクレニス"
          subtitle="宇宙ランキング第5位 — 宇宙探査と科学技術研究の最前線"
          wikiHref="/wiki#ディオクレニス"
        />
        <main className="px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <RevealSection>
              <div className="edu-card rounded-xl p-6 border border-cyan-400/20">
                <h2 className="text-lg font-bold text-cyan-400 mb-4">概要</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex gap-3"><span className="text-cyan-400 font-medium shrink-0 w-20">指導者</span><Link href="/wiki#ネイサン・コリンド" className="text-edu-muted hover:text-cyan-400 hover:underline">科学宰相ネイサン・コリンド</Link></div>
                  <div className="flex gap-3"><span className="text-cyan-400 font-medium shrink-0 w-20">専門</span><span className="text-edu-muted">宇宙探査・科学技術研究</span></div>
                  <div className="flex gap-3"><span className="text-cyan-400 font-medium shrink-0 w-20">提唱</span><span className="text-edu-muted">宇宙共同探査プロジェクト</span></div>
                  <div className="flex gap-3"><span className="text-cyan-400 font-medium shrink-0 w-20">ランキング</span><span className="text-edu-muted">宇宙第5位</span></div>
                </div>
                <p className="text-sm text-edu-muted leading-relaxed">
                  ディオクレニスは宇宙探査と科学技術研究の最前線に立つ文明圏。<Link href="/wiki#ネイサン・コリンド" className="text-edu-accent hover:underline">ネイサン・コリンド</Link>科学宰相の下、「<Link href="/wiki#トゥキディデスの罠" className="text-edu-accent hover:underline">トゥキディデスの罠</Link>」を提起し、宇宙共同探査プロジェクトを提案するなど、先見性のある政策を展開している。
                </p>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">歴史</h2>
                <p className="text-sm text-edu-muted leading-relaxed">
                  科学技術の研究開発に特化し、宇宙探査の分野で多大な成果を挙げてきた。ネイサン・コリンドの下、<Link href="/wiki#宇宙連合会合" className="text-edu-accent hover:underline">宇宙連合会合</Link>で4つの具体的提案を行った。
                </p>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">ネイサンの4提案</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">1. 平和協定</h4>
                    <p className="text-xs text-edu-muted leading-relaxed">全文明圏間の平和協定の締結を推進</p>
                  </div>
                  <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">2. UECO設立</h4>
                    <p className="text-xs text-edu-muted leading-relaxed">宇宙経済協同組合の強化と再編</p>
                  </div>
                  <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">3. 技術共有</h4>
                    <p className="text-xs text-edu-muted leading-relaxed">民生技術の全文明圏での共有</p>
                  </div>
                  <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">4. 文化交流</h4>
                    <p className="text-xs text-edu-muted leading-relaxed">文明圏間の文化交流プログラム</p>
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">トゥキディデスの罠</h2>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                  <p className="text-sm text-edu-muted leading-relaxed">
                    <span className="text-red-400 font-medium">警告:</span> ネイサンは、<Link href="/civilizations/granbell" className="text-amber-400 hover:underline">グランベル</Link>（経済1位）と<Link href="/civilizations/tyeria" className="text-rose-400 hover:underline">ティエリア</Link>（軍事3位）の間に「トゥキディデスの罠」が成立する危険性を指摘。かつての<Link href="/wiki#アポロン・Dominion大戦" className="text-edu-accent hover:underline">アポロン文明圏とDominionの関係</Link>も同様の構造だったと分析している。
                  </p>
                </div>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">主要人物</h2>
                <Link href="/wiki#ネイサン・コリンド" className="block edu-card rounded-lg p-4 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                  <h3 className="text-sm font-bold text-cyan-400">科学宰相ネイサン・コリンド</h3>
                  <p className="text-xs text-edu-muted mt-1">「トゥキディデスの罠」を提起。宇宙共同探査プロジェクトと4つの具体的提案を行った先見の科学者。</p>
                </Link>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">勢力間関係</h2>
                <div className="space-y-2 text-sm">
                  <Link href="/civilizations/granbell" className="block p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                    <span className="text-amber-400 font-medium">グランベル</span>
                    <span className="text-edu-muted text-xs ml-2">— トゥキディデスの罠の一方の当事者</span>
                  </Link>
                  <Link href="/civilizations/tyeria" className="block p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <span className="text-rose-400 font-medium">ティエリア</span>
                    <span className="text-edu-muted text-xs ml-2">— トゥキディデスの罠のもう一方の当事者</span>
                  </Link>
                  <Link href="/civilizations/elyseon" className="block p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                    <span className="text-emerald-400 font-medium">エレシオン</span>
                    <span className="text-edu-muted text-xs ml-2">— 探査提案に支持</span>
                  </Link>
                  <Link href="/civilizations/fallujah" className="block p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                    <span className="text-violet-400 font-medium">ファルージャ</span>
                    <span className="text-edu-muted text-xs ml-2">— 文化交流で協力</span>
                  </Link>
                </div>
              </div>
            </RevealSection>

            <Link href="/civilizations" className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-cyan-400 transition-colors">
              ← 文明圏一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
