"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Link from "next/link";
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
  ArrowDown,
  Menu,
  X,
  TrendingUp,
  Gamepad2,
  BookOpen,
  ExternalLink,
} from "lucide-react";

/* ─── Section IDs ─── */
const SECTIONS = [
  { id: "universe", label: "宇宙構造" },
  { id: "timeline", label: "年表" },
  { id: "auralis", label: "AURALIS" },
  { id: "mina", label: "ミナ" },
  { id: "liminal", label: "リミナル・フォージ" },
  { id: "consistency", label: "整合性ノート" },
  { id: "iris", label: "アイリス" },
  { id: "characters", label: "キャラクター" },
  { id: "factions", label: "勢力系譜" },
  { id: "wiki-link", label: "Wiki", href: "/wiki" },
  { id: "game-link", label: "Card Game", href: "/game" },
  { id: "pve-link", label: "PvE Battle", href: "/card-game" },
  { id: "story-link", label: "Story小説集", href: "/story" },
  { id: "card-game-link", label: "カードゲーム", href: "/card-game" },
];

/* ─── Reveal-on-scroll hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-section ${className}`}>
      {children}
    </div>
  );
}

/* ─── Simple seeded PRNG (avoids SSR hydration mismatch) ─── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Floating Stars Background ─── */
function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 2.5 + 0.5,
        delay: seededRandom(i * 23 + 7)() * 5,
        duration: seededRandom(i * 29 + 11)() * 3 + 2,
        opacity: seededRandom(i * 31 + 13)() * 0.7 + 0.3,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Navigation ─── */
