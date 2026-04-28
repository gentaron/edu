import React from "react"
import Link from "next/link"
import {
  Star,
  Globe2,
  Users,
  Zap,
  Shield,
  Swords,
  Crown,
  Scroll,
  Radio,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BookOpen,
  ExternalLink,
  Atom,
} from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"

/* ═══════════════════════════════════════════
   DATA — preserved exactly
   ═══════════════════════════════════════════ */
const SECTION_PAGES = [
  {
    href: "/universe",
    icon: <Globe2 className="w-6 h-6" />,
    title: "全宇宙・星系構造",
    desc: "E16連星系、Eros-7、惑星ビブリオ、惑星Solaris — M104銀河全域の天文データ",
  },
  {
    href: "/civilizations",
    icon: <Globe2 className="w-6 h-6" />,
    title: "宇宙5大文明圏",
    desc: "グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙勢力の全貌",
  },
  {
    href: "/timeline",
    icon: <Scroll className="w-6 h-6" />,
    title: "統合年表",
    desc: "AD3500〜E528の全宇宙人類史。バーズ帝国から銀河系コンソーシアムまで",
  },
  {
    href: "/auralis",
    icon: <Sparkles className="w-6 h-6" />,
    title: "AURALIS Collective",
    desc: "「光と音を永遠にする」— 第一世代〜第二世代の完全記録",
  },
  {
    href: "/mina",
    icon: <Users className="w-6 h-6" />,
    title: "ミナ・エウレカ・エルンスト",
    desc: "AURALIS第二世代。リミナル・フォージ創設者",
  },
  {
    href: "/liminal",
    icon: <Radio className="w-6 h-6" />,
    title: "リミナル・フォージ",
    desc: "E528からAD2026へ、時空を超えた放送プロジェクト",
  },
  {
    href: "/iris",
    icon: <Shield className="w-6 h-6" />,
    title: "アイリス",
    desc: "トリニティ・アライアンス指導者。IRIS 1位の戦士と政治",
  },
  {
    href: "/characters",
    icon: <Crown className="w-6 h-6" />,
    title: "キャラクターTier表",
    desc: "全64キャラクターのカードデータと勢力別一覧",
  },
  {
    href: "/factions",
    icon: <Swords className="w-6 h-6" />,
    title: "勢力系譜",
    desc: "テクロサス・アルファ・ヴェノム・政体系・Eros-7・宇宙帝国系の全系譜",
  },
  {
    href: "/technology",
    icon: <Atom className="w-6 h-6" />,
    title: "技術体系",
    desc: "7つのコア技術の物理学的解説と次元ピラミッド",
  },
]

const QUICK_ACCESS_CARDS = [
  {
    href: "/wiki",
    icon: <BookOpen className="w-7 h-7" />,
    title: "EDU Wiki 百科事典",
    desc: "全宇宙の百科事典。E16・Eros-7・ビブリオ・Solarisのキャラクター・歴史・組織を網羅",
    tag: "READ",
  },
  {
    href: "/story",
    icon: <Scroll className="w-7 h-7" />,
    title: "Story 小説集",
    desc: "5章20話の連作小説。黎明編から新世界編までの全文収録",
    tag: "STORY",
  },
  {
    href: "/card-game/select",
    icon: <Swords className="w-7 h-7" />,
    title: "PvE バトル",
    desc: "NORMAL・HARD・BOSS・FINALの4段階10種の敵と戦う",
    tag: "BATTLE",
  },
  {
    href: "/ranking",
    icon: <TrendingUp className="w-7 h-7" />,
    title: "世界長者番付",
    desc: "E16経済圏の富豪ランキング。推定資産をnトークンで公開",
    tag: "RANKING",
  },
]

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider text-edu-text mb-4 leading-tight">
          Eternal Dominion
          <br />
          Universe
        </h1>
        <hr className="edu-divider mx-auto w-24 mb-6" />
        <p className="text-lg sm:text-xl text-edu-muted font-light tracking-widest mb-2">
          統合時空構造書 v3.0
        </p>
        <p className="text-sm sm:text-base text-edu-accent2 tracking-wide mb-8">
          M104銀河全域 — E16・Eros-7・ビブリオ・Solaris
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="edu-tag">
            <Star className="w-3 h-3 mr-1 inline-block align-text-bottom" />E16連星系
          </span>
          <span className="edu-tag">
            <Globe2 className="w-3 h-3 mr-1 inline-block align-text-bottom" />Eros-7
          </span>
          <span className="edu-tag">
            <Zap className="w-3 h-3 mr-1 inline-block align-text-bottom" />AURALIS
          </span>
          <span className="edu-tag">
            <Radio className="w-3 h-3 mr-1 inline-block align-text-bottom" />Liminal Forge
          </span>
          <span className="edu-tag">
            <Shield className="w-3 h-3 mr-1 inline-block align-text-bottom" />Iris Worlds
          </span>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   QUICK ACCESS — 4 flat cards
   ═══════════════════════════════════════════ */
function QuickAccessSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACCESS_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="edu-card group p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-edu-accent">{card.icon}</span>
                <span className="text-[10px] font-bold tracking-widest text-edu-accent opacity-50">
                  {card.tag}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-edu-text mb-1 flex items-center gap-1.5">
                  {card.title}
                  <ExternalLink className="w-3.5 h-3.5 text-edu-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-edu-muted leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION GRID
   ═══════════════════════════════════════════ */
