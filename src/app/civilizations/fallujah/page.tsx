import Link from "next/link"
import { Scale, Globe2 } from "lucide-react"
import { PageHeader } from "@/platform/page-header"
import { RevealSection } from "@/platform/reveal-section"

export default function FallujahPage() {
  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Scale className="w-6 h-6 text-violet-400" />}
        title="ファルージャ"
        subtitle="宇宙ランキング第4位 — 文化的影響力と外交で対立勢力間の調停役"
        wikiHref={`/wiki/${encodeURIComponent("ファルージャ")}`}
      />
      <main className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <RevealSection>
            <div className="edu-card rounded-xl p-6 border border-violet-400/20">
              <h2 className="text-lg font-bold text-violet-400 mb-4">概要</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex gap-3">
                  <span className="text-violet-400 font-medium shrink-0 w-20">指導者</span>
                  <Link
                    href={`/wiki/${encodeURIComponent("マドリス・カーネル")}`}
                    className="text-edu-muted hover:text-violet-400 hover:underline"
                  >
                    評議会代表マドリス・カーネル
                  </Link>
                </div>
                <div className="flex gap-3">
                  <span className="text-violet-400 font-medium shrink-0 w-20">専門</span>
                  <span className="text-edu-muted">文化的影響力・外交</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-violet-400 font-medium shrink-0 w-20">理念</span>
                  <span className="text-edu-muted">「文化の力が宇宙全体を結びつける鍵」</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-violet-400 font-medium shrink-0 w-20">ランキング</span>
                  <span className="text-edu-muted">宇宙第4位</span>
                </div>
              </div>
              <p className="text-sm text-edu-muted leading-relaxed">
                ファルージャは文化的影響力と外交力で宇宙に君臨する文明圏。対立する勢力間の調停役として重要な地位を占め、
                <Link
                  href={`/wiki/${encodeURIComponent("マドリス・カーネル")}`}
                  className="text-edu-accent hover:underline"
                >
                  マドリス・カーネル
                </Link>
                代表の下、「文化の力が宇宙全体を結びつける鍵」という理念を掲げている。
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="edu-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-edu-text mb-4">歴史</h2>
              <p className="text-sm text-edu-muted leading-relaxed">
                古くから文化・芸術分野で独自の発展を遂げ、他文明圏に広範な文化的影響を与え続けてきた。その文化的影響力は、武力ではなく芸術・言語・思想を通じた「ソフトパワー」として機能し、宇宙規模の平和維持に不可欠な存在となっている。
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="edu-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-edu-text mb-4">現在の状況</h2>
              <p className="text-sm text-edu-muted leading-relaxed">
                <Link href="/civilizations/granbell" className="text-amber-400 hover:underline">
                  グランベル
                </Link>
                の経済的支配に対する懸念を表明。
                <Link href="/civilizations/tyeria" className="text-rose-400 hover:underline">
                  ティエリア
                </Link>
                と
                <Link href="/civilizations/elyseon" className="text-emerald-400 hover:underline">
                  エレシオン
                </Link>
                の対立の調停を試み、
                <Link
                  href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                  className="text-edu-accent hover:underline"
                >
                  宇宙連合会合
                </Link>
                で文化的交流の促進を提案。
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="edu-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-edu-text mb-4">主要人物</h2>
              <Link
                href={`/wiki/${encodeURIComponent("マドリス・カーネル")}`}
                className="block edu-card rounded-lg p-4 border border-violet-400/20 hover:border-violet-400/40 transition-colors"
              >
                <h3 className="text-sm font-bold text-violet-400">評議会代表マドリス・カーネル</h3>
                <p className="text-xs text-edu-muted mt-1">
                  ファルージャ評議会代表。「文化の力が宇宙全体を結びつける鍵」と信じる調停者。
                </p>
              </Link>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="edu-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-edu-text mb-4">勢力間関係</h2>
              <div className="space-y-2 text-sm">
                <Link
                  href="/civilizations/granbell"
                  className="block p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                >
                  <span className="text-amber-400 font-medium">グランベル</span>
                  <span className="text-edu-muted text-xs ml-2">— 経済的支配への懸念</span>
                </Link>
                <Link
                  href="/civilizations/elyseon"
                  className="block p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                >
                  <span className="text-emerald-400 font-medium">エレシオン</span>
                  <span className="text-edu-muted text-xs ml-2">— 平和外交で連携</span>
                </Link>
                <Link
                  href="/civilizations/dioclenis"
                  className="block p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-cyan-400 font-medium">ディオクレニス</span>
                  <span className="text-edu-muted text-xs ml-2">— 文化交流で協力</span>
                </Link>
              </div>
            </div>
          </RevealSection>

          <Link
            href="/civilizations"
            className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-violet-400 transition-colors"
          >
            ← 文明圏一覧に戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
