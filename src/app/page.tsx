"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ChevronDown,
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

const SECTION_PAGES = [
  {
    href: "/universe",
    icon: <Globe2 className="w-6 h-6" />,
    title: "全宇宙・星系構造",
    desc: "E16連星系、Eros-7、惑星ビブリオ、惑星Solaris — M104銀河全域の天文データ",
    color: "text-electric-blue",
    borderColor: "border-electric-blue/30 hover:border-electric-blue/60",
  },
  {
    href: "/timeline",
    icon: <Scroll className="w-6 h-6" />,
    title: "統合年表",
    desc: "AD3500〜E528の全宇宙人類史。バーズ帝国から銀河系コンソーシアムまで",
    color: "text-gold-accent",
    borderColor: "border-gold-accent/30 hover:border-gold-accent/60",
  },
  {
    href: "/auralis",
    icon: <Sparkles className="w-6 h-6" />,
    title: "AURALIS Collective",
    desc: "「光と音を永遠にする」— 第一世代〜第二世代の完全記録",
    color: "text-electric-blue",
    borderColor: "border-electric-blue/30 hover:border-electric-blue/60",
  },
  {
    href: "/mina",
    icon: <Users className="w-6 h-6" />,
    title: "ミナ・エウレカ・エルンスト",
    desc: "AURALIS第二世代。リミナル・フォージ創設者",
    color: "text-blue-400",
    borderColor: "border-blue-400/30 hover:border-blue-400/60",
  },
  {
    href: "/liminal",
    icon: <Radio className="w-6 h-6" />,
    title: "リミナル・フォージ",
    desc: "E528からAD2026へ、時空を超えた放送プロジェクト",
    color: "text-gold-accent",
    borderColor: "border-gold-accent/30 hover:border-gold-accent/60",
  },
  {
    href: "/iris",
    icon: <Shield className="w-6 h-6" />,
    title: "アイリス",
    desc: "トリニティ・アライアンス指導者。IRIS 1位の戦士と政治",
    color: "text-rose-400",
    borderColor: "border-rose-400/30 hover:border-rose-400/60",
  },
  {
    href: "/characters",
    icon: <Crown className="w-6 h-6" />,
    title: "キャラクターTier表",
    desc: "全64キャラクターのカードデータと勢力別一覧",
    color: "text-gold-accent",
    borderColor: "border-gold-accent/30 hover:border-gold-accent/60",
  },
  {
    href: "/factions",
    icon: <Swords className="w-6 h-6" />,
    title: "勢力系譜",
    desc: "テクロサス・アルファ・ヴェノム・政体系・Eros-7・宇宙帝国系の全系譜",
    color: "text-red-400",
    borderColor: "border-red-400/30 hover:border-red-400/60",
  },
  {
    href: "/technology",
    icon: <Atom className="w-6 h-6" />,
    title: "技術体系",
    desc: "7つのコア技術の物理学的解説と次元ピラミッド",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30 hover:border-cyan-400/60",
  },
]

/* ═══════════════════════════════════════════
   QUICK ACCESS CARDS
   ═══════════════════════════════════════════ */
