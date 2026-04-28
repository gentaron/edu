import Link from "next/link"
import { Crown, Globe2 } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { PageHeader } from "@/components/edu/page-header"
import { RevealSection } from "@/components/edu/reveal-section"

export default function GranbellPage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Crown className="w-6 h-6 text-amber-400" />}
          title="グランベル"
          subtitle="宇宙ランキング第1位 — GDP150兆ドルで宇宙全体の約25%を占める経済大国"
          wikiHref={`/wiki/${encodeURIComponent("グランベル")}`}
        />
        <main className="px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 概要 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6 border border-amber-400/20">
                <h2 className="text-lg font-bold text-amber-400 mb-4">概要</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex gap-3"><span className="text-amber-400 font-medium shrink-0 w-20">首都</span><span className="text-edu-muted">オルダシティ</span></div>
                  <div className="flex gap-3"><span className="text-amber-400 font-medium shrink-0 w-20">GDP</span><span className="text-edu-muted">150兆ドル（宇宙全体の約25%）</span></div>
                  <div className="flex gap-3"><span className="text-amber-400 font-medium shrink-0 w-20">指導者</span><Link href={`/wiki/${encodeURIComponent("アルゼン・カーリーン")}`} className="text-edu-muted hover:text-amber-400 hover:underline">アルゼン・カーリーン大統領</Link></div>
                  <div className="flex gap-3"><span className="text-amber-400 font-medium shrink-0 w-20">専門</span><span className="text-edu-muted">量子経済・次元間技術・マルチバース開拓</span></div>
                  <div className="flex gap-3"><span className="text-amber-400 font-medium shrink-0 w-20">ランキング</span><span className="text-edu-muted">宇宙第1位</span></div>
                </div>
                <p className="text-sm text-edu-muted leading-relaxed">
                  グランベルは宇宙最大の経済圏であり、そのGDPは宇宙全体の約25%を占める圧倒的な経済大国である。首都<Link href={`/wiki/${encodeURIComponent("オルダシティ")}`} className="text-edu-accent hover:underline">オルダシティ</Link>は宇宙最大の金融センターとして機能し、量子経済システムと次元間技術で他勢力を完全に圧倒している。マルチバース開拓を推進し、次元間貿易網を構築することで、その経済的支配力は宇宙全土に及んでいる。
                </p>
              </div>
            </RevealSection>

            {/* 歴史 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">歴史</h2>
                <div className="space-y-4 text-sm text-edu-muted leading-relaxed">
                  <p>
                    グランベルの台頭は、<Link href={`/wiki/${encodeURIComponent("アポロン・Dominion大戦")}`} className="text-edu-accent hover:underline">アポロン・Dominion大戦</Link>の傍観から始まった。大戦前は宇宙第2位のGDPに過ぎなかったが、アポロンとDominionの激戦で両勢力が壊滅的な打撃を受けた戦後の混乱期に、グランベルは他勢力が疲弊する中で急浮上した。
                  </p>
                  <p>
                    初期リーダーは<Link href={`/wiki/${encodeURIComponent("マスター・クインシアス")}`} className="text-edu-accent hover:underline">マスター・クインシアス</Link>であり、<Link href={`/wiki/${encodeURIComponent("セリア・ドミニクス")}`} className="text-edu-accent hover:underline">セリア・ドミニクス</Link>のドミニクス時代（<Link href={`/wiki/${encodeURIComponent("セリア黄金期")}`} className="text-edu-accent hover:underline">Selinopolis黄金期</Link>）を高く評価していたことが知られている。セリアの<Link href={`/wiki/${encodeURIComponent("nトークン")}`} className="text-edu-accent hover:underline">nトークン</Link>経済システムや<Link href={`/wiki/${encodeURIComponent("フェルミ音楽")}`} className="text-edu-accent hover:underline">フェルミ音楽</Link>の頂点を理想の統治モデルとして見ていた。
                  </p>
                  <p>
                    現在のアルゼン・カーリーン大統領の下で経済帝国を完成させ、マルチバース開拓と次元間技術で他勢力を完全に圧倒。また、<Link href={`/wiki/${encodeURIComponent("エヴァトロン")}`} className="text-edu-accent hover:underline">エヴァトロン</Link>に対して高次元エネルギー兵器、量子制御ミサイル、重力崩壊弾頭などの武器供与を行い、軍事的影響力も拡大した。
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* 現在の状況 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">現在の状況</h2>
                <div className="space-y-4 text-sm text-edu-muted leading-relaxed">
                  <p>
                    <Link href={`/wiki/${encodeURIComponent("宇宙連合会合")}`} className="text-edu-accent hover:underline">第一回宇宙連合会合</Link>を首都<Link href={`/wiki/${encodeURIComponent("オルダシティ")}`} className="text-edu-accent hover:underline">オルダシティ</Link>で開催。カーリーン大統領は「争いを超え、共存と繁栄の道を見つけることが次世代への責任」という歴史的演説を行った。
                  </p>
                  <p>
                    しかし、その圧倒的な経済的支配力は他勢力に緊張を与えている。<Link href={`/wiki/${encodeURIComponent("ティエリア")}`} className="text-rose-400 hover:underline">ティエリア</Link>は軍事力で均衡を図り、<Link href={`/wiki/${encodeURIComponent("ディオクレニス")}`} className="text-cyan-400 hover:underline">ディオクレニス</Link>の<Link href={`/wiki/${encodeURIComponent("ネイサン・コリンド")}`} className="text-edu-accent hover:underline">ネイサン・コリンド</Link>は「<Link href={`/wiki/${encodeURIComponent("トゥキディデスの罠")}`} className="text-edu-accent hover:underline">トゥキディデスの罠</Link>」の危険性を指摘している。
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* 主要人物 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">主要人物</h2>
                <div className="space-y-3">
                  <Link href={`/wiki/${encodeURIComponent("アルゼン・カーリーン")}`} className="block edu-card rounded-lg p-4 border border-amber-400/20 hover:border-amber-400/40 transition-colors">
                    <h3 className="text-sm font-bold text-amber-400">アルゼン・カーリーン大統領</h3>
                    <p className="text-xs text-edu-muted mt-1">グランベル現大統領。GDP150兆ドルの経済帝国を率いる。<Link href={`/wiki/${encodeURIComponent("宇宙連合会合")}`} className="text-edu-accent hover:underline">宇宙連合会合</Link>で「共存と繁栄」を演説。</p>
                  </Link>
                  <Link href={`/wiki/${encodeURIComponent("マスター・クインシアス")}`} className="block edu-card rounded-lg p-4 border border-edu-border/30 hover:border-edu-border/50 transition-colors">
                    <h3 className="text-sm font-bold text-edu-text">マスター・クインシアス</h3>
                    <p className="text-xs text-edu-muted mt-1">グランベル初期リーダー。<Link href={`/wiki/${encodeURIComponent("セリア・ドミニクス")}`} className="text-edu-accent hover:underline">セリア</Link>のドミニクス時代を高く評価。</p>
                  </Link>
                </div>
              </div>
            </RevealSection>

            {/* 関係性 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6">
                <h2 className="text-lg font-bold text-edu-text mb-4">勢力間関係</h2>
                <div className="space-y-2 text-sm">
                  <Link href="/civilizations/elyseon" className="block p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                    <span className="text-emerald-400 font-medium">エレシオン</span>
                    <span className="text-edu-muted text-xs ml-2">— 経済援助と医療技術供与のパートナー</span>
                  </Link>
                  <Link href="/civilizations/tyeria" className="block p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <span className="text-rose-400 font-medium">ティエリア</span>
                    <span className="text-edu-muted text-xs ml-2">— トゥキディデスの罠の危険性が指摘される対立関係</span>
                  </Link>
                  <Link href="/civilizations/fallujah" className="block p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                    <span className="text-violet-400 font-medium">ファルージャ</span>
                    <span className="text-edu-muted text-xs ml-2">— 文化外交面での協力</span>
                  </Link>
                  <Link href="/civilizations/dioclenis" className="block p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                    <span className="text-cyan-400 font-medium">ディオクレニス</span>
                    <span className="text-edu-muted text-xs ml-2">— 科学技術分野での提携</span>
                  </Link>
                </div>
              </div>
            </RevealSection>

            <Link href="/civilizations" className="inline-flex items-center gap-1 text-xs text-edu-muted hover:text-amber-400 transition-colors">
              ← 文明圏一覧に戻る
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