function SectionGrid() {
  return (
    <section id="sections" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
            title="統合時空構造書 — セクション一覧"
            subtitle="各セクションの詳細ページへ移動"
          />
        </RevealSection>
        <RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTION_PAGES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="edu-card group p-6 flex flex-col gap-3"
              >
                <span className="text-edu-accent">{s.icon}</span>
                <h3 className="text-sm font-bold text-edu-text mb-1">{s.title}</h3>
                <p className="text-xs text-edu-muted leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CONSISTENCY NOTES
   ═══════════════════════════════════════════ */
function ConsistencySection() {
  return (
    <section id="consistency" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<AlertTriangle className="w-6 h-6 text-edu-accent" />}
            title="⭐ 整合性ノート"
            subtitle="Eternal Dominion Universeにおける重要な設定整合性の確認"
          />
        </RevealSection>
        <RevealSection>
          <div className="space-y-4">
            {/* Note 1 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-edu-accent/15 flex items-center justify-center text-sm font-bold text-edu-accent">
                  1
                </div>
                <h3 className="text-base font-bold text-edu-accent">「ギガポリス」名称の整合性</h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  ミナ・エウレカは「
                  <span className="text-edu-text font-medium">Gigapolis</span>」と呼んでいる。
                </p>
                <p>
                  彼女の時代（E499〜E528）、この都市はエヴァトロンによって「
                  <span className="text-red-400 font-medium">エヴァポリス（Evapolis）</span>
                  」と改名されていた。
                </p>
                <p>しかし、これはあくまでエヴァトロン側が付けた一方的な名称に過ぎない。</p>
                <p>
                  ミナをはじめとする人々は、セリア黄金期の伝統的な名称「
                  <span className="text-edu-accent2 font-medium">Gigapolis</span>
                  」を精神的故郷の名として使い続けている。
                </p>
                <p>
                  E475以降のポスト・エヴァトロン期では、歴史的正当性を持つ「Gigapolis」の名称復帰が進んでいる。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論: ミナが「Gigapolis」と呼ぶことには全く矛盾がない
                  </p>
                </div>
              </div>
            </div>

            {/* Note 2 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-edu-accent2/15 flex items-center justify-center text-sm font-bold text-edu-accent2">
                  2
                </div>
                <h3 className="text-base font-bold text-edu-accent2">
                  AURALIS初代は5名ではなかった
                </h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  第二世代（現行）は
                  <span className="text-edu-accent font-medium">5名体制</span>（Kate Patton,
                  Lillie Ardent, Layla, Mina, Ninny）。
                </p>
                <p>しかし、第一世代（E290〜）は5名ではなかった。</p>
                <p>
                  初代は <span className="text-edu-text font-medium">Kate Claudia</span> と{" "}
                  <span className="text-edu-text font-medium">Lily Steiner</span>{" "}
                  を中心とする集団で、Layla Virell NovaがE325以降に参加。
                </p>
                <p>初代の正確な構成員数は記録が散逸しており不明。</p>
                <p>
                  「名」の継承制度（Kate Claudia → Kate Patton, Lily Steiner → Lillie
                  Ardent）はAURALISの伝統だが、組織形態自体は代ごとに異なる。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論:
                    第二世代の5人体制は「復興期の新たな形」であり、初代をそのまま模倣したものではない
                  </p>
                </div>
              </div>
            </div>

            {/* Note 3 */}
            <div className="edu-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-500/15 flex items-center justify-center text-sm font-bold text-pink-400">
                  3
                </div>
                <h3 className="text-base font-bold text-pink-400">
                  Laylaは冷凍保存から復活 — ミナたちと同年代
                </h3>
              </div>
              <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                <p>
                  これまでの記述ではLaylaが「サイバネティクス強化による200年以上の現役」とされていたが、
                  <span className="text-red-400 font-medium">これは誤り</span>。
                </p>
                <p>
                  実際にはエヴァトロン時代の弾圧の中で、その実力ゆえに
                  <span className="text-edu-text font-medium">特別措置として冷凍保存</span>
                  されていた。サイバネティクスによる寿命延伸ではない。
                </p>
                <p>
                  復活後のLaylaはミナ・Kate Patton・Lillie Ardentと
                  <span className="text-edu-accent2 font-medium">同年代</span>
                  であり、「E325からの200年現役」という説明は当てはまらない。
                </p>
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs font-medium">
                    ✓ 結論: Laylaは冷凍保存からの復活であり、現在は第二世代の他メンバーと同年代
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="py-12 px-4">
      <hr className="edu-divider mb-8" />
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm font-bold text-edu-text">
          Eternal Dominion Universe 統合時空構造書 v3.0
        </p>
        <p className="text-xs text-edu-muted">AURALIS 地球2026交信プロジェクト設定書 v2.0</p>
        <div className="flex justify-center gap-4 text-xs text-edu-muted">
          <Link href="/wiki" className="edu-link">
            Wiki
          </Link>
          <span className="text-edu-border">|</span>
          <Link href="/story/IRIS_1" className="edu-link">
            Story
          </Link>
          <span className="text-edu-border">|</span>
          <span>E528 / AD2026</span>
          <span className="text-edu-border">|</span>
          <span>光と音を永遠にする</span>
        </div>
        <div className="flex justify-center flex-wrap gap-3 pt-2">
          {SECTION_PAGES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-[10px] text-edu-muted hover:text-edu-accent transition-colors"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-edu-bg flex flex-col">
      <StarField />
      <main className="relative z-10 flex-1">
        <HeroSection />
        <RevealSection>
          <QuickAccessSection />
        </RevealSection>
        <hr className="edu-divider mx-auto max-w-5xl" />
        <SectionGrid />
        <hr className="edu-divider mx-auto max-w-5xl" />
        <ConsistencySection />
      </main>
      <FooterSection />
    </div>
  )
}
