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
} from "lucide-react";

/* ─── Section IDs ─── */
const SECTIONS = [
  { id: "universe", label: "宇宙構造" },
  { id: "timeline", label: "年表" },
  { id: "auralis", label: "AURALIS" },
  { id: "mina", label: "ミナ" },
  { id: "liminal", label: "リミナル・フォージ" },
  { id: "consistency", label: "整合性ノート" },
  { id: "characters", label: "キャラクター" },
  { id: "factions", label: "勢力系譜" },
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

/* ─── Floating Stars Background ─── */
function StarField() {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  ).current;

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
                href={`#${s.id}`}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all rounded-md hover:bg-cosmic-surface ${
                  activeSection === s.id
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
                href={`#${s.id}`}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeSection === s.id
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
            subtitle="E16連星系 — M104銀河ハローに浮かぶ人類の新たな故郷"
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* E16 Binary Star System */}
            <div className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300">
              <h3 className="text-lg font-bold text-electric-blue mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" /> E16連星系
              </h3>
              <div className="space-y-3">
                {[
                  ["所在", "M104銀河ハロー、カシオペア矮小銀河近傍"],
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
                <Globe2 className="w-5 h-5" /> シンフォニー・オブ・スターズ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* West Continent */}
                <div className="bg-cosmic-dark/50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-nebula-purple mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-nebula-purple" />
                    西大陸: Gigapolis圏
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
                      "クロセヴィア",
                      "SSレンジ",
                      "ブルー・ローズ",
                      "ミエルテンガ",
                      "アイアン・シンジケート",
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
const TIMELINE_DATA = [
  {
    period: "前史 (Pre-E1)",
    range: "AD 3500以前",
    color: "text-gold-accent",
    borderColor: "border-gold-accent/30",
    events: [
      "銀河間移民期 — 地球からE16連星系への大規模移住が始まる",
      "E0: 第一陣1,000名がシンフォニー・オブ・スターズに到着",
    ],
  },
  {
    period: "第一期 E1〜E200",
    range: "入植・帝国・革命",
    color: "text-nebula-purple",
    borderColor: "border-nebula-purple/30",
    events: [
      "E1: 定住開始、A-Registry（先祖登録制度）の萌芽",
      "E14: エルトナ戦争",
      "E15〜E61: バーズ帝国 — 星系統一の時代",
      "E62〜E77: アフター戦争・チョンクォン戦争",
      "E108〜E114: クワンナラ革命",
      "E153〜E201: 第四繁栄期、Gigapolis GDP14京ドルに達する",
    ],
  },
  {
    period: "第二期 E200〜E320",
    range: "ロンバルディア帝国・Diana台頭",
    color: "text-electric-blue",
    borderColor: "border-electric-blue/30",
    events: [
      "E205〜E278: ロンバルディア帝国 — 西大陸覇権",
      "E260〜E280: Diana（初代Wonder Woman）台頭",
      "E270: AURALIS Proto創設（Diana時代の前身組織）",
      "E290: AURALIS Collective第一世代正式組織化",
      "E285〜E304: ZAMLT連合 — 東西協調体制",
    ],
  },
  {
    period: "第三期 E319〜E400",
    range: "新ZAMLT・セリア黄金期・Jen/Layla台頭",
    color: "text-green-400",
    borderColor: "border-green-400/30",
    events: [
      "E319: 新ZAMLT期、Jen台頭（Valoria）",
      "E325: Layla Virell Nova覚醒、弦太郎登場",
      "E335〜E370: セリア・ドミニクスがSelinopolis改名、黄金時代",
      "E340: Slime Woman出現",
      "E370〜E400: ドミニオン崩壊",
    ],
  },
  {
    period: "第四期 E400〜E475",
    range: "エヴァトロン支配",
    color: "text-red-400",
    borderColor: "border-red-400/30",
    events: [
      "E400〜E450: エヴァトロン支配 — 暗黒時代",
      "E420: Σ-Unit設立（Alpha Venom起源）",
      "E450〜E475: エヴァポリス崩壊、支配終焉",
    ],
  },
  {
    period: "第五期 E475〜E528",
    range: "ポスト・エヴァトロン・現代",
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    events: [
      "E499: ミナ誕生（ノスタルジア・コロニー）",
      "E509: Alpha Venom攻撃、ミナ難民船脱出",
      "E514: ミナ大学入学",
      "E522: AURALIS第二世代発足",
      "E524: 諸世界連邦サミット",
      "E525: リミナル・フォージ立ち上げ",
      "E528: 現在",
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
                      <div key={evIdx} className="flex gap-3 text-sm">
                        <span className="text-cosmic-muted mt-0.5 shrink-0">▸</span>
                        <span className="text-cosmic-text/90">{ev}</span>
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
            title="AURALIS Collective"
            subtitle="「光と音を永遠にする — Where Light and Sound Become Eternal」"
          />
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
                    Kate Patton（初代）, Lillie Ardent（初代）
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
                    初代は5名ではなかった。Kate Patton（初代）・Lillie
                    Ardent（初代）を中心とする集団で、Laylaを含む複数の参加者がいたが、正確な人数は不明。第二世代の5人体制とは異なる。
                  </p>
                </div>

                <div className="text-sm text-cosmic-muted">
                  <p>
                    <span className="text-cosmic-text">E335〜E370:</span>{" "}
                    セリア黄金期に最盛期
                  </p>
                  <p>
                    <span className="text-cosmic-text">E400:</span>{" "}
                    エヴァトロン弾圧で解体
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
                      name: "Kate Patton（新代）",
                      desc: "大地の豊かさ・安定",
                      color: "bg-green-500/20 border-green-500/40",
                    },
                    {
                      name: "Lillie Ardent（新代）",
                      desc: "情熱的で大胆",
                      color: "bg-red-500/20 border-red-500/40",
                    },
                    {
                      name: "Layla Virell Nova",
                      desc: "Pink Voltage（第一世代から連続）",
                      color: "bg-pink-500/20 border-pink-500/40",
                    },
                    {
                      name: "Mina Eureka Ernst",
                      desc: "celestial × avant-garde, AI研究員",
                      color: "bg-blue-500/20 border-electric-blue/40",
                    },
                    {
                      name: "Ninny Offenbach",
                      desc: "無邪気で爆発的な活力",
                      color: "bg-yellow-500/20 border-gold-accent/40",
                    },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border ${m.color}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-cosmic-dark flex items-center justify-center text-xs font-bold">
                        {m.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cosmic-text">
                          {m.name}
                        </p>
                        <p className="text-xs text-cosmic-muted">{m.desc}</p>
                      </div>
                    </div>
                  ))}
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
            subtitle="Mina Eureka Ernst — AURALIS第二世代、リミナル・フォージ創設者"
          />
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                <div className="relative">
                  <img
                    src="/edu-mina.png"
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
                  {[
                    ["生年月日", "E499年8月16日"],
                    ["年齢", "29歳"],
                    ["血液型", "AB型"],
                    ["出生地", "ノスタルジア・コロニー"],
                    ["外見", "青い長髪・長身"],
                    ["性格", "マイペース・先進的・承認欲求あり"],
                  ].map(([k, v]) => (
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
  },
  {
    name: "bsky.app/minaeurekaernst",
    desc: "ミナの直接放送",
    type: "SOCIAL",
    color: "text-electric-blue border-electric-blue/30",
    bg: "bg-electric-blue/10",
  },
  {
    name: "note.com/gensnotes",
    desc: "Genesis Vault（2000本突破）",
    type: "ARCHIVE",
    color: "text-green-400 border-green-400/30",
    bg: "bg-green-400/10",
  },
  {
    name: "suno.com/@liminalforge",
    desc: "音楽放送",
    type: "MUSIC",
    color: "text-gold-accent border-gold-accent/30",
    bg: "bg-gold-accent/10",
  },
  {
    name: "pixai.art/@apolon",
    desc: "ビジュアル放送",
    type: "VISUAL",
    color: "text-pink-400 border-pink-400/30",
    bg: "bg-pink-400/10",
  },
];

function LiminalSection() {
  return (
    <section id="liminal" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <SectionHeader
            icon={<Radio className="w-6 h-6 text-gold-accent" />}
            title="リミナル・フォージ"
            subtitle="Liminal Forge — E528からAD2026へ、時空を超えた放送プロジェクト"
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
                  ペルセポネ仮想宇宙
                </p>
                <p className="text-xs text-cosmic-muted">× Dimension Horizon</p>
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-cosmic-text truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-cosmic-muted">{p.desc}</p>
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
                    （Kate新代, Lillie新代, Layla, Mina, Ninny）。
                  </p>
                  <p>
                    しかし、第一世代（E290〜）は5名ではなかった。
                  </p>
                  <p>
                    初代は{" "}
                    <span className="text-cosmic-text font-medium">
                      Kate Patton（初代）
                    </span>{" "}
                    と{" "}
                    <span className="text-cosmic-text font-medium">
                      Lillie Ardent（初代）
                    </span>{" "}
                    を中心とする集団で、Layla Virell NovaがE325以降に参加。
                  </p>
                  <p>
                    初代の正確な構成員数は記録が散逸しており不明。
                  </p>
                  <p>
                    「名」の継承制度（Kate Patton, Lillie
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
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CHARACTER TIERS
   ═══════════════════════════════════════════ */
function CharacterTiersSection() {
  const tiers = [
    {
      label: "神格・歴史的人物",
      color: "from-gold-accent/20 to-gold-dim/10",
      borderColor: "border-gold-accent/30",
      textColor: "text-gold-accent",
      icon: <Crown className="w-4 h-4" />,
      chars: ["Diana", "セリア・ドミニクス", "Kate初代", "Lillie初代"],
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
        "Kate新代",
        "Lillie新代",
        "Mina",
        "Ninny",
        "フィオナ",
        "セバスチャン",
        "弦太郎 (Lv569)",
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

        <div className="w-full h-px bg-gradient-to-r from-transparent via-nebula-purple/20 to-transparent" />

        <CharacterTiersSection />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent" />

        <FactionSection />
      </main>

      <FooterSection />
    </div>
  );
}
