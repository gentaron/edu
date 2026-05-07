"use client"

import Link from "next/link"
import { Swords, Users, Globe2 } from "lucide-react"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"
import { FACTION_TREES } from "@/lib/faction-data"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"
import { LangToggle } from "@/platform/lang-toggle"

function FactionNode({
  node,
  color,
  dotColor,
  isLast,
  lang,
}: {
  node: (typeof FACTION_TREES)[0]["nodes"][0]
  color: string
  dotColor: string
  isLast: boolean
  lang: Lang
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0`} />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[24px] ${color.replace("border-", "bg-")} opacity-30`}
          />
        )}
      </div>
      <div className="pb-4">
        <span className="text-xs text-edu-muted">{node.year}</span>
        <p className={`text-sm font-medium ${color.replace("border-", "text-")}`}>
          {lang === "en" && "nameEn" in node && node.nameEn
            ? (node as { nameEn: string }).nameEn
            : node.name}
        </p>
        {node.children && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(lang === "en" && "childrenEn" in node && (node as { childrenEn: string[] }).childrenEn
              ? (node as { childrenEn: string[] }).childrenEn
              : node.children
            ).map((child) => (
              <span
                key={child}
                className="text-xs bg-edu-surface px-2 py-0.5 rounded text-edu-muted"
              >
                {child}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FactionsPage() {
  const { lang, setLang } = useLang()

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Swords className="w-6 h-6 text-red-400" />}
        title={tl("勢力系譜", "Faction Lineage", lang)}
        subtitle={tl(
          "全宇宙の主要勢力の系統図 — E16・Eros-7・銀河規模組織",
          "Lineage diagrams of major cosmic factions — E16 · Eros-7 · Galactic Organizations",
          lang
        )}
        wikiHref={`/wiki/${encodeURIComponent("テクロサス")}`}
        extra={<LangToggle lang={lang} setLang={setLang} />}
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />{" "}
              {tl("勢力系譜とは", "About Faction Lineage", lang)}
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              {lang === "ja" ? (
                <>
                  <p>
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      E16連星系
                    </Link>
                    の政治地图は、多数の国家・組織・勢力が複雑に絡み合う多極的な構造を持つ。
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      テクロサス帝国
                    </Link>
                    を始祖とする勢力系統は、古代からの血脈を受け継ぎながらも、分裂・統合・再編を繰り返してきた。各勢力は独自のイデオロギーと目的を持ち、時には同盟を結び、時には激しい対立を繰り広げている。
                  </p>
                  <p>
                    現代のE16星系は、大きく三つの陣営に分かれている。
                    <Link
                      href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      トリニティ・アライアンス
                    </Link>
                    （
                    <Link
                      href={`/wiki/${encodeURIComponent("アイリス")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      アイリス
                    </Link>
                    指導）は
                    <Link
                      href={`/wiki/${encodeURIComponent("ヴァーミリオン")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      ヴァーミリオン
                    </Link>
                    ・
                    <Link
                      href={`/wiki/${encodeURIComponent("ミエルテンガ")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      ミエルテンガ
                    </Link>
                    ・
                    <Link
                      href={`/wiki/${encodeURIComponent("ボグダス・ジャベリン")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      ボグダス・ジャベリン
                    </Link>
                    の3勢力連合であり、星系の安定を図る最大の勢力である。
                    <Link
                      href={`/wiki/${encodeURIComponent("V7")}`}
                      className="text-blue-400 font-medium hover:underline"
                    >
                      V7（Vital Seven）
                    </Link>
                    は
                    <Link
                      href={`/wiki/${encodeURIComponent("フィオナ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      フィオナ
                    </Link>
                    が急先鋒の7カ国連合で、
                    <Link
                      href={`/wiki/${encodeURIComponent("ブルーローズ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      ブルーローズ
                    </Link>
                    や
                    <Link
                      href={`/wiki/${encodeURIComponent("SSレンジ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      SSレンジ
                    </Link>
                    、
                    <Link
                      href={`/wiki/${encodeURIComponent("アイアン・シンジケート")}`}
                      className="text-blue-400 hover:underline"
                    >
                      アイアン・シンジケート
                    </Link>
                    などが参加している。そして
                    <Link
                      href={`/wiki/${encodeURIComponent("アルファ・ヴェノム")}`}
                      className="text-red-400 font-medium hover:underline"
                    >
                      アルファ・ヴェノム
                    </Link>
                    は
                    <Link
                      href={`/wiki/${encodeURIComponent("イズミ")}`}
                      className="text-red-400 hover:underline"
                    >
                      イズミ
                    </Link>
                    率いる暗黒組織であり、
                    <Link
                      href={`/wiki/${encodeURIComponent("シルバー・ヴェノム")}`}
                      className="text-red-400 hover:underline"
                    >
                      シルバー・ヴェノム
                    </Link>
                    の後継として星系の秩序を脅かす存在である。
                  </p>
                  <p>
                    さらにE16の枠を超え、
                    <Link
                      href={`/wiki/${encodeURIComponent("Eros-7")}`}
                      className="text-pink-400 font-medium hover:underline"
                    >
                      Eros-7
                    </Link>
                    では
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・カウンシル")}`}
                      className="text-pink-400 hover:underline"
                    >
                      マトリカル・カウンシル
                    </Link>
                    と
                    <Link
                      href={`/wiki/${encodeURIComponent("シャドウ・ユニオン")}`}
                      className="text-pink-400 hover:underline"
                    >
                      シャドウ・ユニオン
                    </Link>
                    が独自の社会制度を巡って対立し、銀河規模では
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      銀河系コンソーシアム
                    </Link>
                    が
                    <Link
                      href={`/wiki/${encodeURIComponent("バーズ帝国")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      バーズ帝国
                    </Link>
                    から
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      テクロサス
                    </Link>
                    を経て続く壮大な統合の歴史の到達点として機能している。以下の系統図は、E16・Eros-7・銀河全域にわたる各勢力の歴史的変遷を視覚的に整理したものである。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    The political landscape of the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      E16 binary system
                    </Link>{" "}
                    has a multipolar structure where numerous nations, organizations, and powers
                    intricately intertwine. The power lineage originating from the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      Tekrosas Empire
                    </Link>
                    , while inheriting ancient bloodlines, has undergone repeated splits, mergers,
                    and reorganizations. Each faction possesses its own ideology and objectives,
                    sometimes forging alliances and sometimes engaging in fierce confrontations.
                  </p>
                  <p>
                    The modern E16 system is broadly divided into three camps. The{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      Trinity Alliance
                    </Link>{" "}
                    (led by{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("アイリス")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Iris
                    </Link>
                    ) is a three-faction coalition of{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ヴァーミリオン")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Vermillion
                    </Link>
                    ,{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ミエルテンガ")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Mieltenga
                    </Link>
                    , and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ボグダス・ジャベリン")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Bogdas Javelin
                    </Link>
                    , serving as the largest force maintaining system stability.{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("V7")}`}
                      className="text-blue-400 font-medium hover:underline"
                    >
                      V7 (Vital Seven)
                    </Link>{" "}
                    is a seven-nation coalition spearheaded by{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("フィオナ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      Fiona
                    </Link>
                    , with{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ブルーローズ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      Blue Rose
                    </Link>
                    ,{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("SSレンジ")}`}
                      className="text-blue-400 hover:underline"
                    >
                      SS Range
                    </Link>
                    ,{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("アイアン・シンジケート")}`}
                      className="text-blue-400 hover:underline"
                    >
                      Iron Syndicate
                    </Link>
                    , and others participating. And{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("アルファ・ヴェノム")}`}
                      className="text-red-400 font-medium hover:underline"
                    >
                      Alpha Venom
                    </Link>
                    , led by{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("イズミ")}`}
                      className="text-red-400 hover:underline"
                    >
                      Izumi
                    </Link>
                    , is a dark organization that, as the successor to{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("シルバー・ヴェノム")}`}
                      className="text-red-400 hover:underline"
                    >
                      Silver Venom
                    </Link>
                    , threatens the order of the star system.
                  </p>
                  <p>
                    Beyond the E16 framework, in{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("Eros-7")}`}
                      className="text-pink-400 font-medium hover:underline"
                    >
                      Eros-7
                    </Link>
                    , the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・カウンシル")}`}
                      className="text-pink-400 hover:underline"
                    >
                      Matriarchal Council
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("シャドウ・ユニオン")}`}
                      className="text-pink-400 hover:underline"
                    >
                      Shadow Union
                    </Link>{" "}
                    are locked in conflict over their unique social system. On the galactic scale,
                    the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      Galactic Consortium
                    </Link>{" "}
                    functions as the culmination of a grand unification history stretching from the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("バーズ帝国")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Birds Empire
                    </Link>{" "}
                    through{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="text-cyan-400 hover:underline"
                    >
                      Tekrosas
                    </Link>
                    . The following lineage diagrams visually organize the historical evolution of
                    each faction spanning E16, Eros-7, and the entire galaxy.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACTION_TREES.map((tree) => (
              <div
                key={tree.name}
                className="edu-card rounded-xl p-4 sm:p-6 transition-all duration-300"
              >
                <h3
                  className={`text-sm sm:text-base font-bold ${tree.textColor} mb-4 flex items-center gap-2`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${tree.dotColor}`} />
                  {lang === "en" && tree.nameEn ? tree.nameEn : tree.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-edu-muted leading-relaxed mb-4">
                  {lang === "en" && tree.descriptionEn ? tree.descriptionEn : tree.description}
                </p>
                <div className="mb-4">
                  <p className="text-[10px] sm:text-[11px] font-bold text-edu-text mb-2 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-edu-accent2" />{" "}
                    {tl("主要メンバー", "Key Members", lang)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(lang === "en" && tree.keyMembersEn ? tree.keyMembersEn : tree.keyMembers).map(
                      (m) => (
                        <span
                          key={m}
                          className="text-[10px] px-2 py-0.5 rounded bg-edu-surface/50 border border-edu-border/30 text-edu-text"
                        >
                          {m}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <p className="text-[10px] sm:text-[11px] font-bold text-edu-text mb-1.5 flex items-center gap-1.5">
                    <Globe2 className="w-3 h-3 text-edu-accent2" />{" "}
                    {tl("同盟・関係", "Alliances & Relations", lang)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-edu-muted leading-relaxed">
                    {lang === "en" && tree.alliancesEn ? tree.alliancesEn : tree.alliances}
                  </p>
                </div>
                <div className="border-t border-edu-border/30 pt-4">
                  {tree.nodes.map((node, idx) => (
                    <FactionNode
                      key={idx}
                      node={node}
                      color={tree.color}
                      dotColor={tree.dotColor}
                      isLast={idx === tree.nodes.length - 1}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

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
