"use client"

import Link from "next/link"
import {
  Crown,
  Heart,
  Shield,
  Scale,
  Telescope,
  Sparkles,
  Radio,
  Skull,
  Swords,
  Globe2,
  ExternalLink,
  ArrowRight,
  Users,
  TrendingUp,
  Zap,
  Star,
  MapPin,
  Building2,
  Orbit,
  Flame,
  Handshake,
  AlertTriangle,
} from "lucide-react"
import { PageHeader } from "@/platform/page-header"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
} from "@/domains/civilizations/civ.data"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"

const ICON_MAP: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Telescope: <Telescope className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Package: <Radio className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Skull: <Skull className="w-6 h-6" />,
  Swords: <Swords className="w-6 h-6" />,
}

/* Hero stat badges for the overview */
const COSMIC_STATS = [
  {
    icon: <Globe2 className="w-5 h-5 text-amber-400" />,
    label: { ja: "宇宙文明圏総数", en: "Total Civilizations" },
    value: "8+",
    glow: "shadow-amber-400/20",
  },
  {
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    label: { ja: "5大文明圏GDP合計", en: "Combined Top 5 GDP" },
    value: "400兆+",
    glow: "shadow-amber-400/20",
  },
  {
    icon: <Users className="w-5 h-5 text-cyan-400" />,
    label: { ja: "宇宙連合会合", en: "Cosmic Assembly" },
    value: "E528",
    glow: "shadow-cyan-400/20",
  },
  {
    icon: <Orbit className="w-5 h-5 text-violet-400" />,
    label: { ja: "管理惑星数", en: "Controlled Planets" },
    value: "40+",
    glow: "shadow-violet-400/20",
  },
  {
    icon: <Swords className="w-5 h-5 text-rose-400" />,
    label: { ja: "主要紛争", en: "Major Conflicts" },
    value: "3",
    glow: "shadow-rose-400/20",
  },
  {
    icon: <Handshake className="w-5 h-5 text-emerald-400" />,
    label: { ja: "外交関係", en: "Diplomatic Ties" },
    value: "20+",
    glow: "shadow-emerald-400/20",
  },
]

/* Diplomacy matrix data */
const DIPLOMACY_COLORS: Record<string, string> = {
  "同盟・協力": "bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
  経済援助: "bg-amber-500/30 text-amber-300 border-amber-500/40",
  "対立・緊張": "bg-red-500/30 text-red-300 border-red-500/40",
  構造的対立: "bg-rose-500/30 text-rose-300 border-rose-500/40",
  調停対象: "bg-violet-500/30 text-violet-300 border-violet-500/40",
  "懸念・警告": "bg-orange-500/30 text-orange-300 border-orange-500/40",
}

const DIPLOMACY_EN_COLORS: Record<string, string> = {
  "Economic aid": "bg-amber-500/30 text-amber-300 border-amber-500/40",
  Adversarial: "bg-red-500/30 text-red-300 border-red-500/40",
  "Structural opposition": "bg-rose-500/30 text-rose-300 border-rose-500/40",
  Mediation: "bg-violet-500/30 text-violet-300 border-violet-500/40",
  Concerns: "bg-orange-500/30 text-orange-300 border-orange-500/40",
  Cooperation: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
  Opposition: "bg-red-500/30 text-red-300 border-red-500/40",
  "Cultural exchange": "bg-cyan-500/30 text-cyan-300 border-cyan-500/40",
  "Influence expansion": "bg-orange-500/30 text-orange-300 border-orange-500/40",
  Supportive: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
}

function getDiplomacyColor(rel: string, lang: Lang): string {
  if (lang === "en") {
    for (const [key, cls] of Object.entries(DIPLOMACY_EN_COLORS)) {
      if (rel.toLowerCase().includes(key.toLowerCase())) return cls
    }
  } else {
    for (const [key, cls] of Object.entries(DIPLOMACY_COLORS)) {
      if (rel.includes(key)) return cls
    }
  }
  return "bg-edu-surface text-edu-muted border-edu-border/50"
}

