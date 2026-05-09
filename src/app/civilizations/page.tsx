"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Crown,
  Heart,
  Shield,
  Scale,
  Telescope,
  Sparkles,
  Package,
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
  Package: <Package className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Skull: <Skull className="w-6 h-6" />,
  Swords: <Swords className="w-6 h-6" />,
}

/* Hero stat badges for the overview */
const COSMIC_STATS = [
  {
    icon: <Globe2 className="w-4 h-4 text-amber-400" />,
    label: { ja: "宇宙文明圏総数", en: "Total Civilizations" },
    value: "8+",
  },
  {
    icon: <Crown className="w-4 h-4 text-amber-400" />,
    label: { ja: "5大文明圏GDP合計", en: "Combined Top 5 GDP" },
    value: "400京+",
  },
  {
    icon: <Users className="w-4 h-4 text-amber-400" />,
    label: { ja: "宇宙連合会合", en: "Cosmic Assembly" },
    value: "E528",
  },
  {
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    label: { ja: "主要紛争", en: "Major Conflicts" },
    value: "3",
  },
]

export default function CivilizationsPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Globe2 className="w-6 h-6 text-amber-400" />}
        title={tl("宇宙5大文明圏", "Five Great Cosmic Civilizations", lang)}
        subtitle={tl(
          "グランベル・エレシオン・ティエリア・ファルージャ・ディオクレニス — 宇宙勢力の全貌",
          "Grandel · Elyseon · Tyeria · Fallujah · Dioclenis — Overview of Cosmic Powers",
          lang
        )}
        wikiHref={`/wiki/${encodeURIComponent("グランベル")}`}
      />

      <main className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* ═══ Cosmic Stats Banner ═══ */}
          <RevealSection>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {COSMIC_STATS.map((s) => (
                <div
                  key={s.value}
                  className="edu-card rounded-xl p-4 text-center border border-amber-400/10 bg-gradient-to-b from-amber-500/5 to-transparent"
                >
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <p className="text-xl font-black text-amber-400 mb-0.5">{s.value}</p>
                  <p className="text-[10px] text-edu-muted tracking-wide">
                    {lang === "ja" ? s.label.ja : s.label.en}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* ═══ Overview Narrative ═══ */}
          <RevealSection>
            <div className="edu-card rounded-xl p-6 sm:p-8 mb-10 border border-edu-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="relative">
                <h2 className="text-sm font-bold text-edu-text mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  {tl("宇宙情勢概観", "Cosmic Overview", lang)}
                </h2>
                {lang === "ja" ? (
                  <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
                    <p>
                      宇宙には多様な文明圏が存在し、それぞれが独自の技術・文化・政治体制で繁栄している。
                      中でも<span className="text-amber-400 font-medium">グランベル</span>
                      を頂点とする5大文明圏は、宇宙の政治・経済・軍事の均衡を左右する重要な勢力である。
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
                      the cosmos.
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
                "宇宙を左右する5つの主要勢力",
                "The five major forces shaping the cosmos",
                lang
              )}
            />
          </RevealSection>
          <RevealSection>
            <div className="space-y-6 mb-14">
              {TOP_CIVILIZATIONS.map((civ, idx) => (
                <Link
                  key={civ.id}
                  href={civ.href}
                  className={`group block edu-card rounded-xl border ${civ.borderColor} bg-gradient-to-br ${civ.bgColor} overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.005]`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-0">
                    {/* Left: Rank badge + icon */}
                    <div
                      className={`flex lg:flex-col items-center justify-center gap-3 p-6 lg:px-8 ${civ.color}`}
                    >
                      <span className="text-4xl font-black opacity-30">#{civ.rank}</span>
                      <div className="hidden lg:block">
                        {ICON_MAP[civ.icon] || <Globe2 className="w-8 h-8" />}
                      </div>
                      <div className="lg:hidden">
                        {ICON_MAP[civ.icon] || <Globe2 className="w-6 h-6" />}
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="p-6 lg:py-6 lg:pr-8 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-edu-text mb-0.5">
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
                            <MapPin className="w-3 h-3" />
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
                          className={`w-4 h-4 ${civ.color} opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1`}
                        />
                      </div>

                      {/* Specialization badge */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(lang === "en" && civ.specializationEn
                          ? civ.specializationEn
                          : civ.specialization
                        )
                          .split("·")
                          .map((s) => (
                            <span
                              key={s.trim()}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-edu-surface/80 border border-edu-border/30 text-edu-muted"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>

                      <p className="text-xs text-edu-muted leading-relaxed mb-3">
                        {lang === "en" && civ.descriptionEn ? civ.descriptionEn : civ.description}
                      </p>

                      {/* Planets + GDP row */}
                      <div className="flex flex-wrap items-center gap-3">
                        {civ.planets && civ.planets.length > 0 && (
                          <div className="flex flex-wrap gap-1">
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
                        {"gdp" in civ && civ.gdp && (
                          <span className="text-[9px] text-edu-muted flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            GDP: {civ.gdp}
                          </span>
                        )}
                      </div>

                      {/* Relationships */}
                      {civ.relationships && civ.relationships.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-edu-border/20">
                          <p className="text-[10px] text-edu-muted mb-1.5 uppercase tracking-widest">
                            {tl("関係", "Relations", lang)}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {(lang === "en" && civ.relationshipsEn
                              ? civ.relationshipsEn
                              : civ.relationships
                            ).map((r) => (
                              <span key={r} className="text-[10px] text-edu-muted">
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>

          {/* ═══ Power Balance Visualization ═══ */}
          <RevealSection>
            <div className="edu-card rounded-xl p-6 mb-14 border border-edu-border/30">
              <h3 className="text-sm font-bold text-edu-text mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                {tl("勢力バランス図", "Power Balance", lang)}
              </h3>
              <div className="space-y-3">
                {TOP_CIVILIZATIONS.map((civ) => {
                  const widths: Record<number, string> = {
                    1: "w-full",
                    2: "w-[82%]",
                    3: "w-[68%]",
                    4: "w-[52%]",
                    5: "w-[40%]",
                  }
                  return (
                    <div key={civ.id} className="flex items-center gap-3">
                      <span className="text-xs text-edu-muted w-20 shrink-0 truncate text-right">
                        {lang === "en" && civ.nameEn ? civ.nameEn : civ.name}
                      </span>
                      <div className="flex-1 bg-edu-surface rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${civ.bgColor.replace("from-", "from-").replace("/20 via-", "/40 via-").replace("/10 to-", "/20 to-")} transition-all duration-1000 ${widths[civ.rank] || "w-1/3"}`}
                        />
                      </div>
                      <span className={`text-xs font-bold ${civ.color} w-6 text-center`}>
                        #{civ.rank}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-edu-muted mt-4">
                {lang === "ja"
                  ? "※ GDP・軍事力・技術力・外交影響力を総合した相対的な勢力指標"
                  : "* Relative power index combining GDP, military strength, technology, and diplomatic influence"}
              </p>
            </div>
          </RevealSection>

          {/* ═══ その他の文明圏 ═══ */}
          <RevealSection>
            <SectionHeader
              icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
              title={tl("その他の文明圏", "Other Civilizations", lang)}
              subtitle={tl("宇宙ランキング第6位〜第8位", "Cosmic Rankings #6–#8", lang)}
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
                "アポロン大戦で消滅・変容した文明圏",
                "Civilizations destroyed or transformed in the Apollon War",
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
            <div className="edu-card rounded-xl p-6 mb-14 border border-edu-border/30">
              <h3 className="text-sm font-bold text-edu-text mb-5 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                {tl("宇宙史における文明圏の興亡", "Rise and Fall of Civilizations", lang)}
              </h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/40 via-red-400/30 to-edu-border" />
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
                      className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full ${ev.color} border-2 border-edu-bg`}
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
    </div>
  )
}