function QuickAccessSection() {
  const cards = [
    {
      href: "/wiki",
      icon: <BookOpen className="w-8 h-8" />,
      title: "EDU Wiki 百科事典",
      desc: "全宇宙の百科事典。E16・Eros-7・ビブリオ・Solarisのキャラクター・歴史・組織を網羅",
      gradient: "from-gold-accent/20 via-nebula-purple/20 to-electric-blue/20",
      iconColor: "text-gold-accent",
      borderColor: "border-gold-accent/30 hover:border-gold-accent/60",
      tag: "READ",
    },
    {
      href: "/story",
      icon: <Scroll className="w-8 h-8" />,
      title: "Story 小説集",
      desc: "5章20話の連作小説。黎明編から新世界編までの全文収録",
      gradient: "from-cyan-500/20 via-blue-500/20 to-nebula-purple/20",
      iconColor: "text-cyan-400",
      borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
      tag: "STORY",
    },
    {
      href: "/card-game/select",
      icon: <Swords className="w-8 h-8" />,
      title: "PvE バトル",
      desc: "NORMAL・HARD・BOSS・FINALの4段階10種の敵と戦う",
      gradient: "from-orange-500/20 via-red-500/20 to-purple-500/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/30 hover:border-orange-400/60",
      tag: "BATTLE",
    },
    {
      href: "/ranking",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "世界長者番付",
      desc: "E16経済圏の富豪ランキング。推定資産をnトークンで公開",
      gradient: "from-emerald-500/20 via-gold-accent/20 to-nebula-purple/20",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/30 hover:border-emerald-400/60",
      tag: "RANKING",
    },
  ]

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-cosmic-dark/50`}
            >
              <div className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`${card.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {card.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold tracking-widest ${card.iconColor} opacity-60`}
                  >
                    {card.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-cosmic-text mb-1 flex items-center gap-1.5">
                    {card.title}
                    <ExternalLink
                      className={`w-3.5 h-3.5 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </h3>
                  <p className="text-xs text-cosmic-muted leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/edu-hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/60 via-cosmic-dark/40 to-cosmic-dark" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-float">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider text-cosmic-gradient mb-4 leading-tight">
            Eternal Dominion
            <br />
            Universe
          </h1>
        </div>
        <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent mb-6" />
        <p className="text-lg sm:text-xl text-cosmic-muted font-light tracking-widest mb-2">
          統合時空構造書 v3.0
        </p>
        <p className="text-sm sm:text-base text-electric-blue/80 tracking-wider">
          M104銀河全域 — E16・Eros-7・ビブリオ・Solaris
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Badge
            variant="outline"
            className="border-nebula-purple/50 text-nebula-purple text-xs px-3 py-1"
          >
            <Star className="w-3 h-3 mr-1" /> E16連星系
          </Badge>
          <Badge variant="outline" className="border-pink-400/50 text-pink-400 text-xs px-3 py-1">
            <Globe2 className="w-3 h-3 mr-1" /> Eros-7
          </Badge>
          <Badge
            variant="outline"
            className="border-emerald-400/50 text-emerald-400 text-xs px-3 py-1"
          >
            <Globe2 className="w-3 h-3 mr-1" /> 惑星ビブリオ
          </Badge>
          <Badge
            variant="outline"
            className="border-orange-400/50 text-orange-400 text-xs px-3 py-1"
          >
            <Globe2 className="w-3 h-3 mr-1" /> 惑星Solaris
          </Badge>
          <Badge
            variant="outline"
            className="border-electric-blue/50 text-electric-blue text-xs px-3 py-1"
          >
            <Zap className="w-3 h-3 mr-1" /> AURALIS Collective
          </Badge>
          <Badge
            variant="outline"
            className="border-gold-accent/50 text-gold-accent text-xs px-3 py-1"
          >
            <Radio className="w-3 h-3 mr-1" /> Liminal Forge
          </Badge>
          <Badge variant="outline" className="border-rose-400/50 text-rose-400 text-xs px-3 py-1">
            <Shield className="w-3 h-3 mr-1" /> Iris Worlds
          </Badge>
          <Badge variant="outline" className="border-cyan-400/50 text-cyan-400 text-xs px-3 py-1">
            <Users className="w-3 h-3 mr-1" /> 銀河系コンソーシアム
          </Badge>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 animate-scroll-bounce">
        <a
          href="#sections"
          className="flex flex-col items-center text-cosmic-muted hover:text-electric-blue transition-colors"
        >
          <span className="text-xs tracking-widest mb-2">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION GRID — links to all sub-pages
   ═══════════════════════════════════════════ */
function SectionGrid() {
  return (
    <section id="sections" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Globe2 className="w-6 h-6 text-nebula-purple" />}
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
                className={`group glass-card rounded-xl border ${s.borderColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cosmic-dark/50`}
              >
                <div
                  className={`${s.color} mb-3 transition-transform duration-300 group-hover:scale-110`}
                >
                  {s.icon}
                </div>
                <h3 className={`text-sm font-bold ${s.color} mb-2`}>{s.title}</h3>
                <p className="text-xs text-cosmic-muted leading-relaxed">{s.desc}</p>
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
    <section id="consistency" className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<AlertTriangle className="w-6 h-6 text-gold-accent" />}
            title="⭐ 整合性ノート"
            subtitle="Eternal Dominion Universeにおける重要な設定整合性の確認"
          />
        </RevealSection>
        <RevealSection>
          <div className="space-y-6">
            <div className="relative rounded-xl p-6 sm:p-8 bg-cosmic-surface consistency-border overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gold-accent/20 flex items-center justify-center text-sm font-bold text-gold-accent">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-gold-accent">「ギガポリス」名称の整合性</h3>
                </div>
                <div className="space-y-3 text-sm text-cosmic-muted leading-relaxed">
                  <p>
                    ミナ・エウレカは「
                    <span className="text-cosmic-text font-medium">Gigapolis</span>」と呼んでいる。
                  </p>
                  <p>
                    彼女の時代（E499〜E528）、この都市はエヴァトロンによって「
                    <span className="text-red-400 font-medium">エヴァポリス（Evapolis）</span>
                    」と改名されていた。
                  </p>
                  <p>しかし、これはあくまでエヴァトロン側が付けた一方的な名称に過ぎない。</p>
                  <p>
                    ミナをはじめとする人々は、セリア黄金期の伝統的な名称「
                    <span className="text-nebula-purple font-medium">Gigapolis</span>
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
            </div>
            <div className="relative rounded-xl p-6 sm:p-8 bg-cosmic-surface consistency-border overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nebula-purple/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-nebula-purple/20 flex items-center justify-center text-sm font-bold text-nebula-purple">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-nebula-purple">
                    AURALIS初代は5名ではなかった
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-cosmic-muted leading-relaxed">
                  <p>
                    第二世代（現行）は
                    <span className="text-electric-blue font-medium">5名体制</span>（Kate Patton,
                    Lillie Ardent, Layla, Mina, Ninny）。
                  </p>
                  <p>しかし、第一世代（E290〜）は5名ではなかった。</p>
                  <p>
                    初代は <span className="text-cosmic-text font-medium">Kate Claudia</span> と{" "}
                    <span className="text-cosmic-text font-medium">Lily Steiner</span>{" "}
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
            </div>
            <div className="relative rounded-xl p-6 sm:p-8 bg-cosmic-surface consistency-border overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-pink-400/20 flex items-center justify-center text-sm font-bold text-pink-400">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-pink-400">
                    Laylaは冷凍保存から復活 — ミナたちと同年代
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-cosmic-muted leading-relaxed">
                  <p>
                    これまでの記述ではLaylaが「サイバネティクス強化による200年以上の現役」とされていたが、
                    <span className="text-red-400 font-medium">これは誤り</span>。
                  </p>
                  <p>
                    実際にはエヴァトロン時代の弾圧の中で、その実力ゆえに
                    <span className="text-cosmic-text font-medium">特別措置として冷凍保存</span>
                    されていた。サイバネティクスによる寿命延伸ではない。
                  </p>
                  <p>
                    復活後のLaylaはミナ・Kate Patton・Lillie Ardentと
                    <span className="text-electric-blue font-medium">同年代</span>
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
    <footer className="relative border-t border-cosmic-border/50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-nebula-purple to-transparent" />
        <div className="space-y-2">
          <p className="text-sm font-bold text-cosmic-gradient">
            Eternal Dominion Universe 統合時空構造書 v3.0
          </p>
          <p className="text-xs text-cosmic-muted">AURALIS 地球2026交信プロジェクト設定書 v2.0</p>
        </div>
        <div className="flex justify-center gap-4 text-xs text-cosmic-muted">
          <Link href="/wiki" className="hover:text-gold-accent transition-colors">
            Wiki
          </Link>
          <span className="text-cosmic-border">|</span>
          <Link href="/story/IRIS_1" className="hover:text-cyan-400 transition-colors">
            Story
          </Link>
          <span className="text-cosmic-border">|</span>
          <span>E528 / AD2026</span>
          <span className="text-cosmic-border">|</span>
          <span>光と音を永遠にする</span>
        </div>
        <div className="flex justify-center flex-wrap gap-3 pt-2">
          {SECTION_PAGES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-[10px] text-cosmic-muted hover:text-electric-blue transition-colors"
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
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <main className="relative z-10">
        <HeroSection />
        <RevealSection>
          <QuickAccessSection />
        </RevealSection>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-nebula-purple/40 to-transparent" />
        <SectionGrid />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />
        <ConsistencySection />
        <FooterSection />
      </main>
    </div>
  )
}