export default function CivilizationsPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* ═══ Cosmic Hero Banner with Animated Stars ═══ */}
      <div className="relative overflow-hidden pt-20">
        {/* Animated starfield background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d1117] to-edu-bg">
          <div className="absolute inset-0 overflow-hidden">
            {/* Twinkling stars */}
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
            {/* Nebula glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-[80px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-[60px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-4 pb-16 pt-12">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs tracking-widest mb-6 animate-[fadeIn_1s_ease-out]">
              <Star className="w-3.5 h-3.5" />
              {tl("宇宙最大規模の勢力図", "THE COSMIC POWER MAP", lang)}
              <Star className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight animate-[fadeIn_1s_ease-out_0.2s_both]">
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                {tl("宇宙5大文明圏", "Five Great Cosmic Civilizations", lang)}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out_0.4s_both]">
              {tl(
                "グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙を統治する5つの超大国の全貌",
                "Grandel · Elyseon · Tyeria · Fallujah · Dioclenis — The complete panorama of the five superpowers governing the cosmos",
                lang
              )}
            </p>

            {/* Animated orbiting rings */}
            <div className="relative mt-10 mx-auto w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 border border-amber-400/10 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 border border-cyan-400/10 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
              <div className="absolute inset-8 border border-violet-400/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-12 border border-emerald-400/8 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              {/* Center emblem */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/20 border border-amber-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              {/* Orbiting civilization icons */}
              {[
                {
                  icon: <Crown className="w-4 h-4 text-amber-400" />,
                  top: "0%",
                  left: "50%",
                  delay: "0s",
                },
                {
                  icon: <Heart className="w-4 h-4 text-emerald-400" />,
                  top: "25%",
                  left: "100%",
                  delay: "1s",
                },
                {
                  icon: <Shield className="w-4 h-4 text-rose-400" />,
                  top: "75%",
                  left: "100%",
                  delay: "2s",
                },
                {
                  icon: <Scale className="w-4 h-4 text-violet-400" />,
                  top: "100%",
                  left: "50%",
                  delay: "3s",
                },
                {
                  icon: <Telescope className="w-4 h-4 text-cyan-400" />,
                  top: "75%",
                  left: "0%",
                  delay: "4s",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: item.top, left: item.left }}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-edu-bg/80 border border-edu-border/50 flex items-center justify-center animate-pulse"
                    style={{ animationDelay: item.delay }}
                  >
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ═══ Cosmic Stats Banner ═══ */}
          <RevealSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 -mt-8 relative z-10">
              {COSMIC_STATS.map((s, i) => (
                <div
                  key={s.value}
                  className={`edu-card rounded-xl p-4 text-center border border-edu-border/30 bg-gradient-to-b from-edu-surface/80 to-edu-bg shadow-lg ${s.glow}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <p className="text-2xl font-black bg-gradient-to-r from-white to-edu-text bg-clip-text text-transparent mb-1">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-edu-muted tracking-wide">
                    {lang === "ja" ? s.label.ja : s.label.en}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* ═══ Overview Narrative ═══ */}
          <RevealSection>
            <div className="edu-card rounded-xl p-6 sm:p-8 mb-12 border border-amber-400/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/8 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-tr-full pointer-events-none" />
              <div className="relative">
                <h2 className="text-sm font-bold text-edu-text mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {tl("宇宙情勢概観", "Cosmic Overview", lang)}
                </h2>
                {lang === "ja" ? (
                  <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                    <p>
                      宇宙には多様な文明圏が存在し、それぞれが独自の技術・文化・政治体制で繁栄している。
                      中でも<span className="text-amber-400 font-medium">グランベル</span>
                      を頂点とする5大文明圏は、宇宙の政治・経済・軍事の均衡を左右する重要な勢力である。
                      各文明圏は独自の強みを持ちながらも、複雑な相互依存関係で結ばれている。
                    </p>
                    <p>
                      第一回
                      <a
                        href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                        className="text-edu-accent hover:underline"
                      >
                        宇宙連合会合
                      </a>
                      （E528年）では、全勢力の指導者が
                      <a
                        href={`/wiki/${encodeURIComponent("オルダシティ")}`}
                        className="text-edu-accent hover:underline"
                      >
                        オルダシティ
                      </a>
                      に集い、宇宙の将来について議論した。
                      グランベルのアルゼン・カーリーン大統領は「争いを超え、共存と繁栄の道を見つけることが次世代への責任」と演説したが、
                      ティエリアの軍拡路線やグランベル自体の経済的支配力が他勢力に緊張を与えている。
                    </p>
                    <p>
                      とりわけ
                      <a
                        href={`/wiki/${encodeURIComponent("ヘゲモニー・パラドックス")}`}
                        className="text-edu-accent hover:underline"
                      >
                        ヘゲモニー・パラドックス
                      </a>
                      の概念は、ディオクレニスの科学宰相ネイサン・コリンドによって提起され、
                      グランベルとティエリアの二大勢力による宇宙の不安定化リスクを警告している。
                      過去の
                      <a
                        href={`/wiki/${encodeURIComponent("アポロン・Dominion大戦")}`}
                        className="text-edu-accent hover:underline"
                      >
                        アポロン・Dominion大戦
                      </a>
                      の惨禍が再び繰り返されないか、全文明圏が注視している。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                    <p>
                      The cosmos is home to diverse civilizations, each prospering with unique
                      technologies, cultures, and political systems. The{" "}
                      <span className="text-amber-400 font-medium">
                        Five Great Cosmic Civilizations
                      </span>
                      , led by Grandel, are pivotal forces that shape the balance of power across
                      the cosmos. While each civilization boasts its own strengths, they are bound
                      together by a complex web of interdependence.
                    </p>
                    <p>
                      At the first{" "}
                      <a
                        href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                        className="text-edu-accent hover:underline"
                      >
                        Cosmic Assembly
                      </a>{" "}
                      (E528), leaders of all factions gathered in{" "}
                      <a
                        href={`/wiki/${encodeURIComponent("オルダシティ")}`}
                        className="text-edu-accent hover:underline"
                      >
                        Aldacity
                      </a>
                      . While Granbell&apos;s President Arzen Carleen declared that
                      &ldquo;transcending conflict to find the path of coexistence and prosperity is
                      our responsibility to the next generation,&rdquo; Tyeria&apos;s military
                      expansion and Granbell&apos;s own economic dominance continue to create
                      tension with other powers.
                    </p>
                    <p>
                      The concept of the{" "}
                      <a
                        href={`/wiki/${encodeURIComponent("ヘゲモニー・パラドックス")}`}
                        className="text-edu-accent hover:underline"
                      >
                        Hegemony Paradox
                      </a>
                      , proposed by Dioclenis&apos;s Science Chancellor Nathan Corind, warns of the
                      destabilization risk posed by the Granbell-Tyeria dual-power structure. All
                      civilizations watch anxiously, mindful of the devastation of the{" "}
                      <a
                        href={`/wiki/${encodeURIComponent("アポロン・Dominion大戦")}`}
                        className="text-edu-accent hover:underline"
                      >
                        Apollo-Dominion War
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </RevealSection>

          {/* ═══ 宇宙5大文明圏 — Grand Cards ═══ */}
          <RevealSection>
            <SectionHeader
              icon={<Crown className="w-6 h-6 text-amber-400" />}
              title={tl("宇宙5大文明圏", "Five Great Cosmic Civilizations", lang)}
              subtitle={tl(
                "宇宙を左右する5つの超大国 — GDP、軍事力、技術力、外交影響力の顶点",
                "The five superpowers shaping the cosmos — Pinnacle of GDP, military, technology, and diplomatic influence",
                lang
              )}
            />
          </RevealSection>
          <div className="space-y-6 mb-14">
            {TOP_CIVILIZATIONS.map((civ, idx) => (
              <RevealSection key={civ.id} delay={idx * 120}>
                <Link
                  href={civ.href}
                  className={`group block edu-card rounded-2xl border ${civ.borderColor} bg-gradient-to-br ${civ.bgColor} overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.008] relative`}
                >
                  {/* Animated top accent line */}
                  <div
                    className={`h-0.5 bg-gradient-to-r from-transparent ${civ.color.replace("text-", "text-").replace("400", "400/60")} via-current to-transparent opacity-60`}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-0">
                    {/* Left: Rank badge + icon */}
                    <div
                      className={`flex lg:flex-col items-center justify-center gap-3 p-6 lg:px-10 ${civ.color} relative`}
                    >
                      {/* Glow effect behind rank */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                      <div className="relative">
                        <span className="text-5xl lg:text-6xl font-black opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          #{civ.rank}
                        </span>
                        <div className="hidden lg:block mt-3">
                          {ICON_MAP[civ.icon] || <Globe2 className="w-8 h-8" />}
                        </div>
                        <div className="lg:hidden">
                          {ICON_MAP[civ.icon] || <Globe2 className="w-6 h-6" />}
                        </div>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="p-6 lg:py-8 lg:pr-8 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-edu-text mb-1 group-hover:text-white transition-colors duration-300">
                            {lang === "en" && civ.nameEn ? civ.nameEn : civ.name}
                            {lang !== "en" && civ.nameEn && (
                              <span className="text-sm font-normal text-edu-muted ml-2">
                                {civ.nameEn}
                              </span>
                            )}
                            {lang === "en" && (
                              <span className="text-sm font-normal text-edu-muted ml-2">
                                {civ.name}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-edu-muted flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            {lang === "en" ? "Leader" : "指導者"}: {civ.leader}
                            {"capital" in civ && civ.capital && (
                              <>
                                {" "}
                                · <Building2 className="w-3 h-3 inline" />{" "}
                                {lang === "en" ? "Capital" : "首都"}: {civ.capital}
                              </>
                            )}
                          </p>
                        </div>
                        <ExternalLink
                          className={`w-5 h-5 ${civ.color} opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 mt-1`}
                        />
                      </div>

                      {/* Specialization badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(lang === "en" && civ.specializationEn
                          ? civ.specializationEn
                          : civ.specialization
                        )
                          .split("·")
                          .map((s) => (
                            <span
                              key={s.trim()}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-edu-surface/80 border border-edu-border/30 text-edu-muted tracking-wide"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>

                      <p className="text-sm text-edu-muted leading-relaxed mb-4">
                        {lang === "en" && civ.descriptionEn ? civ.descriptionEn : civ.description}
                      </p>

                      {/* Planets + GDP row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {civ.planets && civ.planets.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {civ.planets.map((p) => (
                              <span
                                key={p}
                                className="text-[10px] px-2 py-1 rounded-md bg-edu-surface border border-edu-border/50 text-edu-muted flex items-center gap-1"
                              >
                                <MapPin className="w-2.5 h-2.5" />
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                        {"gdp" in civ && civ.gdp && (
                          <span className="text-[10px] text-edu-muted flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            GDP: {civ.gdp}
                          </span>
                        )}
                      </div>

                      {/* Relationships */}
                      {civ.relationships && civ.relationships.length > 0 && (
                        <div className="pt-3 border-t border-edu-border/20">
                          <p className="text-[10px] text-edu-muted mb-2 uppercase tracking-widest flex items-center gap-1.5">
                            <Handshake className="w-3 h-3" />
                            {tl("外交関係", "Diplomatic Relations", lang)}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(lang === "en" && civ.relationshipsEn
                              ? civ.relationshipsEn
                              : civ.relationships
                            ).map((r) => (
                              <span
                                key={r}
                                className={`text-[10px] px-2 py-0.5 rounded-full border ${getDiplomacyColor(r, lang)}`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>

          {/* ═══ Power Balance Visualization ═══ */}
          <RevealSection>
            <div className="edu-card rounded-2xl p-6 sm:p-8 mb-14 border border-amber-400/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-bl-full pointer-events-none" />
              <h3 className="text-sm font-bold text-edu-text mb-6 flex items-center gap-2 relative">
                <Zap className="w-4 h-4 text-amber-400" />
                {tl("宇宙勢力バランス図", "Cosmic Power Balance", lang)}
              </h3>
              <div className="space-y-4 relative">
                {TOP_CIVILIZATIONS.map((civ) => {
                  const widths: Record<number, string> = {
                    1: "w-full",
                    2: "w-[82%]",
                    3: "w-[68%]",
                    4: "w-[52%]",
                    5: "w-[40%]",
                  }
                  return (
                    <div key={civ.id} className="group">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs text-edu-muted w-24 shrink-0 truncate text-right">
                          {lang === "en" && civ.nameEn ? civ.nameEn : civ.name}
                        </span>
                        <div className="flex-1 bg-edu-surface rounded-full h-4 overflow-hidden border border-edu-border/30">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${civ.bgColor} transition-all duration-1000 ${widths[civ.rank] || "w-1/3"} relative overflow-hidden`}
                          >
                            {/* Animated shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${civ.color} w-8 text-center`}>
                          #{civ.rank}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-edu-muted mt-6">
                {lang === "ja"
                  ? "※ GDP・軍事力・技術力・外交影響力を総合した相対的な勢力指標。グランベルの宇宙GDP25%支配が他を圧倒。"
                  : "* Relative power index combining GDP, military strength, technology, and diplomatic influence. Grandel's 25% cosmic GDP share dominates all others."}
              </p>
            </div>
          </RevealSection>

          {/* ═══ Diplomatic Relations Matrix ═══ */}
          <RevealSection>
            <SectionHeader
              icon={<Handshake className="w-6 h-6 text-violet-400" />}
              title={tl("外交関係マトリクス", "Diplomatic Relations Matrix", lang)}
              subtitle={tl(
                "5大文明圏間の複雑な外交関係を可視化",
                "Visualizing the complex diplomatic web between the five great civilizations",
                lang
              )}
            />
          </RevealSection>
          <RevealSection>
            <div className="edu-card rounded-2xl p-6 mb-14 border border-violet-400/15 overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Matrix header */}
                <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-1 mb-2">
                  <div />
                  {TOP_CIVILIZATIONS.map((civ) => (
                    <div key={civ.id} className="text-center">
                      <span className={`text-[10px] font-bold ${civ.color}`}>
                        {lang === "en" && civ.nameEn
                          ? civ.nameEn.split(" ")[0]
                          : civ.name.substring(0, 4)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Matrix rows */}
                {TOP_CIVILIZATIONS.map((rowCiv) => (
                  <div key={rowCiv.id} className="grid grid-cols-[120px_repeat(5,1fr)] gap-1 mb-1">
                    <div className="flex items-center">
                      <span className={`text-[10px] font-bold ${rowCiv.color}`}>
                        {lang === "en" && rowCiv.nameEn
                          ? rowCiv.nameEn.split(" ")[0]
                          : rowCiv.name.substring(0, 4)}
                      </span>
                    </div>
                    {TOP_CIVILIZATIONS.map((colCiv) => {
                      if (rowCiv.id === colCiv.id) {
                        return (
                          <div
                            key={colCiv.id}
                            className="h-10 rounded-md bg-edu-surface/50 border border-edu-border/20 flex items-center justify-center"
                          >
                            <span className="text-[8px] text-edu-muted">—</span>
                          </div>
                        )
                      }
                      const rels =
                        lang === "en" && rowCiv.relationshipsEn
                          ? rowCiv.relationshipsEn
                          : rowCiv.relationships || []
                      const colName = (colCiv as (typeof TOP_CIVILIZATIONS)[number]).name
                      const colNameEn = (colCiv as (typeof TOP_CIVILIZATIONS)[number]).nameEn
                      const searchName = lang === "en" ? colNameEn || colName : colName
                      const rel = searchName
                        ? rels.find((r: string) => r.includes(searchName.substring(0, 4)))
                        : undefined
                      return (
                        <div
                          key={colCiv.id}
                          className={`h-10 rounded-md border flex items-center justify-center px-1 transition-all duration-300 hover:scale-105 ${
                            rel
                              ? getDiplomacyColor(rel, lang)
                              : "bg-edu-surface/50 border-edu-border/20"
                          }`}
                        >
                          {rel ? (
                            <span className="text-[8px] leading-tight text-center line-clamp-2">
                              {rel?.split("—")[0]?.trim() ?? ""}
                            </span>
                          ) : (
                            <span className="text-[8px] text-edu-muted">···</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-edu-border/20">
                {[
                  {
                    color: "bg-emerald-500/30 border-emerald-500/40",
                    label: lang === "ja" ? "協力" : "Cooperation",
                  },
                  {
                    color: "bg-amber-500/30 border-amber-500/40",
                    label: lang === "ja" ? "経済" : "Economic",
                  },
                  {
                    color: "bg-red-500/30 border-red-500/40",
                    label: lang === "ja" ? "対立" : "Conflict",
                  },
                  {
                    color: "bg-violet-500/30 border-violet-500/40",
                    label: lang === "ja" ? "調停" : "Mediation",
                  },
                  {
                    color: "bg-orange-500/30 border-orange-500/40",
                    label: lang === "ja" ? "懸念" : "Concern",
                  },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm ${l.color} border`} />
                    <span className="text-[10px] text-edu-muted">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* ═══ Hegemony Paradox Alert ═══ */}
          <RevealSection>
            <div className="edu-card rounded-2xl p-6 mb-14 border border-red-400/20 bg-gradient-to-br from-red-500/5 via-edu-card to-orange-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none" />
              <h3 className="text-sm font-bold text-red-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {tl(
                  "ヘゲモニー・パラドックス — 宇宙の最大脅威",
                  "Hegemony Paradox — The Greatest Threat to the Cosmos",
                  lang
                )}
              </h3>
              {lang === "ja" ? (
                <div className="text-sm text-edu-muted leading-relaxed space-y-2">
                  <p>
                    ディオクレニスの科学宰相ネイサン・コリンドが提起したこの概念は、
                    <span className="text-amber-400 font-medium">グランベル</span>（経済覇権）と
                    <span className="text-rose-400 font-medium">ティエリア</span>（軍事覇権）による
                    二大勢力の拮抗が、宇宙全体を不安定化させるという警告である。
                  </p>
                  <p>
                    かつて<span className="text-red-300">アポロン・Dominion大戦</span>が
                    セリアのヴェノム艦隊によってアポロン文明圏を壊滅させたように、
                    現在の均衡崩壊は全文明圏に甚大な被害をもたらす恐れがある。
                    エヴァトロンの残党勢力とグランベルの武器供与関係も、この不安定化に拍車をかけている。
                  </p>
                </div>
              ) : (
                <div className="text-sm text-edu-muted leading-relaxed space-y-2">
                  <p>
                    This concept, proposed by Dioclenis&apos;s Science Chancellor Nathan Corind,
                    warns that the standoff between{" "}
                    <span className="text-amber-400 font-medium">Grandel</span> (economic hegemony)
                    and <span className="text-rose-400 font-medium">Tyeria</span> (military
                    hegemony) threatens to destabilize the entire cosmos.
                  </p>
                  <p>
                    Just as the <span className="text-red-300">Apollo-Dominion War</span> saw
                    Celia&apos;s Venom Fleet annihilate the Apollon civilization, the collapse of
                    the current balance could bring catastrophic damage to all civilizations.
                    Evatron&apos;s remnant forces and Granbell&apos;s weapons supply relationship
                    further exacerbate this instability.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/wiki/${encodeURIComponent("ヘゲモニー・パラドックス")}`}
                  className="text-xs text-edu-accent hover:underline flex items-center gap-1"
                >
                  {tl("Wiki で詳しく", "Learn more on Wiki", lang)}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </RevealSection>

          {/* ═══ その他の文明圏 ═══ */}
          <RevealSection>
            <SectionHeader
              icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
              title={tl("その他の文明圏", "Other Civilizations", lang)}
              subtitle={tl(
                "宇宙ランキング第6位〜第8位 — 潜在的な大国",
                "Cosmic Rankings #6–#8 — Potential future powers",
                lang
              )}
            />
          </RevealSection>
          <RevealSection>
            <div className="space-y-4 mb-14">
              {OTHER_CIVILIZATIONS.map((civ) => (
                <Link
                  key={civ.id}
                  href={civ.href}
                  className={`group block edu-card rounded-xl border ${civ.borderColor} bg-gradient-to-br ${civ.bgColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.005]`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-0">
                    <div
                      className={`flex items-center justify-center p-5 ${civ.color} sm:min-w-[80px]`}
                    >
                      <div className="text-center">
                        <span className="text-2xl font-black opacity-30">#{civ.rank}</span>
                        <div className="mt-1 hidden sm:block">
                          {ICON_MAP[civ.icon] || <Globe2 className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-sm font-bold ${civ.color}`}>
                          {lang === "en" && civ.nameEn ? civ.nameEn : civ.name}
                          {lang !== "en" && civ.nameEn && (
                            <span className="text-xs font-normal text-edu-muted ml-2">
                              {civ.nameEn}
                            </span>
                          )}
                        </h3>
                        <ExternalLink
                          className={`w-3 h-3 ${civ.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {(lang === "en" && civ.specializationEn
                          ? civ.specializationEn
                          : civ.specialization
                        )
                          .split("·")
                          .map((s) => (
                            <span
                              key={s.trim()}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-edu-surface border border-edu-border/30 text-edu-muted"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>

                      <p className="text-xs text-edu-muted leading-relaxed mb-2">
                        {lang === "en" && civ.descriptionEn ? civ.descriptionEn : civ.description}
                      </p>

                      {civ.planets && civ.planets.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {civ.planets.map((p) => (
                            <span
                              key={p}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-edu-surface border border-edu-border/50 text-edu-muted"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {civ.wikiId && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-edu-accent group-hover:underline">
                          {tl("Wiki →", "Wiki →", lang)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>

          {/* ═══ 歴史的文明圏 ═══ */}
          <RevealSection>
            <SectionHeader
              icon={<Swords className="w-6 h-6 text-red-400" />}
              title={tl("歴史的文明圏", "Historical Civilizations", lang)}
              subtitle={tl(
                "アポロン大戦で消滅・変容した文明圏 — 宇宙史の教訓",
                "Civilizations destroyed or transformed in the Apollon War — Lessons of cosmic history",
                lang
              )}
            />
          </RevealSection>
          <RevealSection>
            <div className="space-y-5 mb-14">
              {HISTORICAL_CIVILIZATIONS.map((civ) => (
                <div
                  key={civ.id}
                  className={`edu-card rounded-xl border ${civ.borderColor} overflow-hidden transition-all duration-300 relative`}
                >
                  {/* Red banner top */}
                  <div className="h-1 bg-gradient-to-r from-red-500/50 via-red-400/30 to-transparent" />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        {ICON_MAP[civ.icon] || <Skull className="w-5 h-5 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                            {tl("歴史的", "Historical", lang)}
                          </span>
                          {civ.rank > 0 && (
                            <span className="text-[10px] text-edu-muted">
                              {lang === "en"
                                ? `Currently ranked #${civ.rank}`
                                : `現在ランク第${civ.rank}位`}
                            </span>
                          )}
                        </div>
                        <h3 className={`text-sm font-bold ${civ.color}`}>
                          {lang === "en" && civ.nameEn ? civ.nameEn : civ.name}
                        </h3>
                        <p className="text-[10px] text-edu-muted mt-0.5">
                          {lang === "en" ? "Leader" : "指導者"}: {civ.leader}
                          {"capital" in civ && civ.capital && (
                            <>
                              {" · "}
                              {lang === "en" ? "Capital" : "首都"}: {civ.capital}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-edu-muted leading-relaxed mb-3">
                      {lang === "en" && civ.descriptionEn ? civ.descriptionEn : civ.description}
                    </p>

                    {civ.history && (
                      <div className="bg-edu-bg/50 rounded-lg p-3 mb-3 border border-edu-border/20">
                        <p className="text-[10px] text-edu-muted mb-1 uppercase tracking-widest">
                          {tl("歴史", "History", lang)}
                        </p>
                        <p className="text-xs text-edu-muted leading-relaxed">
                          {lang === "en" && civ.historyEn ? civ.historyEn : civ.history}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {"gdp" in civ && civ.gdp && (
                        <span className="text-[10px] text-edu-muted flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-red-400" />
                          GDP: {civ.gdp}
                        </span>
                      )}
                      {civ.currentStatus && (
                        <span className="text-[10px] text-red-300">
                          {lang === "en" && civ.currentStatusEn
                            ? civ.currentStatusEn
                            : civ.currentStatus}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-edu-border/20 flex items-center gap-3">
                      <Link
                        href={`/wiki/${encodeURIComponent(civ.wikiId)}`}
                        className="inline-flex items-center gap-1 text-[10px] text-edu-accent hover:underline"
                      >
                        {tl("Wiki で詳しく見る", "Learn more on Wiki", lang)}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      {civ.relationships && (
                        <div className="flex flex-wrap gap-2">
                          {(lang === "en" && civ.relationshipsEn
                            ? civ.relationshipsEn
                            : civ.relationships
                          ).map((r) => (
                            <span key={r} className="text-[9px] text-edu-muted">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* ═══ Cosmic Timeline ═══ */}
          <RevealSection>
            <div className="edu-card rounded-2xl p-6 sm:p-8 mb-14 border border-edu-border/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-br-full pointer-events-none" />
              <h3 className="text-sm font-bold text-edu-text mb-6 flex items-center gap-2 relative">
                <Star className="w-4 h-4 text-amber-400" />
                {tl("宇宙史における文明圏の興亡", "Rise and Fall of Civilizations", lang)}
              </h3>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/50 via-emerald-400/30 via-red-400/40 via-amber-400/30 to-cyan-400/40" />
                {[
                  {
                    era: lang === "ja" ? "E270頃" : "c. E270",
                    title: lang === "ja" ? "AURALIS Proto 設立" : "AURALIS Proto Founded",
                    desc:
                      lang === "ja"
                        ? "Diana時代の前身組織としてAURALISの基礎が築かれる"
                        : "Foundation of AURALIS as a precursor organization during the Diana era",
                    color: "bg-amber-400",
                  },
                  {
                    era: "E290",
                    title: lang === "ja" ? "AURALIS 正式組織化" : "AURALIS Formally Organized",
                    desc:
                      lang === "ja"
                        ? "Kate ClaudiaとLily Steinerが正式にAURALIS Collectiveを設立"
                        : "Kate Claudia and Lily Steiner formally establish AURALIS Collective",
                    color: "bg-amber-400",
                  },
                  {
                    era: lang === "ja" ? "E335〜E370" : "E335–E370",
                    title: lang === "ja" ? "セリア黄金期" : "Celia Golden Age",
                    desc:
                      lang === "ja"
                        ? "セリア・ドミニクスのSelinopolisが最盛期。AURALISも頂点に達する"
                        : "Celia Dominicus's Selinopolis reaches its peak. AURALIS also reaches its zenith",
                    color: "bg-emerald-400",
                  },
                  {
                    era: lang === "ja" ? "E380〜E400" : "E380–E400",
                    title: lang === "ja" ? "アポロン・Dominion大戦" : "Apollo-Dominion War",
                    desc:
                      lang === "ja"
                        ? "アポロン文明圏とDominionの全面戦争。セリアのヴェノム艦隊がアポロンを壊滅させる"
                        : "Total war between Apollon Civilization and Dominion. Celia's Venom Fleet annihilates Apollon",
                    color: "bg-red-400",
                  },
                  {
                    era: "E400",
                    title: lang === "ja" ? "エヴァトロン弾圧" : "Evatron Suppression",
                    desc:
                      lang === "ja"
                        ? "エヴァトロンがDominionを買収・吸収。AURALIS解体、創設者逮捕"
                        : "Evatron acquires and absorbs Dominion. AURALIS dismantled, founders arrested",
                    color: "bg-red-400",
                  },
                  {
                    era: lang === "ja" ? "E400〜E522" : "E400–E522",
                    title: lang === "ja" ? "グランベル台頭期" : "Grandel Rise Period",
                    desc:
                      lang === "ja"
                        ? "アポロン大戦を傍観したグランベルが戦後の混乱期に急浮上"
                        : "Grandel, having observed the war from the sidelines, rapidly ascends during post-war chaos",
                    color: "bg-amber-400",
                  },
                  {
                    era: "E522",
                    title: lang === "ja" ? "AURALIS第二世代発足" : "AURALIS 2nd Generation",
                    desc:
                      lang === "ja"
                        ? "Kate Patton, Lillie Ardent, Layla Virell Nova, Mina, Ninnyの5人で第二世代が正式発足"
                        : "Five members — Kate Patton, Lillie Ardent, Layla Virell Nova, Mina, Ninny — officially launch the 2nd generation",
                    color: "bg-edu-accent2",
                  },
                  {
                    era: "E528",
                    title: lang === "ja" ? "第一回宇宙連合会合" : "1st Cosmic Assembly",
                    desc:
                      lang === "ja"
                        ? "オルダシティに全文明圏の指導者が集結。ヘゲモニー・パラドックスが提起される"
                        : "Leaders of all civilizations convene in Aldacity. The Hegemony Paradox is raised",
                    color: "bg-cyan-400",
                  },
                ].map((ev) => (
                  <div key={ev.era + ev.title} className="relative">
                    <div
                      className={`absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full ${ev.color} border-2 border-edu-bg shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                    />
                    <p className="text-[10px] text-edu-accent font-medium mb-0.5">{ev.era}</p>
                    <p className="text-xs font-bold text-edu-text mb-1">{ev.title}</p>
                    <p className="text-[11px] text-edu-muted leading-relaxed">{ev.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* ═══ 関連リンク ═══ */}
          <RevealSection>
            <div className="edu-card rounded-xl p-6">
              <h3 className="text-sm font-bold text-edu-text mb-4">
                {tl("関連ページ", "Related Pages", lang)}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/wiki/${encodeURIComponent("ヘゲモニー・パラドックス")}`}
                  className="text-xs text-edu-accent hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {lang === "ja" ? "ヘゲモニー・パラドックス" : "Hegemony Paradox"}
                </Link>
                <Link
                  href={`/wiki/${encodeURIComponent("宇宙連合会合")}`}
                  className="text-xs text-edu-accent hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {lang === "ja" ? "宇宙連合会合" : "Cosmic Assembly"}
                </Link>
                <Link
                  href={`/wiki/${encodeURIComponent("アポロン・Dominion大戦")}`}
                  className="text-xs text-edu-accent hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {lang === "ja" ? "アポロン・Dominion大戦" : "Apollo-Dominion War"}
                </Link>
                <Link
                  href={`/wiki/${encodeURIComponent("セリア・ドミニクス")}`}
                  className="text-xs text-edu-accent hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {lang === "ja" ? "セリア・ドミニクス" : "Celia Dominicus"}
                </Link>
                <Link
                  href="/ranking"
                  className="text-xs text-emerald-400 hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {tl("長者番付", "Wealth Rankings", lang)}
                </Link>
                <Link
                  href="/card-game"
                  className="text-xs text-orange-400 hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  Card Game
                </Link>
                <Link
                  href="/timeline"
                  className="text-xs text-cyan-400 hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {tl("年表", "Timeline", lang)}
                </Link>
                <Link
                  href="/factions"
                  className="text-xs text-rose-400 hover:underline bg-edu-surface px-3 py-1.5 rounded-lg border border-edu-border/50"
                >
                  {tl("勢力", "Factions", lang)}
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </main>

      <footer className="relative border-t border-edu-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-accent transition-colors">
            {tl("← トップページに戻る", "← Back to Home", lang)}
          </Link>
        </div>
      </footer>

      {/* Global shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