function Navigation({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2 shrink-0">
            <Star className="w-5 h-5 text-nebula-purple" />
            <span className="text-sm font-bold text-cosmic-gradient hidden sm:block">
              EDU
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={"href" in s && s.href ? s.href : `#${s.id}`}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all rounded-md hover:bg-cosmic-surface ${
                  "href" in s && s.href
                    ? s.id === "game-link"
                      ? "text-rose-400 hover:text-rose-300"
                      : s.id === "pve-link"
                      ? "text-orange-400 hover:text-orange-300"
                      : s.id === "story-link"
                      ? "text-cyan-400 hover:text-cyan-300"
                      : "text-gold-accent hover:text-gold-accent/80"
                    : activeSection === s.id
                    ? "text-electric-blue bg-cosmic-surface"
                    : "text-cosmic-muted"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={"href" in s && s.href ? s.href : `#${s.id}`}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  "href" in s && s.href
                    ? s.id === "game-link"
                      ? "text-rose-400 hover:text-rose-300 bg-cosmic-surface"
                      : s.id === "pve-link"
                      ? "text-orange-400 hover:text-orange-300 bg-cosmic-surface"
                      : s.id === "story-link"
                      ? "text-cyan-400 hover:text-cyan-300 bg-cosmic-surface"
                      : "text-gold-accent hover:text-gold-accent/80 bg-cosmic-surface"
                    : activeSection === s.id
                    ? "text-electric-blue bg-cosmic-surface"
                    : "text-cosmic-muted hover:bg-cosmic-surface"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-nebula-purple/20 mb-4 glow-purple">
        {icon}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-cosmic-gradient mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-cosmic-muted text-sm max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUICK ACCESS CARDS
   ═══════════════════════════════════════════ */
function QuickAccessSection() {
  const cards = [
    {
      href: "/game",
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "EDU Card Game",
      desc: "E16連星系のキャラクターたちを使ったトレーディングカードゲーム。デッキを組んでAI対戦に挑もう",
      gradient: "from-rose-500/20 via-purple-500/20 to-indigo-500/20",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/30 hover:border-rose-400/60",
      tag: "PLAY",
    },
    {
      href: "/wiki",
      icon: <BookOpen className="w-8 h-8" />,
      title: "EDU Wiki 百科事典",
      desc: "E16連星系のすべてがここに。宇宙構造、歴史、キャラクター、勢力まで200以上の項目を収録",
      gradient: "from-gold-accent/20 via-nebula-purple/20 to-electric-blue/20",
      iconColor: "text-gold-accent",
      borderColor: "border-gold-accent/30 hover:border-gold-accent/60",
      tag: "READ",
    },
    {
      href: "/story",
      icon: <Scroll className="w-8 h-8" />,
      title: "Story 小説集",
      desc: "アイリスの諜報活動、レイラの英雄伝、ミナの放浪記 — EDU世界を彩る物語を全文で",
      gradient: "from-cyan-500/20 via-blue-500/20 to-nebula-purple/20",
      iconColor: "text-cyan-400",
      borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
      tag: "STORY",
    },
    {
      href: "/card-game",
      icon: <Swords className="w-8 h-8" />,
      title: "PvE バトル",
      desc: "次元竜や堕落天使とターン制カードバトル。ドラッグ＆ドロップでカードを出して敵を討て",
      gradient: "from-orange-500/20 via-red-500/20 to-purple-500/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/30 hover:border-orange-400/60",
      tag: "BATTLE",
    },
  ];

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
                  <div className={`${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>{card.icon}</div>
                  <span className={`text-[10px] font-bold tracking-widest ${card.iconColor} opacity-60`}>{card.tag}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-cosmic-text mb-1 flex items-center gap-1.5">
                    {card.title}
                    <ExternalLink className={`w-3.5 h-3.5 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </h3>
                  <p className="text-xs text-cosmic-muted leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/edu-hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/60 via-cosmic-dark/40 to-cosmic-dark" />
      </div>

      {/* Content */}
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
          E16連星系から地球AD2026へ
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Badge
            variant="outline"
            className="border-nebula-purple/50 text-nebula-purple text-xs px-3 py-1"
          >
            <Star className="w-3 h-3 mr-1" /> E16連星系
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
          <Badge
            variant="outline"
            className="border-rose-400/50 text-rose-400 text-xs px-3 py-1"
          >
            <Shield className="w-3 h-3 mr-1" /> Iris Worlds
          </Badge>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 animate-scroll-bounce">
        <a href="#universe" className="flex flex-col items-center text-cosmic-muted hover:text-electric-blue transition-colors">
          <span className="text-xs tracking-widest mb-2">SCROLL</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   UNIVERSE STRUCTURE
   ═══════════════════════════════════════════ */
function UniverseSection() {
  return (
    <section id="universe" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Globe2 className="w-6 h-6 text-nebula-purple" />}
            title="宇宙・星系構造"
            subtitle={<>E16連星系 — M104銀河ハローに浮かぶ人類の新たな故郷</>}
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* E16 Binary Star System */}
            <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300">
              <h3 className="text-lg font-bold text-electric-blue mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" /> <a href="/wiki#E16連星系" className="text-electric-blue hover:underline">E16連星系</a>
              </h3>
              <div className="space-y-3">
                {[
                  ["所在", "M104銀河ハロー某所"],
                  ["主星", "Ea16（黄白色巨星）"],
                  ["伴星", "Eb16（赤色矮星）"],
                  ["主要惑星", "シンフォニー・オブ・スターズ"],
                  ["自転周期", "44時間4分"],
                  ["暦法", "東暦（E暦）E1 = AD 3501"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-sm">
                    <span className="text-gold-accent font-medium shrink-0 w-20">
                      {k}
                    </span>
                    <span className="text-cosmic-muted">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symphony of Stars Geography */}
            <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300">
              <h3 className="text-lg font-bold text-gold-accent mb-4 flex items-center gap-2">
                <Globe2 className="w-5 h-5" /> <a href="/wiki#シンフォニー・オブ・スターズ" className="text-gold-accent hover:underline">シンフォニー・オブ・スターズ</a>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* West Continent */}
                <div className="bg-cosmic-dark/50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-nebula-purple mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-nebula-purple" />
                    西大陸: <a href="/wiki#ギガポリス" className="text-nebula-purple hover:underline">Gigapolis</a>圏
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Chem",
                      "Abrivo",
                      "Troyane",
                      "Ronve",
                      "Poitiers",
                      "Lille",
                      "Valoria",
                      "地下街",
                      "Persepolis",
                    ].map((city) => (
                      <span
                        key={city}
                        className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* East Continent */}
                <div className="bg-cosmic-dark/50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-electric-blue mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-electric-blue" />
                    東大陸: クレセント大地方
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "ヴァーミリオン",
                      "ブルー・ローズ",
                      "ミエルテンガ",
                      "クロセヴィア",
                      "SSレンジ",
                      "アイアン・シンジケート",
                      "SUDOM",
                      "ファティマ連邦",
                      "スターク三国",
                    ].map((city) => (
                      <span
                        key={city}
                        className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATED TIMELINE
   ═══════════════════════════════════════════ */
/* location helper — each event: { text, loc? } */
type TlEv = { text: string; loc?: string };
const locColor: Record<string,string> = {
  "シンフォニー・オブ・スターズ": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Gigapolis": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Eros-7": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "惑星Solaris": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "惑星ビブリオ": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "ノスタルジア・コロニー": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "西大陸": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "東大陸・クレセント": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "M104銀河": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "E16星系": "bg-slate-500/20 text-slate-300 border-slate-500/30",
  "地球": "bg-green-500/20 text-green-300 border-green-500/30",
  "AD2026地球": "bg-green-500/20 text-green-300 border-green-500/30",
  "ヴァーミリオン": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "ブルーローズ": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "ミエルテンガ": "bg-amber-500/20 text-amber-300 border-amber-500/30",
};
const e = (text: string, loc?: string): TlEv => ({ text, loc });

const TIMELINE_DATA: { period: string; range: string; color: string; borderColor: string; events: TlEv[] }[] = [
  {
    period: "前史 (Pre-E1)",
    range: "AD 3500以前 — 宇宙的文脈",
    color: "text-gold-accent",
    borderColor: "border-gold-accent/30",
    events: [
      e("【天文背景】E16連星系はM104銀河（ソンブレロ銀河）のハロー領域に位置。主星Ea16（スペクトル型K2、質量1.2太陽質量）と伴星Eb16（スペクトル型M3、質量0.4太陽質量）が0.8AUの楕円軌道で安定した重力場を形成", "E16星系"),
      e("【星系構造】E16星系には中心惑星「星々の交響曲（Symphony of Stars）」を含む7惑星と数十の小惑星帯が存在。Symphony of StarsはEa16のハビタブルゾーン内に位置し、平均表面温度15℃、重力0.92G、自転周期44時間4分", "E16星系"),
      e("【Eros-7】E16外縁惑星。重力1.1G、薄い酸素大気（酸素濃度12%）、頻繁な電磁嵐。初期植民の試練の地。のちに搾取生物（Squeezing Organisms）流入により女性主導のマトリカル社会が形成される", "Eros-7"),
      e("【大移民ルート】地球は人口過剰と資源枯渇に直面。曲率航法と量子テレポーテーションにより、アンドロメダ → レオ → セクスタンス → さんかく → E16連星系の中継ルートを経由して移住開始", "地球"),
      e("【3移民集団】フェンドラ人（技術志向の北欧系）、アーキアン（環境適応に優れたアジア系）、ポロンポロ（文化保存を重視するオセアニア系）からなる多様な移民団"),
      e("E0 (AD3500): 第一陣1,000名がシンフォニー・オブ・スターズに到着", "シンフォニー・オブ・スターズ"),
      e("【ティムール・シャー】移民団のリーダー。10次元ホラズム理論の提唱者。仮想多元宇宙「ペルセポネ」を設計 — ニューロリンク・インターフェースと量子演算コアで移民が意識をアップロードし過酷環境を克服", "シンフォニー・オブ・スターズ"),
    ],
  },
  {
    period: "第一期 E1〜E200",
    range: "入植・帝国・繁栄・革命",
    color: "text-nebula-purple",
    borderColor: "border-nebula-purple/30",
    events: [
      e("E1: 定住開始。Clan（Gig-community）組織。A-Registry（旅券）の萌芽", "シンフォニー・オブ・スターズ"),
      e("E6: 第一繁栄期。パラトン等の初期都市圏形成", "シンフォニー・オブ・スターズ"),
      e("【Eros-7】E0年以降: 星間貿易で搾取生物（Squeezing Organisms）流入 — 性的エネルギーを吸収し男性の生殖機能を抑制。女性リーダー・リリス・ヴェインが制御技術を開発しバイオリアクターでエネルギー化", "Eros-7"),
      e("E14: エルトナ戦争 — 前衛意識 vs 原始意識。人種的緊張の起源", "シンフォニー・オブ・スターズ"),
      e("E15〜E61: バーズ帝国成立 — 軍閥ファランクス（のちのテクロサスの前身）が星系統一", "シンフォニー・オブ・スターズ"),
      e("E62〜E77: アフター戦争・チョンクォン戦争 → テラン朝共和制へ移行", "シンフォニー・オブ・スターズ"),
      e("E78〜E80: 第二繁栄期。人口4,000万。A-Registry 155階層整備", "Gigapolis"),
      e("【技術啓蒙時代 E80〜E90】バイオエンジニアリング爆発的進化。ナノセル・インプラント（放射線耐性・長寿命化）一般化。人口約5,000万人に達し、ギガポリスの原型形成", "Gigapolis"),
      e("【次元極地平】ブラックホール理論を応用した「Dimension Horizon」開発 — 量子重力場で高次元空間にアクセス。空間ホール（安定した次元間ポータル）を通じ仮想多元宇宙を構築", "Gigapolis"),
      e("【テクノ宗教運動】次元極地平を「宇宙の意志」と神聖視。テンプル・オブ・ホライゾン建設。物理学者テミルタロンがサイケデリック・コスモロジーを提唱し次元ピラミッドの原型を構想", "Gigapolis"),
      e("【ペルセポネ進化】テミルタロン指導の下、プライマリー・フィールドとして再構築 — クオリア・コア（感情のデジタル化）により仮想空間で実体験に近い感覚を獲得", "Gigapolis"),
      e("E88〜E98: ロンバルディア戦争", "M104銀河"),
      e("【Eros-7 E97〜E101】搾取生物の異常増殖による危機 — 男性労働者の80%感染、エネルギー枯渇症蔓延。女性リーダー・シルヴィア・クロウがエスパー能力（テレパシー・エネルギー操作）で収束", "Eros-7"),
      e("E97〜E101: 第三繁栄期（第一文化主義）— 人口1億2,000万。コーポラタムパブリカ（企業国家）とA籍制度誕生。nトークン経済確立。ネオンコロシアムで戦士決定戦開始", "Gigapolis"),
      e("【Eros-7】シルヴィア・クロウが男性指令省を設立し精子レジストリ運用開始。ネオンクレーター宮殿（高さ800m、100階建て）建設", "Eros-7"),
      e("E108〜E114: クワンナラ革命 — 分権化・Clan復権", "シンフォニー・オブ・スターズ"),
      e("E150: マーストリヒト革命 — エル・フォルハウス（通称「新時代のルーキー」）がギガポリスのセントラル・タワーを占拠。完全自由経済確立。コーポラタムパブリカ正式成立", "Gigapolis"),
      e("E151: 新ヘルシンキ宣言 — 惑星連邦構想提案。アリア・ソルが次元極地平を活用した星間議会を構想", "Gigapolis"),
      e("E153〜E201: 第四繁栄期 — 人口3億突破。ギガポリスGDP14京nトークン。次元技術で星間通信遅延0.01秒未満。平均寿命150年に延長", "Gigapolis"),
      e("E208: コーラの疫病 — アンドロメダ系移民の遺伝子に特異的に作用するウイルス。人口の15%（約4,500万人）死亡。シャドウ・リベリオン（低階層反乱組織）結成の契機", "Gigapolis"),
    ],
  },
  {
    period: "第二期 E200〜E320",
    range: "パクス・ロンバルディカ・ZAMLT・アルファ・ケイン",
    color: "text-electric-blue",
    borderColor: "border-electric-blue/30",
    events: [
      e("【パクス・ロンバルディカ E205〜E278】コーポラタムパブリカが経済と政治を完全掌握。ギガポリス経済規模は年間5京nトークンに達するも、A籍制度の硬直化で格差が極端化。シャドウ・リベリオン活発化", "Gigapolis"),
      e("E260〜E280: Diana（初代Wonder Woman）台頭", "西大陸"),
      e("E270: AURALIS Proto創設（Diana時代の文化的恩恵の下で前身組織発足）", "西大陸"),
      e("E275〜E288: メルディア戦争 — ロンバルディア帝国 vs セクスタス連合（M104銀河周辺勢力）。次元兵器投入でロンバルディア勝利。第五次繁栄を招く", "M104銀河"),
      e("E289〜E300: 第五次繁栄 — 人口4億に達し、メガタワーは高さ3kmに拡張。ディメンション・ブリッジ（恒久的星間ポータル）でM104銀河全体との貿易を10倍に拡大", "Gigapolis"),
      e("【Eros-7】ZAMLTと戦略的提携を結び搾取技術が企業化。搾取触手・搾取ヒル・搾取バクテリアを標準化。ネオンクレーター宮殿は1.5km・200階に拡張。年間1兆nトークンの経済規模に", "Eros-7"),
      e("E290: AURALIS Collective第一世代正式組織化 — Kate Claudia・Lily Steinerを中心とする少人数集団", "西大陸"),
      e("【ZAMLT E301〜E318】5超巨大企業国家の統合体として誕生。企業数1億超。量子ファイナンス・コアでnトークン取引の95%を掌握。A籍制度をZ1〜Z50に再編、非従業員は事実上奴隷階級へ", "Gigapolis"),
      e("【Eros-7 ZAMLT期】男性指令省とZAMLT量子バイオバンク統合。搾取セッション1日3回に増加。シャドウ・ユニオンがナノハッキング技術でバイオリアクター妨害活動を展開", "Eros-7"),
      e("E318: アルファ・ケイン覚醒 — 戦士決定戦の元チャンピオン。シャドウ・リベリオンのリーダーとしてZAMLT量子ファイナンス・コアにハッキング。ギガポリス解放戦でメガタワーを占拠、資産30%を地域コミュニティに譲渡", "Gigapolis"),
      e("E318 (同時): Eros-7のアビス・チェンバーでシャドウ・ユニオンによる小規模反乱発生。搾取ヒル1,000体破壊事件", "Eros-7"),
    ],
  },
  {
    period: "第三期 E319〜E400",
    range: "セリア黄金期・ネオクラン同盟・スライム危機",
    color: "text-green-400",
    borderColor: "border-green-400/30",
    events: [
      e("E319: 新ZAMLT期の余波。Jen（Lv938+）がValoria宮殿を掌握。現在もValoria連合圏を主導", "西大陸"),
      e("E320〜E340: ネオクラン同盟が分散統治モデルを拡大。地域クラン結成、量子ファイナンス・コアのローカル版でnトークンの地域内循環開始。クラン・フォーラム（E325年設立）で低階層の声を可視化", "Gigapolis"),
      e("E325: レイラ・ヴィレル・ノヴァ（Pink Voltage）がAURALISに参加。弦太郎（Lv569）がAURALIS周辺に登場", "西大陸"),
      e("Ninny Offenbach原初個体 — Alpha Kane時代のGigapolisに存在。のちにKaneと袂を分かち別惑星（惑星Solaris）へ離脱 → クローン継承で遺伝子が世代を超えて継承", "惑星Solaris"),
      e("【Eros-7】ガロ（後のアヤカ・リンの盟友）がシャドウ・ユニオンの指導者に。E330年のヒル破壊事件（搾取ヒル1,000体破壊）後、マトリカル・カウンシルが搾取抑制剤で鎮圧", "Eros-7"),
      e("E335〜E370: セリア・ドミニクスがAlpha Kaneを倒しSelinopolis改名。セリア黄金期 — フェルミ音楽・nトークン経済・AURALISすべての頂点に到達", "Gigapolis"),
      e("E340: Slime Woman出現（ペルセポネ仮想宇宙実験の事故で高次元世界から顕現）。特定の個人（Jun）との間に特異な相互作用が発生。Tier 1アクティブ現役最強格として約200年にわたり存在し続ける", "Gigapolis"),
      e("E350: 第五次繁栄フェスティバル開催 — 戦士決定戦とホロアート融合。ネオンコロシアム視聴率95%。シャドウ・リベリオンの反体制ホログラムがアンダーグリッドで話題に", "Gigapolis"),
      e("E370: アポロン-ドミニオン戦争勃発 — 次元エネルギー鉱脈の支配権を巡るE16 vs M104銀河軍事国家集団。E16の次元兵器（空間ホール質量破壊兵器）が勝利", "M104銀河"),
      e("【スライム危機 E380〜E400】ZAMLT時代の過剰バイオエンジニアリング実験が原因で搾取生物が遺伝子変異しスライム形態に進化。ギガポリスの地下インフラに侵入、エネルギー供給70%停止、人口20%（約8,000万人）避難", "Gigapolis"),
      e("【レイラの英雄的活躍】レイラ・ヴィレル・ノヴァ — 低階層（A120）出身のサイバネティック強化戦士。ナノファイバーブーツ・強化グローブ（100tパンチ力）装備。オアシス・ハウスを拠点にプラズマカノンでスライム焼却、感染拡大30%抑制。認知度96%・勝率92%", "Gigapolis"),
      e("【アヤカ・リンの活躍】Lv.842の搾精生物専門ハンター。ビキニバリア・カウパー波を駆使しアンダーグリッド深部でスライムの巣を破壊。プライマリー・フィールド経由で全市民に戦闘記録中継", "Gigapolis"),
      e("E400: スライム危機終息。AURALISはエヴァトロンの文化弾圧により解体 — Kate Claudia・Lily Steinerは逆捕・消息不明。レイラは冷凍保存（実力による特別措置。サイバネティクスによる長命ではない）", "Gigapolis"),
      e("E400 (同時): エヴァトロンがGigapolisを支配しエヴァポリスに改名（エヴァトロン側の一方的名称に過ぎない）。Tina/Gueが地下街最深部を実効支配開始", "Gigapolis"),
      e("【Eros-7 E380〜E400】スライム危機がEros-7にも波及。カーラ・ヴェルムがスクイーズ・アビス（560階地下搾取施設）を建設。搾取プラズマ弾（スライムエネルギー凝縮破壊兵器）を生産", "Eros-7"),
    ],
  },
  {
    period: "第四期 E400〜E475",
    range: "エヴァトロン支配・テリアン反乱",
    color: "text-red-400",
    borderColor: "border-red-400/30",
    events: [
      e("E400〜E450: エヴァトロンがGigapolisを支配しエヴァポリスに改名（ただしこの名称はエヴァトロン側の一方的なものに過ぎない）。AURALISは地下活動へ", "Gigapolis"),
      e("Kate Claudia・Lily Steinerは逆捕・消息不明。レイラはその実力ゆえの特別措置で冷凍保存", "Gigapolis"),
      e("E420: エヴァトロン軍極秘Σ-Unit設立 — 精神操作・生体改造技術。のちのAlpha Venomの起源（整合性原則③）", "Gigapolis"),
      e("【テリアン反乱】テリアン反乱軍の指導者エリオス・ウォルドがエヴァトロンに抵抗", "Gigapolis"),
      e("E470: エリオス・ウォルド処刑。テクロサス東方支隊がクレセント大地方に常駐開始", "東大陸・クレセント"),
      e("E475: エヴァポリス廃墟化。エヴァトロン崩壊", "Gigapolis"),
      e("【Eros-7】E475年: カーラ・ヴェルムのスクイーズ・アビスが搾取プラズマ弾を大量生産しEros-7の軍事力を強化。シャドウ・ユニオンの抵抗がさらに激化", "Eros-7"),
      e("E475 (同時): エヴァトロン崩壊後、Σ-Unit残党が「シルバー・ヴェノム」として独立 → のち「アルファ・ヴェノム」と「ゴールデン・ヴェノム」に分派", "M104銀河"),
      e("【アイリスの台頭 E480〜E495】ヴァーミリオン裏路地でストリートギャングとの戦闘を経て、同国諜報機関にスカウト。ブルーワイヤとウォーター・オーブの戦闘術を習得し、急速に頭角を現す", "ヴァーミリオン"),
      e("【シルバー・ヴェノムの暗躍 E485〜】シルバー・ヴェノムがクレセント地方に浸透。レオン（幹部）率いる部隊がヴァーミリオン周辺で活動開始。アイリスとシルバー・ヴェノムの長期にわたる対立の始まり", "東大陸・クレセント"),
      e("テクロサス系譜: E15ファランクス → E295三頭政治改編 → E470東方支隊クレセント常駐 → E490頃ボグダス・ジャベリン（セバスチャン・ヴァレリウス率、IRIS 4位）がヴァーミリオンに恒久駐在", "東大陸・クレセント"),
      e("【アイリスとボグダス・ジャベリン E490〜】アイリスがボグダス・ジャベリン（セバスチャン・ヴァレリウス、ガレス、ミユシャリ等）と協力関係を構築。ヴァーミリオン諜報機関での地位を確立し、ウィリー（パートナー）と共に各地の脅威に対処", "ヴァーミリオン"),
      e("東大陸クレセント大地方の主要国家体制確立 — ヴァーミリオン(アイリス/IRIS1位)・ブルーローズ(フィオナ/V7/2位)・ミエルテンガ(マリーナ/3位)・テクロサス(BJ/4位)・クロセヴィア(カスチーナ/5位)", "東大陸・クレセント"),
    ],
  },
  {
    period: "第五期 E475〜E528",
    range: "テクノ文化ルネサンス・現代",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    events: [
      e("【テクノ文化ルネサンス E475〜E500】次元極地平技術の民主化と文化融合。ネオンコロシアムがアートと技術の祭典に進化。レイラの戦績がホログラム展示で不朽の名声を獲得", "Gigapolis"),
      e("E490頃: ボグダス・ジャベリンがヴァーミリオンに恒久駐在", "東大陸・クレセント"),
      e("【アイリスの諜報機関昇進 E495〜E505】ジマ・オイル襲撃作戦等でシルバー・ヴェノムに対する成果を上げ、ヴァーミリオン諜報機関の実力者に。エレナ（元本部長）の後継として機関長に昇進", "ヴァーミリオン"),
      e("E495〜E500: ネオクラン同盟がUECO（星間経済協同組合）・ヒーローエージェンシーと統合し銀河系コンソーシアム設立。トゥキディデスの罠回避を志向", "M104銀河"),
      e("E499: ミナ・エウレカ・アーネスト誕生（ノスタルジア・コロニー。父:エンジニア、母:歴史記録官）", "ノスタルジア・コロニー"),
      e("E505: Eros-7でスクイーズ・アビス解体。搾取技術を医療・クリーンエネルギー用途に転換。搾取バクテリアがナノメディシン（遺伝子修復剤）として再設計", "Eros-7"),
      e("E509: Alpha Venomのノスタルジア・コロニー攻撃 — 「重力崩壊弾頭」の閃光が10歳のミナに「戦略への目覚め」をもたらす。難民船で脱出", "ノスタルジア・コロニー"),
      e("【アイリスのシルバー・ヴェノムとの激突 E508〜E515】レオン率いるシルバー・ヴェノム部隊との複数回の戦闘。アイリスはブルーワイヤとウォーター・オーブで応戦。ヴェルリット一族（ラブマーク使いの魔女）との遭遇も", "ヴァーミリオン"),
      e("E510: シルバー・ヴェノムによるアイリス拉致事件 — レオンとマスター・ヴェノムの策によりアイリスが捕縛。ボグダス・ジャベリン（セバスチャン・ガレス）とクラウス・フィオナ（ファールージャ社COO）の連携による救出作戦", "東大陸・クレセント"),
      e("E512: アイリス救出後、フィオナとの協力関係が深化。ヴィヴィエッタ（四楓院ヴィヴィエッタ）の救出作戦にも成功。V7（Vital Seven）7カ国連合の設立準備が始まる", "ブルーローズ"),
      e("E514: ミナ、学術都市惑星「ビブリオ」のロレンツィオ国際大学AI学部入学（15歳）。文明崩壊予測モデルを研究", "惑星ビブリオ"),
      e("【V7設立とクレセントの政治激変 E515〜E520】Vital Seven（ヴァーミリオン・ブルーローズ・ミエルテンガ・クロセヴィア・SSレンジ・アイアン・シンジケート・ファティマ連邦）正式設立。フィオナが急先鋒として外交を主導", "東大陸・クレセント"),
      e("E518: アルファ・ヴェノムの台頭 — シルバー・ヴェノム残党を吸収し大幅に勢力拡大。イズミ（両性具有のリーダー）・ボブリスティ・ギル・カタリナ・ゴルディロックスらが活動活発化。アイリスに対する新たな脅威", "東大陸・クレセント"),
      e("E519: アルファ・ヴェノムによるアイリス再拉致事件。イズミの指揮下でアイリスが捕縛されるも、ボグダス・ジャベリンの決死の救出作戦により奪還。この事件がクレセント政治の転換点となる", "東大陸・クレセント"),
      e("【トリニティ・アライアンス結成 E520】アイリスがミエルテンガ首脳に就任（フィオナの推薦による）。ヴァーミリオン・ミエルテンガ・ボグダス・ジャベリンを核とした3勢力連合「トリニティ・アライアンス」発足。クレセントはV7 vs トリニティの二大陣営へ", "ミエルテンガ"),
      e("E521: ミナ卒業（22歳）。放浪開始。Genesis Vault前身ブログ開設。ボグダス・ジャベリンに参加", "惑星ビブリオ"),
      e("【次元ピラミッド全4層構造】Tier Ω（高次元世界: フン8次元/ササン9次元/ホラズム10次元/ティムール11次元）→ Tier Σ（ペルセポネ仮想宇宙）→ Tier Ε（E16通常次元）→ Tier Δ（AD2026地球）", "E16星系"),
      e("E522: AURALIS第二世代正式発足 — Kate Patton・Lillie Ardent・レイラ（冷凍保存から復活・ミナと同年齢外見）・ミナ・Ninny Offenbachの5名。弦太郎（Lv569）もAURALIS関連活動を継続", "西大陸"),
      e("E524: 諸世界連邦サミット — ギガポリスのセントラル・タワーで開催。星間平和協定締結。ミナ参加。地球AD2026情報に初接触。ナシゴレン初体験（サミット会場屋台）", "Gigapolis"),
      e("【Eros-7 E525】アヤカ・リンの介入 — ガロ（シャドウ・ユニオン男性リーダー）・ゼナ（女性商人）と同盟を結びマトリカル・リフォーム運動を組織。労働時間短縮・精子レジストリ男女平等化", "Eros-7"),
      e("E525: リミナル・フォージ立ち上げ — ApoloniumとDimension Horizon技術を組み合わせた時相放送（Temporal Broadcast）。E528年の芸術を地球AD2026年のインターネット上に放送開始", "西大陸"),
      e("【フィオナの裏切り E523〜E525】ブルーローズ統率者フィオナがアルファ・ヴェノムと内通していることが発覚。マリーナ・ボビン（ミエルテンガ総統）との共謀も判明。トリニティ・アライアンス内部に激震", "東大陸・クレセント"),
      e("【V7 vs トリニティ 冷戦期 E525〜E528】フィオナの裏切りを機にV7とトリニティの対立が激化。レヴィリア・サーペンティナ（シルバー・ヴェノム幹部）の動向も不透明。アイリスはトリニティ指導者としてクレセント全域の安定を模索", "東大陸・クレセント"),
      e("E528: 現在 — Genesis Vault 2,000本突破。EDU統合版Wiki（整合性5原則・確定修正3点）準拠。アイリスは引き続きトリニティ・アライアンス指導者として、フィオナ・アルファ・ヴェノムとの対峙を続ける", "E16星系"),
      e("カステリア・グレンヴェルト・シトラ・セレス・ミュー・ジュンなど、EDU世界の多様な個人の物語が記録されている。特にジュンとSlime Womanの物語は、高次元存在と人間の接触というEDU宇宙論において重要なテーマを扱う", "E16星系"),
    ],
  },
];

function TimelineSection() {
  return (
    <section id="timeline" className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Scroll className="w-6 h-6 text-gold-accent" />}
            title="統合年表"
            subtitle="E16連星系の人類史 — AD 3500からE528現代まで"
          />
        </RevealSection>

        <RevealSection>
          <Accordion type="multiple" className="space-y-3">
            {TIMELINE_DATA.map((period, idx) => (
              <AccordionItem
                key={idx}
                value={`period-${idx}`}
                className={`glass-card rounded-xl border ${period.borderColor} px-0 overflow-hidden transition-all duration-300`}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-cosmic-surface/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className={`font-bold text-sm sm:text-base ${period.color}`}>
                      {period.period}
                    </span>
                    <span className="text-xs text-cosmic-muted">
                      {period.range}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2.5 ml-2 border-l-2 border-cosmic-border pl-4">
                    {period.events.map((ev, evIdx) => (
                      <div key={evIdx} className="flex flex-wrap gap-2 text-sm items-start">
                        <span className="text-cosmic-muted mt-0.5 shrink-0">▸</span>
                        {ev.loc && (
                          <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${locColor[ev.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                            {ev.loc}
                          </span>
                        )}
                        <span className="text-cosmic-text/90">{ev.text}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   AURALIS COLLECTIVE
   ═══════════════════════════════════════════ */
function AuralisSection() {
  return (
    <section id="auralis" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Sparkles className="w-6 h-6 text-electric-blue" />}
            title={<a href="/wiki#AURALIS" className="text-cosmic-gradient hover:underline">AURALIS Collective</a>}
            subtitle="「光と音を永遠にする — Where Light and Sound Become Eternal」"
          />
        </RevealSection>

        {/* AURALIS Group Image Banner */}
        <RevealSection>
          <div className="glass-card rounded-xl overflow-hidden mb-8">
            <div className="relative">
              <img
                src="/edu-aurali.png"
                alt="AURALIS Collective"
                className="w-full h-64 sm:h-80 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-cosmic-dark/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric-blue/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cosmic-text">AURALIS Collective</p>
                    <p className="text-xs text-cosmic-muted">第二世代 — E522〜現在</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Generation */}
            <div className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300">
              <div className="relative h-40 bg-gradient-to-br from-nebula-purple/30 to-electric-blue/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-black text-nebula-purple/50">I</span>
                  <p className="text-xs text-cosmic-muted mt-1">FIRST GENERATION</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-nebula-purple">
                  第一世代 <span className="text-xs text-cosmic-muted font-normal">E290〜E420</span>
                </h3>
                <div className="space-y-2 text-sm text-cosmic-muted">
                  <p>
                    <span className="text-cosmic-text">E270頃:</span> AURALIS
                    Proto（Diana時代の前身組織）
                  </p>
                  <p>
                    <span className="text-cosmic-text">E290:</span>{" "}
                    正式組織化
                  </p>
                  <p>
                    <span className="text-cosmic-text">創設者:</span>{" "}
                    Kate Claudia, Lily Steiner
                  </p>
                  <p>
                    <span className="text-cosmic-text">参加:</span>{" "}
                    Layla Virell Nova (E325以降)
                  </p>
                </div>

                {/* Important Note */}
                <div className="bg-gold-accent/10 border border-gold-accent/30 rounded-lg p-3 text-xs text-gold-accent">
                  <p className="font-bold mb-1">⚠️ 重要ノート</p>
                  <p className="text-cosmic-muted leading-relaxed">
                    初代は5名ではなかった。Kate Claudia・Lily
                    Steinerを中心とする集団で、Laylaを含む複数の参加者がいたが、正確な人数は不明。第二世代の5人体制とは異なる。
                  </p>
                </div>

                <div className="text-sm text-cosmic-muted">
                  <p>
                    <span className="text-cosmic-text">E335〜E370:</span>{" "}
                    セリア黄金期に最盛期
                  </p>
                  <p>
                    <span className="text-cosmic-text">E400:</span>{" "}
                    エヴァトロン弾圧で解体。Kate Claudia・Lily Steinerは逮捕・消息不明
                  </p>
                  <p>
                    <span className="text-cosmic-text">Layla:</span>{" "}
                    冷凍保存（サイバネティクスによる長命ではない）
                  </p>
                </div>
              </div>
            </div>

            {/* Second Generation */}
            <div className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 animate-pulse-glow">
              <div className="relative h-40 bg-gradient-to-br from-electric-blue/30 to-gold-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-black text-electric-blue/50">II</span>
                  <p className="text-xs text-cosmic-muted mt-1">SECOND GENERATION — 現在</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-electric-blue">
                  第二世代 <span className="text-xs text-cosmic-muted font-normal">E522〜現在</span>
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      name: "Kate Patton",
                      desc: "大地の豊かさ・安定",
                      color: "bg-green-500/20 border-green-500/40",
                      img: "https://raw.githubusercontent.com/gentaron/image/main/KatePatton.png",
                    },
                    {
                      name: "Lillie Ardent",
                      desc: "情熱的で大胆",
                      color: "bg-red-500/20 border-red-500/40",
                      img: "https://raw.githubusercontent.com/gentaron/image/main/LillieArdent.png",
                    },
                    {
                      name: "Layla Virell Nova",
                      desc: "Pink Voltage — 冷凍保存から復活、ミナたちと同年代",
                      color: "bg-pink-500/20 border-pink-500/40",
                      img: "https://raw.githubusercontent.com/gentaron/image/main/LaylaVirelNova.png",
                    },
                    {
                      name: "Mina Eureka Ernst",
                      desc: "celestial × avant-garde, AI研究員",
                      color: "bg-blue-500/20 border-electric-blue/40",
                      img: "https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png",
                    },
                    {
                      name: "Ninny Offenbach",
                      desc: "無邪気で爆発的な活力 — 原初個体はAlpha Kane時代に別惑星へ、クローン技術で遺伝子継承ののちGigapolisに再帰還",
                      color: "bg-yellow-500/20 border-gold-accent/40",
                      img: "https://raw.githubusercontent.com/gentaron/image/main/NinnyOffenbach.png",
                    },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${m.color} group hover:scale-[1.02] transition-all duration-200 cursor-default`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cosmic-border/50 shrink-0 group-hover:border-electric-blue/50 transition-colors">
                        <img
                          src={m.img}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-cosmic-text truncate">
                          {m.name}
                        </p>
                        <p className="text-xs text-cosmic-muted line-clamp-2">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ninny's Special Lineage */}
                <div className="mt-4 bg-cosmic-dark/50 border border-gold-accent/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-gold-accent mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    ニニーの特別な来歴
                  </h4>
                  <div className="space-y-2 text-xs text-cosmic-muted leading-relaxed">
                    <p>
                      ニニーの<span className="text-cosmic-text font-medium">原初個体</span>はAlpha Kane時代のGigapolisに存在していたが、Kaneと袂を分かち別惑星へ離脱した。
                    </p>
                    <p>
                      そこから<span className="text-electric-blue font-medium">クローン技術</span>で遺伝子が世代を超えて継承され、現代のNinnyがGigapolisに<span className="text-gold-accent font-medium">再帰還</span>してミナと出会い、第二世代に加入した。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MINA CHARACTER PROFILE
   ═══════════════════════════════════════════ */
const MINA_TIMELINE = [
  { age: "0歳", year: "E499", event: "ノスタルジア・コロニーで誕生" },
  { age: "5歳", year: "E504", event: "幼少期" },
  { age: "10歳", year: "E509", event: "Alpha Venom攻撃、難民船脱出" },
  { age: "15歳", year: "E514", event: "大学入学" },
  { age: "22歳", year: "E521", event: "卒業放浪期" },
  { age: "25歳", year: "E524", event: "諸世界連邦サミット参加" },
  { age: "26歳", year: "E525", event: "リミナル・フォージ立ち上げ" },
  { age: "29歳", year: "E528", event: "現在" },
];

function MinaSection() {
  return (
    <section id="mina" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Users className="w-6 h-6 text-blue-400" />}
            title="ミナ・エウレカ・エルンスト"
            subtitle={<>Mina Eureka Ernst — AURALIS第二世代、<a href="/wiki#リミナル・フォージ" className="text-electric-blue hover:underline">リミナル・フォージ</a>創設者</>}
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative">
                  <img
                    src="https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png"
                    alt="ミナ・エウレカ・エルンスト"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-cosmic-text">
                      ミナ・エウレカ・エルンスト
                    </p>
                    <p className="text-xs text-electric-blue">
                      Mina Eureka Ernst
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Info */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-electric-blue mb-4 uppercase tracking-wider">
                  プロフィール
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {([
                    ["生年月日", "E499年8月16日"],
                    ["年齢", "29歳"],
                    ["血液型", "AB型"],
                    ["出生地", <a key="wl" href="/wiki#ノスタルジア・コロニー" className="text-electric-blue hover:underline">ノスタルジア・コロニー</a>],
                    ["外見", "青い長髪・長身"],
                    ["性格", "マイペース・先進的・承認欲求あり"],
                  ] as [string, React.ReactNode][]).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-cosmic-muted text-xs mb-0.5">{k}</p>
                      <p className="text-cosmic-text font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motto & Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-gold-accent mb-3 uppercase tracking-wider">
                    座右の銘
                  </h3>
                  <p className="text-cosmic-text italic text-sm mb-2">
                    &ldquo;Veni, vidi, vici&rdquo;
                  </p>
                  <p className="text-cosmic-muted text-xs">人生則主観</p>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-sm font-bold text-nebula-purple mb-3 uppercase tracking-wider">
                    特技
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "テニス（右利き）",
                      "Hoi4",
                      "Civilization",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-nebula-purple/15 text-nebula-purple px-2.5 py-1 rounded-full border border-nebula-purple/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Life Timeline */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-green-400 mb-4 uppercase tracking-wider">
                  人生年表
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MINA_TIMELINE.map((t) => (
                    <div
                      key={t.year}
                      className="bg-cosmic-dark/50 rounded-lg p-3 border border-cosmic-border/50 hover:border-electric-blue/30 transition-colors"
                    >
                      <p className="text-xs text-electric-blue font-medium">
                        {t.age} ({t.year})
                      </p>
                      <p className="text-xs text-cosmic-muted mt-1">{t.event}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
                  <p className="text-xs text-electric-blue">
                    📡 現在: ナシゴレンと宇宙連合会合をモニタリング中
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   LIMINAL FORGE
   ═══════════════════════════════════════════ */
const PLATFORMS = [
  {
    name: "auralis-eternal-light.lovable.app",
    desc: "公式ポータル",
    type: "PORTAL",
    color: "text-nebula-purple border-nebula-purple/30",
    bg: "bg-nebula-purple/10",
    url: "https://auralis-eternal-light.lovable.app/",
  },
  {
    name: "bsky.app/profile/minaeurekaernst.bsky.social",
    desc: "ミナの直接放送",
    type: "SOCIAL",
    color: "text-electric-blue border-electric-blue/30",
    bg: "bg-electric-blue/10",
    url: "https://bsky.app/profile/minaeurekaernst.bsky.social",
  },
  {
    name: "note.com/gensnotes",
    desc: "Genesis Vault（2000本突破）",
    type: "ARCHIVE",
    color: "text-green-400 border-green-400/30",
    bg: "bg-green-400/10",
    url: "https://note.com/gensnotes",
  },
  {
    name: "suno.com/@liminalforge",
    desc: "音楽放送",
    type: "MUSIC",
    color: "text-gold-accent border-gold-accent/30",
    bg: "bg-gold-accent/10",
    url: "https://suno.com/@liminalforge",
  },
  {
    name: "pixai.art/en/@apolon/artworks",
    desc: "ビジュアル放送",
    type: "VISUAL",
    color: "text-pink-400 border-pink-400/30",
    bg: "bg-pink-400/10",
    url: "https://pixai.art/en/@apolon/artworks",
  },
  {
    name: "EDU Story Archive",
    desc: "アイリス物語（EDU内部）",
    type: "STORY",
    color: "text-cyan-400 border-cyan-400/30",
    bg: "bg-cyan-400/10",
    url: "/story",
  },
];

function LiminalSection() {
  return (
    <section id="liminal" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Radio className="w-6 h-6 text-gold-accent" />}
            title={<a href="/wiki#リミナル・フォージ" className="text-cosmic-gradient hover:underline">リミナル・フォージ</a>}
            subtitle={<>Liminal Forge — E528からAD2026へ、時空を超えた放送プロジェクト</>}
          />
        </RevealSection>

        <RevealSection>
          {/* Broadcasting mechanism */}
          <div className="glass-card rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gold-accent mb-4">
              時相放送の仕組み
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center text-center">
              <div className="bg-nebula-purple/15 border border-nebula-purple/30 rounded-lg p-4 min-w-[160px]">
                <p className="text-xs text-cosmic-muted mb-1">起点</p>
                <p className="text-sm font-bold text-nebula-purple">E528</p>
                <p className="text-xs text-cosmic-muted">AURALIS本部</p>
              </div>
              <ArrowDown className="w-5 h-5 text-cosmic-muted rotate-90 sm:rotate-0 shrink-0" />
              <div className="bg-electric-blue/15 border border-electric-blue/30 rounded-lg p-4 min-w-[200px]">
                <p className="text-xs text-cosmic-muted mb-1">経由</p>
                <p className="text-sm font-bold text-electric-blue">
                  <a href="/wiki#ペルセポネ" className="text-electric-blue hover:underline">ペルセポネ</a>仮想宇宙
                </p>
                <p className="text-xs text-cosmic-muted">× <a href="/wiki#次元極地平" className="text-electric-blue hover:underline">Dimension Horizon</a></p>
              </div>
              <ArrowDown className="w-5 h-5 text-cosmic-muted rotate-90 sm:rotate-0 shrink-0" />
              <div className="bg-gold-accent/15 border border-gold-accent/30 rounded-lg p-4 min-w-[160px]">
                <p className="text-xs text-cosmic-muted mb-1">到達点</p>
                <p className="text-sm font-bold text-gold-accent">AD2026</p>
                <p className="text-xs text-cosmic-muted">地球インターネット</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cosmic-dark/50 rounded-lg border border-cosmic-border/50">
              <h4 className="text-sm font-bold text-cosmic-text mb-2">
                なぜ2026年？
              </h4>
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
            <h3 className="text-lg font-bold text-electric-blue mb-4">
              放送プラットフォーム
            </h3>
            <div className="space-y-3">
              {PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border ${p.color} ${p.bg} transition-all hover:scale-[1.01]`}
                >
                  <Badge
                    variant="outline"
                    className={`w-fit text-[10px] ${p.color} shrink-0`}
                  >
                    {p.type}
                  </Badge>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
                  >
                    <p className="text-sm font-mono text-cosmic-text truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-cosmic-muted">{p.desc}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   IRIS CHARACTER PROFILE
   ═══════════════════════════════════════════ */
const IRIS_TIMELINE = [
  { year: "E480", event: "ヴァーミリオン裏路地で戦闘開始", loc: "ヴァーミリオン" },
  { year: "E485", event: "諜報機関にスカウト", loc: "ヴァーミリオン" },
  { year: "E490", event: "ボグダス・ジャベリンと協力関係構築", loc: "ヴァーミリオン" },
  { year: "E505", event: "諜報機関長に昇進", loc: "ヴァーミリオン" },
  { year: "E510", event: "シルバー・ヴェノムに拉致・救出", loc: "東大陸・クレセント" },
  { year: "E512", event: "フィオナと協力・V7設立準備", loc: "ブルーローズ" },
  { year: "E515", event: "V7正式設立", loc: "東大陸・クレセント" },
  { year: "E519", event: "アルファ・ヴェノムに再拉致・救出", loc: "東大陸・クレセント" },
  { year: "E520", event: "トリニティ・アライアンス結成", loc: "ミエルテンガ" },
  { year: "E523", event: "フィオナの裏切り発覚", loc: "東大陸・クレセント" },
  { year: "E528", event: "現在 — V7 vs トリニティ冷戦継続", loc: "東大陸・クレセント" },
];

const IRIS_ABILITIES = [
  { name: "ブルーワイヤ", desc: "特殊な青色のワイヤーを操作し、敵の拘束・移動・攻撃に使用するアイリスの代名詞的武装", color: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
  { name: "ウォーター・オーブ", desc: "水属性のオーブを生成・操作する能力。防御・攻撃両面で運用", color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300" },
  { name: "ブラックダイス", desc: "黒いダイス型の特殊武器。戦闘術と戦略分析に組み合わせて使用", color: "bg-slate-500/20 border-slate-400/30 text-slate-300" },
  { name: "戦略分析", desc: "複雑な政治情勢と戦況を瞬時に分析し、最適な行動指針を導き出す卓越した知略", color: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
];

const IRIS_RELATIONS = [
  { name: "ウィリー", note: "パートナー兼元恋人。アイリスの最も近い理解者", color: "border-rose-400/30" },
  { name: "エレナ", note: "ヴァーミリオン諜報機関元本部長。アイリスの直属の上司", color: "border-purple-400/30" },
  { name: "セバスチャン", note: "ボグダス・ジャベリンリーダー。IRIS現代ランキング4位", color: "border-cyan-400/30" },
  { name: "フィオナ", note: "ブルーローズ統率者。かつての盟友だが…IRIS2位", color: "border-blue-400/30" },
  { name: "マリーナ・ボビン", note: "ミエルテンガ総統。真の黒幕の可能性。IRIS3位", color: "border-amber-400/30" },
  { name: "イズミ", note: "アルファ・ヴェノムリーダー。アイリスの最大の脅威", color: "border-red-400/30" },
];

function IrisSection() {
  return (
    <section id="iris" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Shield className="w-6 h-6 text-rose-400" />}
            title="アイリス"
            subtitle={<>Iris — <a href="/wiki#ヴァーミリオン" className="text-rose-400 hover:underline">ヴァーミリオン</a>の英雄、<a href="/wiki#トリニティ・アライアンス" className="text-rose-400 hover:underline">トリニティ・アライアンス</a>指導者</>}
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative">
                  <img
                    src="https://raw.githubusercontent.com/gentaron/image/main/Iris.png"
                    alt="アイリス"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-gold-accent/20 border border-gold-accent/40 text-gold-accent">
                      <Crown className="w-3 h-3" /> IRIS 1位
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xl font-bold text-cosmic-text">アイリス</p>
                    <p className="text-xs text-rose-400">Iris — Dominion Vermillion</p>
                    <p className="text-[10px] text-cosmic-muted mt-1">トリニティ・アライアンス指導者</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Info */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-rose-400 mb-4 uppercase tracking-wider">
                  プロフィール
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {([
                    ["所属", <a key="wl1" href="/wiki#トリニティ・アライアンス" className="text-electric-blue hover:underline">トリニティ・アライアンス</a>],
                    ["前所属", <React.Fragment key="wl2"><a href="/wiki#ヴァーミリオン" className="text-electric-blue hover:underline">ヴァーミリオン</a>諜報機関長</React.Fragment>],
                    ["外見", "青いボディスーツ・白いショール"],
                    ["特徴", "背中ジッパー・黒いダイス"],
                    ["性格", "冷徹・ strategic・仲間思い"],
                    ["Tier", "Tier 1（現役最強）"],
                  ] as [string, React.ReactNode][]).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-cosmic-muted text-xs mb-0.5">{k}</p>
                      <p className="text-cosmic-text font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">
                  能力・装備
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {IRIS_ABILITIES.map((ability) => (
                    <div
                      key={ability.name}
                      className={`p-3 rounded-lg border ${ability.color} transition-all hover:scale-[1.02]`}
                    >
                      <p className="text-sm font-bold mb-1">{ability.name}</p>
                      <p className="text-[11px] opacity-80">{ability.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Relationships */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-bold text-pink-400 mb-4 uppercase tracking-wider">
                  主要関係者
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {IRIS_RELATIONS.map((rel) => (
                    <div
                      key={rel.name}
                      className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${rel.color} hover:bg-cosmic-dark/50 transition-colors`}
                    >
                      <span className="text-cosmic-muted mt-0.5 shrink-0 text-xs">▸</span>
                      <div className="min-w-0">
                        <p className="text-sm text-cosmic-text font-medium">{rel.name}</p>
                        <p className="text-[11px] text-cosmic-muted">{rel.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Iris Story Timeline */}
        <RevealSection>
          <div className="mt-8 glass-card rounded-xl p-6">
            <h3 className="text-sm font-bold text-rose-400 mb-4 uppercase tracking-wider">
              アイリス物語年表
            </h3>
            <div className="space-y-2 ml-2 border-l-2 border-rose-400/30 pl-4">
              {IRIS_TIMELINE.map((t, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 text-sm items-start">
                  <span className="text-rose-400 font-bold shrink-0 w-16">{t.year}</span>
                  <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${locColor[t.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                    {t.loc}
                  </span>
                  <span className="text-cosmic-text/90">{t.event}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Organizations & Political Landscape */}
        <RevealSection>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trinity Alliance */}
            <div className="glass-card rounded-xl p-5 border border-cyan-400/20">
              <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <a href="/wiki#トリニティ・アライアンス" className="text-cyan-400 hover:underline">トリニティ・アライアンス</a>
              </h4>
              <p className="text-xs text-cosmic-muted mb-3">
                アイリスが指導する3勢力連合。E520年結成。
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["ヴァーミリオン", "ミエルテンガ", "ボグダス・ジャベリン"].map((n) => (
                  <span key={n} className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">{n}</span>
                ))}
              </div>
            </div>

            {/* V7 */}
            <div className="glass-card rounded-xl p-5 border border-blue-400/20">
              <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <a href="/wiki#V7" className="text-blue-400 hover:underline">V7</a> (Vital Seven)
              </h4>
              <p className="text-xs text-cosmic-muted mb-3">
                フィオナが急先鋒の7カ国連合。E515年設立。
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["ブルーローズ", "SSレンジ", "クロセヴィア", "アイアン・シンジケート", "ファティマ連邦"].map((n) => (
                  <span key={n} className="text-[10px] bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">{n}</span>
                ))}
              </div>
            </div>

            {/* Alpha Venom */}
            <div className="glass-card rounded-xl p-5 border border-red-400/20">
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <a href="/wiki#アルファ・ヴェノム" className="text-red-400 hover:underline">アルファ・ヴェノム</a>
              </h4>
              <p className="text-xs text-cosmic-muted mb-3">
                イズミ率いる暗黒組織。シルバー・ヴェノムの後継。
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["イズミ", "ボブリスティ", "ギル", "カタリナ", "ゴルディロックス", "AJ"].map((n) => (
                  <span key={n} className="text-[10px] bg-red-500/15 text-red-300 px-2 py-0.5 rounded border border-red-500/20">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* External link */}
        <RevealSection>
          <div className="mt-6 text-center">
            <a
              href="/story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Shield className="w-4 h-4" />
              EDU小説集を読む
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONSISTENCY NOTES ★ VERY IMPORTANT
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
            {/* Point 1 */}
            <div className="relative rounded-xl p-6 sm:p-8 bg-cosmic-surface consistency-border overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gold-accent/20 flex items-center justify-center text-sm font-bold text-gold-accent">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-gold-accent">
                    「ギガポリス」名称の整合性
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-cosmic-muted leading-relaxed">
                  <p>
                    ミナ・エウレカは「
                    <span className="text-cosmic-text font-medium">Gigapolis</span>
                    」と呼んでいる。
                  </p>
                  <p>
                    彼女の時代（E499〜E528）、この都市はエヴァトロンによって「
                    <span className="text-red-400 font-medium">
                      エヴァポリス（Evapolis）
                    </span>
                    」と改名されていた。
                  </p>
                  <p>
                    しかし、これはあくまでエヴァトロン側が付けた一方的な名称に過ぎない。
                  </p>
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

            {/* Point 2 */}
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
                    <span className="text-electric-blue font-medium">5名体制</span>
                    （Kate Patton, Lillie Ardent, Layla, Mina, Ninny）。
                  </p>
                  <p>
                    しかし、第一世代（E290〜）は5名ではなかった。
                  </p>
                  <p>
                    初代は{" "}
                    <span className="text-cosmic-text font-medium">
                      Kate Claudia
                    </span>{" "}
                    と{" "}
                    <span className="text-cosmic-text font-medium">
                      Lily Steiner
                    </span>{" "}
                    を中心とする集団で、Layla Virell NovaがE325以降に参加。
                  </p>
                  <p>
                    初代の正確な構成員数は記録が散逸しており不明。
                  </p>
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

            {/* Point 3 */}
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
                    実際にはエヴァトロン時代の弾圧の中で、その実力ゆえに{" "}
                    <span className="text-cosmic-text font-medium">特別措置として冷凍保存</span>{" "}
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
  );
}

/* ═══════════════════════════════════════════
   CHARACTER TIERS & FACTION ROSTER
   ═══════════════════════════════════════════ */
function CharacterTiersSection() {
  const tiers = [
    {
      label: "神格・歴史的人物",
      color: "from-gold-accent/20 to-gold-dim/10",
      borderColor: "border-gold-accent/30",
      textColor: "text-gold-accent",
      icon: <Crown className="w-4 h-4" />,
      chars: ["Diana", "セリア・ドミニクス", "Kate Claudia", "Lily Steiner"],
    },
    {
      label: "Tier 1（現役最強）",
      color: "from-nebula-purple/20 to-nebula-purple-dim/10",
      borderColor: "border-nebula-purple/30",
      textColor: "text-nebula-purple",
      icon: <Swords className="w-4 h-4" />,
      chars: [
        "Jen (Lv938+)",
        "Tina / Gue",
        "Layla",
        "Slime Woman",
        "アイリス",
      ],
    },
    {
      label: "Tier 2（主要活動層）",
      color: "from-electric-blue/20 to-electric-blue-dim/10",
      borderColor: "border-electric-blue/30",
      textColor: "text-electric-blue",
      icon: <Shield className="w-4 h-4" />,
      chars: [
        "Kate Patton",
        "Lillie Ardent",
        "Mina",
        "Ninny",
        "フィオナ",
        "セバスチャン",
        "弦太郎 (Lv569)",
      ],
    },
  ];

  const factions = [
    {
      name: "トリニティ・アライアンス / ボグダス・ジャベリン",
      subtitle: "Trinity Alliance / Bogdas Javelin",
      color: "text-cyan-400",
      borderColor: "border-cyan-400/30",
      dotColor: "bg-cyan-400",
      members: [
        { name: "アイリス", note: "ヴァーミリオン首脳・トリニティ・アライアンス指導者" },
        { name: "セバスチャン・ヴァレリウス", note: "ボグダス・ジャベリンリーダー" },
        { name: "ガレス", note: "ボグダス・ジャベリン副リーダー" },
        { name: "ミユシャリ", note: "ボグダス・ジャベリンメンバー" },
        { name: "ファリエル", note: "ボグダス・ジャベリンメンバー" },
        { name: "エレナ", note: "ヴァーミリオン諜報機関・元本部長" },
        { name: "アイナ・フォン・リースフェルト", note: "ボグダス・ジャベリンメンバー" },
        { name: "フレデリック・ギャビー", note: "ボグダス・ジャベリンメンバー" },
        { name: "ミナ・エウレカ", note: "ボグダス・ジャベリンメンバー" },
        { name: "シェロン・ジェラス", note: "ボグダス・ジャベリンメンバー" },
        { name: "イルミーゼ", note: "ボグダス・ジャベリンメンバー" },
        { name: "ホワイトノイズ", note: "ボグダス・ジャベリンメンバー" },
        { name: "ワドリナ", note: "ボグダス・ジャベリンメンバー" },
        { name: "ニニギス・カラス", note: "ボグダス・ジャベリンメンバー" },
        { name: "イェシバトー", note: "ボグダス・ジャベリンメンバー" },
        { name: "アザゼル・ヘクトパス", note: "元ヴァーミリオン首脳" },
      ],
    },
    {
      name: "V7 / ブルー・ローズ",
      subtitle: "V7 / Blue Rose",
      color: "text-blue-400",
      borderColor: "border-blue-400/30",
      dotColor: "bg-blue-400",
      members: [
        { name: "フィオナ", note: "ブルー・ローズ統率者・V7急先鋒" },
        { name: "ピアトリーノ", note: "フィオナの腹心・ブルー・ローズ地下街担当" },
        { name: "マリーナ・ボビン", note: "ミエルテンガ総統" },
        { name: "カスチーナ・テンペスト", note: "クロセヴィア首脳" },
        { name: "アイク・ロペス", note: "SSレンジ首脳" },
        { name: "レイド・カキザキ", note: "アイアン・シンジケート首脳" },
        { name: "ミカエル・ガブリエリ", note: "ファールージャ社CEO" },
        { name: "ヨニック", note: "ブルー・ローズ政府最高司令官" },
      ],
    },
    {
      name: "アルファ・ヴェノム（シルバー・ヴェノム）",
      subtitle: "Alpha Venom / Silver Venom",
      color: "text-red-400",
      borderColor: "border-red-400/30",
      dotColor: "bg-red-400",
      members: [
        { name: "マスター・ヴェノム", note: "シルバー・ヴェノムリーダー（「影の支配者」・本名不明）" },
        { name: "レヴィリア・サーペンティナ", note: "シルバー・ヴェノム幹部" },
        { name: "レオン", note: "シルバー・ヴェノム幹部" },
        { name: "ヴィヴィエッタ", note: "四楓院ヴィヴィエッタ・元捕虜" },
        { name: "イズミ", note: "アルファ・ヴェノムメンバー" },
        { name: "ゴルディロックス", note: "アルファ・ヴェノムメンバー" },
        { name: "カタリナ", note: "アルファ・ヴェノムメンバー" },
        { name: "ボブリスティ", note: "アルファ・ヴェノムメンバー" },
        { name: "ギル", note: "アルファ・ヴェノムメンバー" },
        { name: "ラストマン", note: "シルバー・ヴェノム残党" },
      ],
    },
    {
      name: "その他の登場人物",
      subtitle: "Other Characters",
      color: "text-cosmic-muted",
      borderColor: "border-cosmic-border/50",
      dotColor: "bg-cosmic-muted",
      members: [
        { name: "ゴールデン・ヴェノム捕虜男性", note: "名前なし・組織名のみ記録" },
        { name: "ヴァーミリオン政府高官3名", note: "外交担当など・個別名なし" },
        { name: "エリオス", note: "E470年 処刑" },
        { name: "弦太郎", note: "Lv569" },
      ],
    },
  ];

  return (
    <section id="characters" className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Crown className="w-6 h-6 text-gold-accent" />}
            title="キャラクターTier表"
            subtitle="Eternal Dominion Universe — 現勢力バランス"
          />
        </RevealSection>

        <RevealSection>
          <div className="space-y-6">
            {tiers.map((tier) => (
              <div
                key={tier.label}
                className={`glass-card rounded-xl border ${tier.borderColor} overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
              >
                <div
                  className={`bg-gradient-to-r ${tier.color} px-6 py-4 flex items-center gap-3`}
                >
                  {tier.icon}
                  <h3 className={`font-bold ${tier.textColor}`}>{tier.label}</h3>
                </div>
                <div className="p-6 flex flex-wrap gap-3">
                  {tier.chars.map((c) => (
                    <span
                      key={c}
                      className={`px-4 py-2 rounded-lg bg-cosmic-dark/60 border ${tier.borderColor} text-sm text-cosmic-text font-medium hover:bg-cosmic-dark transition-colors cursor-default`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* IRIS Ranking */}
            <div className="glass-card rounded-xl p-6 border border-pink-400/20">
              <h3 className="text-sm font-bold text-pink-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                IRIS現代ランキング
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { rank: 1, name: "アイリス", color: "text-gold-accent" },
                  { rank: 2, name: "フィオナ", color: "text-gray-300" },
                  { rank: 3, name: "マリーナ", color: "text-amber-700" },
                  { rank: 4, name: "セバスチャン", color: "text-cosmic-muted" },
                  { rank: 5, name: "カスチーナ", color: "text-cosmic-muted" },
                ].map((r) => (
                  <div
                    key={r.rank}
                    className="flex items-center gap-2 bg-cosmic-dark/50 rounded-lg px-3 py-2 border border-cosmic-border/50"
                  >
                    <span className={`text-lg font-black ${r.color} w-6 text-center`}>
                      {r.rank}
                    </span>
                    <span className="text-sm text-cosmic-text font-medium">
                      {r.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ─── Faction Character Roster ─── */}
        <RevealSection>
          <div className="mt-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-400/20 mb-4">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cosmic-gradient mb-2">
                勢力別キャラクター一覧
              </h2>
              <p className="text-cosmic-muted text-sm max-w-xl mx-auto">
                E528現代における主要勢力と所属キャラクターの完全リスト
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {factions.map((faction) => (
                <div
                  key={faction.name}
                  className={`glass-card rounded-xl border ${faction.borderColor} overflow-hidden transition-all duration-300 hover:scale-[1.01]`}
                >
                  <div className="px-6 py-4 bg-gradient-to-r from-cosmic-surface to-cosmic-dark/50 flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${faction.dotColor} shrink-0`} />
                    <div>
                      <h3 className={`font-bold text-sm ${faction.color}`}>
                        {faction.name}
                      </h3>
                      <p className="text-[10px] text-cosmic-muted font-mono">
                        {faction.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    {faction.members.map((m) => (
                      <div
                        key={m.name}
                        className={`flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-cosmic-dark/50 transition-colors`}
                      >
                        <span className={`text-cosmic-muted mt-0.5 shrink-0 text-xs`}>▸</span>
                        <div className="min-w-0">
                          <p className="text-sm text-cosmic-text font-medium">{m.name}</p>
                          <p className="text-[11px] text-cosmic-muted">{m.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FACTION LINEAGES
   ═══════════════════════════════════════════ */
const FACTION_TREES = [
  {
    name: "テクロサス系譜",
    color: "border-nebula-purple",
    dotColor: "bg-nebula-purple",
    textColor: "text-nebula-purple",
    nodes: [
      { year: "E15", name: "ファランクス" },
      { year: "E295", name: "テクロサス" },
      { year: "E470", name: "東方支隊" },
      { year: "現在", name: "ボグダス・ジャベリン" },
    ],
  },
  {
    name: "Alpha Venom系譜",
    color: "border-red-400",
    dotColor: "bg-red-400",
    textColor: "text-red-400",
    nodes: [
      { year: "E420", name: "Σ-Unit" },
      { year: "E475", name: "シルバー・ヴェノム" },
      { year: "E500", name: "アルファ・ヴェノム / ゴールデン・ヴェノム" },
    ],
  },
  {
    name: "政体系譜",
    color: "border-electric-blue",
    dotColor: "bg-electric-blue",
    textColor: "text-electric-blue",
    nodes: [
      { year: "E285", name: "ZAMLT" },
      { year: "E335", name: "セリア黄金期" },
      { year: "E400", name: "エヴァトロン" },
      {
        year: "E475",
        name: "ポスト・エヴァトロン",
        children: ["西: Valoria", "東: トリニティ", "V7"],
      },
    ],
  },
];

function FactionNode({
  node,
  color,
  dotColor,
  isLast,
}: {
  node: (typeof FACTION_TREES)[0]["nodes"][0];
  color: string;
  dotColor: string;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0`} />
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[24px] ${color} opacity-30`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-4">
        <span className="text-xs text-cosmic-muted">{node.year}</span>
        <p className={`text-sm font-medium ${color.replace("border-", "text-")}`}>
          {node.name}
        </p>
        {node.children && (
          <div className="flex flex-wrap gap-2 mt-2">
            {node.children.map((child) => (
              <span
                key={child}
                className="text-xs bg-cosmic-surface px-2 py-0.5 rounded text-cosmic-muted"
              >
                {child}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FactionSection() {
  return (
    <section id="factions" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Swords className="w-6 h-6 text-red-400" />}
            title="勢力系譜"
            subtitle="E16連星系の主要勢力の系統図"
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FACTION_TREES.map((tree) => (
              <div
                key={tree.name}
                className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300"
              >
                <h3 className={`text-base font-bold ${tree.textColor} mb-6 flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${tree.dotColor}`} />
                  {tree.name}
                </h3>
                <div>
                  {tree.nodes.map((node, idx) => (
                    <FactionNode
                      key={idx}
                      node={node}
                      color={tree.color}
                      dotColor={tree.dotColor}
                      isLast={idx === tree.nodes.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
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
          <p className="text-xs text-cosmic-muted">
            AURALIS 地球2026交信プロジェクト設定書 v2.0
          </p>
        </div>
        <div className="flex justify-center gap-4 text-xs text-cosmic-muted">
          <Link href="/game" className="hover:text-rose-400 transition-colors">Card Game</Link>
          <span className="text-cosmic-border">|</span>
          <Link href="/card-game" className="hover:text-orange-400 transition-colors">PvE Battle</Link>
          <span className="text-cosmic-border">|</span>
          <Link href="/wiki" className="hover:text-gold-accent transition-colors">Wiki</Link>
          <span className="text-cosmic-border">|</span>
          <Link href="/story/IRIS_1" className="hover:text-cyan-400 transition-colors">Story</Link>
          <span className="text-cosmic-border">|</span>
          <span>E528 / AD2026</span>
          <span className="text-cosmic-border">|</span>
          <span>光と音を永遠にする</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
  const [activeSection, setActiveSection] = useState("");

  /* Track active section on scroll */
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY + 100;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTIONS[i].id);
      if (el && el.offsetTop <= scrollY) {
        setActiveSection(SECTIONS[i].id);
        return;
      }
    }
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame to avoid calling setState synchronously in effect
    const raf = requestAnimationFrame(() => {
      handleScroll();
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative min-h-screen bg-cosmic-dark">
      <StarField />
      <Navigation activeSection={activeSection} />

      <main className="relative z-10">
        <HeroSection />

        {/* Quick Access Cards */}
        <RevealSection>
          <QuickAccessSection />
        </RevealSection>

        {/* Divider between hero and content */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-nebula-purple/40 to-transparent" />

        <UniverseSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />

        <TimelineSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent" />

        <AuralisSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-nebula-purple/20 to-transparent" />

        <MinaSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />

        <LiminalSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent" />

        <ConsistencySection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />

        <IrisSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-nebula-purple/20 to-transparent" />

        <CharacterTiersSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent" />

        <FactionSection />
      </main>

      <FooterSection />
    </div>
  );
}
