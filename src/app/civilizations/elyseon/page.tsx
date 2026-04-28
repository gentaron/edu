import Link from "next/link"
import { Heart, Globe2 } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { PageHeader } from "@/components/edu/page-header"
import { RevealSection } from "@/components/edu/reveal-section"

export default function ElyseonPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Heart className="w-6 h-6 text-emerald-400" />}
          title="エレシオン"
          subtitle="宇宙ランキング第2位 — 医療技術と環境再生で宇宙をリードする平和主義文明圏"
          wikiHref="/wiki#エレシオン"
        />
        <main className="px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 概要 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6 border border-emerald-400/20">
                <h2 className="text-lg font-bold text-emerald-400 mb-4">概要</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex gap-3"><span className="text-emerald-400 font-medium shrink-0 w-20">指導者</span><Link href="/wiki#女王リアナ・ソリス" className="text-edu-muted hover:text-emerald-400 hover:underline">女王リアナ・ソリス</Link></div>
                  <div className="flex gap-3"><span className="text-emerald-400 font-medium shrink-0 w-20">専門</span><span className="text-edu-muted">医療技術・環境再生技術</span></div>
                  <div className="flex gap-3"><span className="text-emerald-400 font-medium shrink-0 w-20">理念</span><span className="text-edu-muted">生命の維持と再生</span></div>
                  <div className="flex gap-3"><span className="text-emerald-400 font-medium shrink-0 w-20">ランキング</span><span className="text-edu-muted">宇宙第2位</span></div>
                </div>
                <p className="text-sm text-edu-muted leading-relaxed">
                  エレシオンは医療技術と環境再生技術で宇宙をリードする平和主義文明圏。支配ではなく「生命の維持と再生」を根幹理念としており、その技術力と人道主義的アプローチから多くの文明圏からの尊敬を集めている。<Link href="/wiki#女王リアナ・ソリス" className="text-edu-accent hover:underline">リアナ・ソリス女王</Link>の治世の下、宇宙規模での平和外交と技術共有を推進している。
                </p>
              </div>
            </RevealSection>

            {/* 歴史 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">歴史</h2>
                <p className="text-sm text-edu-muted leading-relaxed">
                  長年にわたり医療・環境分野で技術革新を続け、その成果を宇宙中の文明圏に無償で提供してきた。感謝の代償として、他勢力から武力紛争への不介入を求める平和外交を展開。この「技術による平和」のアプローチは、エレシオンを武力紛争の当事者から遠ざける一方で、宇宙規模の影響力を確立させた。リアナ・ソリス女王の治世では、さらに積極的な平和外交が展開され、対立する勢力間の緩和に多大な貢献を行っている。
                </p>
              </div>
            </RevealSection>

            {/* 現在の状況 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">現在の状況</h2>
                <div className="space-y-4 text-sm text-edu-muted leading-relaxed">
                  <p>
                    <Link href="/civilizations/tyeria" className="text-rose-400 hover:underline">ティエリア</Link>の軍拡路線に強く反対。「軍拡はさらなる争いを招く」と警鐘を鳴らし、軍事費の削減と平和的解決を訴えている。
                  </p>
                  <p>
                    <Link href="/civilizations/dioclenis" className="text-cyan-400 hover:underline">ディオクレニス</Link>の宇宙共同探査提案を支持し、科学技術の共有を通じた宇宙全体の発展を提唱。<Link href="/civilizations/granbell" className="text-amber-400 hover:underline">グランベル</Link>の宇宙連合会合でも、平和的解決と技術共有を推進する立場を表明。
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* 主要人物 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">主要人物</h2>
                <Link href="/wiki#女王リアナ・ソリス" className="block edu-card rounded-lg p-4 border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                  <h3 className="text-sm font-bold text-emerald-400">女王リアナ・ソリス</h3>
                  <p className="text-xs text-edu-muted mt-1">エレシオン女王。医療技術と環境再生技術で宇宙をリード。「軍拡はさらなる争いを招く」とティエリアに反対。</p>
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
                    <span className="text-edu-muted text-xs ml-2">— 経済援助と技術供与の関係</span>
                  </Link>
                  <Link href="/civilizations/tyeria" className="block p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <span className="text-rose-400 font-medium">ティエリア</span>
                    <span className="text-edu-muted text-xs ml-2">— 軍拡反対で対立</span>
                  </Link>
                  <Link href="/civilizations/dioclenis" className="block p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                    <span className="text-cyan-400 font-medium">ディオクレニス</span>
                    <span className="text-edu-muted text-xs ml-2">— 宇宙探査提案に協力的</span>
                  </Link>
                  <Link href="/civilizations/fallujah" className="block p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                    <span className="text-violet-400 font-medium">ファルージャ</span>
                    <span className="text-edu-muted text-xs ml-2">— 平和外交で連携</span>
                  </Link>
                </div>
              </div>
            </RevealSection>

            <Link href="/civilizations" className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-emerald-400 transition-colors">
              ← 文明圏一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
