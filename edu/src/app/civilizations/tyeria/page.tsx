import Link from "next/link"
import { Shield, Globe2 } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { PageHeader } from "@/components/edu/page-header"
import { RevealSection } from "@/components/edu/reveal-section"

export default function TyeriaPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Shield className="w-6 h-6 text-rose-400" />}
          title="ティエリア"
          subtitle="宇宙ランキング第3位 — 宇宙最強の軍事力を誇る防衛国家"
          wikiHref="/wiki/ティエリア"
        />
        <main className="px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 概要 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6 border border-rose-400/20">
                <h2 className="text-lg font-bold text-rose-400 mb-4">概要</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex gap-3"><span className="text-rose-400 font-medium shrink-0 w-20">指導者</span><Link href="/wiki/グレイモンド・ハウザー" className="text-edu-muted hover:text-rose-400 hover:underline">総帥グレイモンド・ハウザー</Link></div>
                  <div className="flex gap-3"><span className="text-rose-400 font-medium shrink-0 w-20">専門</span><span className="text-edu-muted">軍事力・防衛ネットワーク</span></div>
                  <div className="flex gap-3"><span className="text-rose-400 font-medium shrink-0 w-20">経済基盤</span><span className="text-edu-muted">軍事技術輸出</span></div>
                  <div className="flex gap-3"><span className="text-rose-400 font-medium shrink-0 w-20">信条</span><span className="text-edu-muted">「軍事力なくして平和は守れない」</span></div>
                  <div className="flex gap-3"><span className="text-rose-400 font-medium shrink-0 w-20">ランキング</span><span className="text-edu-muted">宇宙第3位</span></div>
                </div>
                <p className="text-sm text-edu-muted leading-relaxed">
                  ティエリアは宇宙最強の軍事力を誇る文明圏。軍事技術の輸出を経済基盤とし、その防衛ネットワークは宇宙随一と言われる。<Link href="/wiki/グレイモンド・ハウザー" className="text-edu-accent hover:underline">グレイモンド・ハウザー総帥</Link>の下、「軍事力なくして平和は守れない」という信条に基づき、強大な軍備を維持している。
                </p>
              </div>
            </RevealSection>

            {/* 歴史 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">歴史</h2>
                <p className="text-sm text-edu-muted leading-relaxed">
                  古くから軍事技術の研究に注力し、他文明圏に対する軍事技術輸出で独自の経済基盤を確立してきた。<Link href="/civilizations/granbell" className="text-amber-400 hover:underline">グランベル</Link>の経済的支配が進む中、ティエリアは軍事力で均衡を保つ政策をとってきた。この経済大国vs軍事大国の構造は、<Link href="/wiki/トゥキディデスの罠" className="text-edu-accent hover:underline">ディオクレニスのネイサン</Link>によって「トゥキディデスの罠」として指摘されている。
                </p>
              </div>
            </RevealSection>

            {/* 現在の状況 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">現在の状況</h2>
                <p className="text-sm text-edu-muted leading-relaxed">
                  グランベルの経済的支配に対し、軍事力で均衡を図る政策を継続。<Link href="/civilizations/elyseon" className="text-emerald-400 hover:underline">エレシオン</Link>のリアナ女王とは軍拡を巡って対立しており、<Link href="/wiki/宇宙連合会合" className="text-edu-accent hover:underline">宇宙連合会合</Link>でもこの対立が表面化した。ファルージャの調停試みに対しては懐疑的な態度をとっている。
                </p>
              </div>
            </RevealSection>

            {/* 主要人物 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">主要人物</h2>
                <Link href="/wiki/グレイモンド・ハウザー" className="block edu-card rounded-lg p-4 border border-rose-400/20 hover:border-rose-400/40 transition-colors">
                  <h3 className="text-sm font-bold text-rose-400">総帥グレイモンド・ハウザー</h3>
                  <p className="text-xs text-edu-muted mt-1">ティエリア総帥。宇宙最強の軍事力を指揮。「軍事力なくして平和は守れない」と主張。</p>
                </Link>
              </div>
            </RevealSection>

            {/* 関係性 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">勢力間関係</h2>
                <div className="space-y-2 text-sm">
                  <Link href="/civilizations/granbell" className="block p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                    <span className="text-amber-400 font-medium">グランベル</span>
                    <span className="text-edu-muted text-xs ml-2">— 経済vs軍事の構造的対立（トゥキディデスの罠）</span>
                  </Link>
                  <Link href="/civilizations/elyseon" className="block p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                    <span className="text-emerald-400 font-medium">エレシオン</span>
                    <span className="text-edu-muted text-xs ml-2">— 軍拡方針で対立</span>
                  </Link>
                  <Link href="/civilizations/fallujah" className="block p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                    <span className="text-violet-400 font-medium">ファルージャ</span>
                    <span className="text-edu-muted text-xs ml-2">— 調停の対象</span>
                  </Link>
                </div>
              </div>
            </RevealSection>

            <Link href="/civilizations" className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-rose-400 transition-colors">
              ← 文明圏一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
