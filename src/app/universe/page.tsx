"use client"
import Link from "next/link"
import { Globe2, Star, Users, Zap } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"

function PlanetCard({
  icon,
  title,
  titleEn,
  color,
  borderColor,
  wikiHref,
  stats,
  description,
  regions,
}: {
  icon: React.ReactNode
  title: string
  titleEn: string
  color: string
  borderColor: string
  wikiHref: string
  stats: [string, React.ReactNode][]
  description: string
  regions?: { name: string; wiki: string | null }[][]
}) {
  return (
    <div
      className={`edu-card rounded-xl p-6 transition-all duration-300 border ${borderColor}`}
    >
      <h3 className={`text-lg font-bold ${color} mb-4 flex items-center gap-2`}>
        {icon}{" "}
        <Link href={wikiHref} className={`${color} hover:underline`}>
          {title}
        </Link>
      </h3>
      <div className="space-y-3">
        {stats.map(([k, v]) => (
          <div key={String(k)} className="flex gap-3 text-sm">
            <span className="text-edu-accent font-medium shrink-0 w-20">{k}</span>
            <span className="text-edu-muted">{v}</span>
          </div>
        ))}
      </div>
      {description && (
        <p className="mt-4 text-xs text-edu-muted leading-relaxed">{description}</p>
      )}
      {regions && regions.length > 0 && (
        <div className="mt-4 space-y-2">
          {regions.map((group, gi) => (
            <div key={gi} className="bg-edu-bg/50 rounded-lg p-3">
              {group.map((r) => (
                <span
                  key={r.name}
                  className="text-xs bg-edu-surface px-2 py-0.5 rounded text-edu-muted mr-1.5 mb-1 inline-block"
                >
                  {r.wiki ? (
                    <Link href={r.wiki} className="hover:text-edu-accent2 hover:underline">
                      {r.name}
                    </Link>
                  ) : (
                    r.name
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function UniversePage() {
  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
          title="全宇宙・星系構造"
          subtitle="M104銀河全域 — E16連星系・Eros-7・惑星ビブリオ・惑星Solaris"
          wikiHref="/wiki#E16連星系"
        />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 pb-20">
            {/* 概説 */}
            <div className="edu-card rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-edu-accent2" /> Eternal Dominion Universe —
                全宇宙像
              </h2>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  Eternal Dominion Universe は、
                  <span className="text-edu-accent2 font-medium">M104（NGC 4594）銀河</span>
                  を舞台とする壮大な文明圏である。AD
                  3500年に地球を離脱した人類は、M104銀河のハロー領域に到達し、E16連星系を第一の故郷として文明を築き上げた。しかし、人類の活動はE16に留まらず、周辺の惑星や星系へと拡大していった。
                </p>
                <p>
                  現在、M104銀河内には
                  <span className="text-edu-accent2 font-medium">E16連星系</span>
                  のほかに、女性主導のマトリカル社会を持つ
                  <span className="text-pink-400 font-medium">Eros-7</span>
                  、学術・研究の中心地である
                  <span className="text-emerald-400 font-medium">惑星ビブリオ</span>、そして
                  <span className="text-orange-400 font-medium">惑星Solaris</span>
                  など、複数の居住世界が存在する。それぞれの惑星は独自の政治体制・文化・歴史を持ちながらも、星間経済協同組合
                  <span className="text-cyan-400 font-medium">UECO</span>や
                  <span className="text-cyan-400 font-medium">銀河系コンソーシアム</span>
                  を通じて緩やかに結合されている。
                </p>
                <p>
                  この宇宙の政治は多極的であり、E16内ではトリニティ・アライアンスとV7が東西大陸の覇権を争い、Eros-7ではマトリカル・カウンシルとシャドウ・ユニオンが社会制度を巡って対立している。さらに銀河規模では、バーズ帝国からテクロサスを経て銀河系コンソーシアムに至る壮大な政治変遷の歴史が刻まれている。
                </p>
              </div>
            </div>

            {/* 宇宙マップ概略 */}
            <div className="edu-card rounded-xl p-6 mb-8 border border-cyan-500/20">
              <h3 className="text-base font-bold text-edu-text mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                銀河規模組織
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <Link href="/wiki#UECO" className="text-cyan-400 hover:underline">
                      UECO
                    </Link>
                  </h4>
                  <p className="text-xs text-edu-muted leading-relaxed">
                    星間経済協同組合。各惑星間の経済活動を調整し、通貨・貿易のルールを統轄する。ヒーローエージェンシーと統合され、銀河系コンソーシアムの中核となった。
                  </p>
                </div>
                <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <Link
                      href="/wiki#銀河系コンソーシアム"
                      className="text-cyan-400 hover:underline"
                    >
                      銀河系コンソーシアム
                    </Link>
                  </h4>
                  <p className="text-xs text-edu-muted leading-relaxed">
                    E495〜E500年に設立された統合体。ネオクラン同盟・UECO・ヒーローエージェンシーが統合。トゥキディデスの罠回避を志向する全宇宙規模の協力枠組み。
                  </p>
                </div>
                <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <Link href="/wiki#M104銀河" className="text-cyan-400 hover:underline">
                      M104銀河（NGC 4594）
                    </Link>
                  </h4>
                  <p className="text-xs text-edu-muted leading-relaxed">
                    sombrero
                    galaxy。E16連星系やEros-7などの居住世界が存在する銀河。ハロー領域に人類文明が展開している。
                  </p>
                </div>
              </div>
            </div>

            {/* 星系・惑星カード */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* E16 Binary Star System */}
              <PlanetCard
                icon={<Star className="w-5 h-5" />}
                title="E16連星系"
                titleEn="E16 Binary System"
                color="text-edu-accent2"
                borderColor="border-edu-accent2/20"
                wikiHref="/wiki#E16連星系"
                stats={[
                  ["所在", "M104銀河ハロー某所"],
                  ["主星", "Ea16（黄白色巨星）"],
                  ["伴星", "Eb16（赤色矮星）"],
                  [
                    "主要惑星",
                    <Link
                      key="s"
                      href="/wiki#シンフォニー・オブ・スターズ"
                      className="text-edu-muted hover:text-edu-accent2 hover:underline"
                    >
                      シンフォニー・オブ・スターズ
                    </Link>,
                  ],
                  ["自転周期", "44時間4分"],
                  ["暦法", "東暦（E暦）E1 = AD 3501"],
                ]}
                description="人類が最初に到達した星系。西大陸のGigapolis圈と東大陸のクレセント大地方の二大文明圏を擁し、E16文明の中心地。"
                regions={[
                  [
                    { name: "Gigapolis", wiki: "/wiki#ギガポリス" },
                    { name: "Chem", wiki: null },
                    { name: "Abrivo", wiki: null },
                    { name: "Troyane", wiki: null },
                    { name: "Ronve", wiki: null },
                    { name: "Valoria", wiki: "/wiki#Valoria連合圏" },
                    { name: "Persepolis", wiki: null },
                  ],
                  [
                    { name: "ヴァーミリオン", wiki: "/wiki#ヴァーミリオン" },
                    { name: "ブルー・ローズ", wiki: "/wiki#ブルーローズ" },
                    { name: "ミエルテンガ", wiki: "/wiki#ミエルテンガ" },
                    { name: "クロセヴィア", wiki: null },
                    { name: "アイアン・シンジケート", wiki: null },
                    { name: "ファティマ連邦", wiki: null },
                  ],
                ]}
              />

              {/* Eros-7 */}
              <PlanetCard
                icon={<Globe2 className="w-5 h-5" />}
                title="Eros-7"
                titleEn="Eros-7"
                color="text-pink-400"
                borderColor="border-pink-400/20"
                wikiHref="/wiki#Eros-7"
                stats={[
                  ["所在", "E16外縁"],
                  ["重力", "1.1G"],
                  ["大気", "薄い酸素大気"],
                  [
                    "社会体制",
                    <Link
                      key="mc"
                      href="/wiki#マトリカル・カウンシル"
                      className="text-edu-muted hover:text-pink-400 hover:underline"
                    >
                      マトリカル社会（女性主導）
                    </Link>,
                  ],
                  [
                    "統治機関",
                    <Link
                      key="ms"
                      href="/wiki#男性指令省"
                      className="text-edu-muted hover:text-pink-400 hover:underline"
                    >
                      男性指令省
                    </Link>,
                  ],
                  [
                    "対立組織",
                    <Link
                      key="su"
                      href="/wiki#シャドウ・ユニオン"
                      className="text-edu-muted hover:text-pink-400 hover:underline"
                    >
                      シャドウ・ユニオン
                    </Link>,
                  ],
                ]}
                description="女性主導のマトリカル社会が形成された惑星。搾取生物とエスパー能力をめぐる独自の文明を発展させ、E525年にはマトリカル・リフォーム運動が勃発。リリス・ヴェイン、シルヴィア・クロウ、アヤカ・リンなどの英雄を輩出。"
                regions={[
                  [
                    { name: "ネオンクレーター宮殿", wiki: "/wiki#ネオンクレーター宮殿" },
                    { name: "スクイーズ・アビス", wiki: "/wiki#スクイーズ・アビス" },
                    { name: "アンダーグリッド", wiki: "/wiki#アンダーグリッド" },
                    { name: "セントラル・タワー", wiki: "/wiki#セントラル・タワー" },
                  ],
                ]}
              />

              {/* 惑星ビブリオ */}
              <PlanetCard
                icon={<Globe2 className="w-5 h-5" />}
                title="惑星ビブリオ"
                titleEn="Planet Bibliotheca"
                color="text-emerald-400"
                borderColor="border-emerald-400/20"
                wikiHref="/wiki#惑星ビブリオ"
                stats={[
                  ["所在", "M104銀河内"],
                  ["特徴", "学術・研究の中心地"],
                  [
                    "主要施設",
                    <Link
                      key="uu"
                      href="/wiki#ビブリオ国際大学"
                      className="text-edu-muted hover:text-emerald-400 hover:underline"
                    >
                      ビブリオ国際大学
                    </Link>,
                  ],
                  [
                    "関連人物",
                    <Link
                      key="mi"
                      href="/wiki#ミナ・エウレカ・エルンスト"
                      className="text-edu-muted hover:text-emerald-400 hover:underline"
                    >
                      ミナ（E514年入学）
                    </Link>,
                  ],
                ]}
                description="M104銀河内に位置する学術惑星。ビブリオ国際大学を擁し、AI学部をはじめとする高度な教育・研究機関が集積している。ミナ・エウレカ・エルンストはE514年にこの惑星のAI学部に入学し、後のリミナル・フォージ構想の種を育んだ。"
              />

              {/* 惑星Solaris */}
              <PlanetCard
                icon={<Globe2 className="w-5 h-5" />}
                title="惑星Solaris"
                titleEn="Planet Solaris"
                color="text-orange-400"
                borderColor="border-orange-400/20"
                wikiHref="/wiki#惑星Solaris"
                stats={[
                  ["所在", "M104銀河内"],
                  ["特徴", "恒星エネルギー研究"],
                ]}
                description="M104銀河内に位置する惑星。恒星エネルギーの研究拠点として機能し、銀河系コンソーシアムの技術基盤を支える一翼を担っている。"
              />
            </div>

            {/* 宇宙5大文明圏 */}
            <RevealSection>
              <div className="edu-card rounded-xl p-6 border border-amber-500/20 mb-8">
                <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  宇宙5大文明圏
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Link href="/civilizations/granbell" className="bg-edu-bg/50 rounded-lg p-3 border border-amber-400/20 hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-400">グランベル</span>
                      <span className="text-xs text-edu-muted">#1</span>
                    </div>
                    <p className="text-xs text-edu-muted mt-1">量子経済・次元間技術 — GDP150兆ドル</p>
                  </Link>
                  <Link href="/civilizations/elyseon" className="bg-edu-bg/50 rounded-lg p-3 border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400">エレシオン</span>
                      <span className="text-xs text-edu-muted">#2</span>
                    </div>
                    <p className="text-xs text-edu-muted mt-1">医療技術・環境再生 — 平和外交</p>
                  </Link>
                  <Link href="/civilizations/tyeria" className="bg-edu-bg/50 rounded-lg p-3 border border-rose-400/20 hover:border-rose-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-rose-400">ティエリア</span>
                      <span className="text-xs text-edu-muted">#3</span>
                    </div>
                    <p className="text-xs text-edu-muted mt-1">軍事力・防衛ネットワーク</p>
                  </Link>
                  <Link href="/civilizations/fallujah" className="bg-edu-bg/50 rounded-lg p-3 border border-violet-400/20 hover:border-violet-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-violet-400">ファルージャ</span>
                      <span className="text-xs text-edu-muted">#4</span>
                    </div>
                    <p className="text-xs text-edu-muted mt-1">文化的影響力・外交・調停</p>
                  </Link>
                  <Link href="/civilizations/dioclenis" className="bg-edu-bg/50 rounded-lg p-3 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-400">ディオクレニス</span>
                      <span className="text-xs text-edu-muted">#5</span>
                    </div>
                    <p className="text-xs text-edu-muted mt-1">宇宙探査・科学技術研究</p>
                  </Link>
                  <Link href="/civilizations" className="bg-edu-bg/50 rounded-lg p-3 border border-edu-border/30 hover:border-amber-400/40 transition-colors flex items-center justify-center">
                    <span className="text-xs text-edu-muted">全文明圏を見る →</span>
                  </Link>
                </div>
              </div>
            </RevealSection>
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
