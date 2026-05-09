"use client"

import Link from "next/link"
import { Globe2, Star, Users, Zap } from "lucide-react"
import { type Lang, tl } from "@/lib/lang"
import { useLang } from "@/lib/use-lang"
import { RevealSection, SectionHeader } from "@/platform/reveal-section"
import { PageHeader } from "@/platform/page-header"

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
  lang,
}: {
  icon: React.ReactNode
  title: string
  titleEn: string
  color: string
  borderColor: string
  wikiHref: string
  stats: [string, React.ReactNode][]
  description: React.ReactNode
  regions?: { name: string; nameEn?: string; wiki: string | null }[][]
  lang: Lang
}) {
  return (
    <div className={`edu-card rounded-xl p-6 transition-all duration-300 border ${borderColor}`}>
      <h3 className={`text-lg font-bold ${color} mb-4 flex items-center gap-2`}>
        {icon}{" "}
        <Link href={wikiHref} className={`${color} hover:underline`}>
          {lang === "en" ? titleEn : title}
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
      {description && <p className="mt-4 text-xs text-edu-muted leading-relaxed">{description}</p>}
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
                      {lang === "en" && r.nameEn ? r.nameEn : r.name}
                    </Link>
                  ) : lang === "en" && r.nameEn ? (
                    r.nameEn
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
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-edu-bg">
      <PageHeader
        icon={<Globe2 className="w-6 h-6 text-edu-accent2" />}
        title={tl("全宇宙・星系構造", "Complete Cosmic & Stellar Structure", lang)}
        subtitle={
          lang === "en"
            ? "Entire M104 Galaxy — E16 Binary System · Eros-7 · Planet Bibliotheca · Planet Solaris"
            : "M104銀河全域 — E16連星系・Eros-7・惑星ビブリオ・惑星Solaris"
        }
        wikiHref={`/wiki/${encodeURIComponent("E16連星系")}`}
      />

      <RevealSection>
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* 概説 */}
          <div className="edu-card rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-edu-text mb-4 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-edu-accent2" />{" "}
              {tl(
                "Eternal Dominion Universe — 全宇宙像",
                "Eternal Dominion Universe — Complete Cosmic Overview",
                lang
              )}
            </h2>
            <div className="space-y-3 text-sm text-edu-muted leading-relaxed">
              <p>
                {lang === "en" ? (
                  <>
                    The{" "}
                    <span className="text-edu-accent2 font-medium">Eternal Dominion Universe</span>{" "}
                    is a grand civilization set in the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("M104銀河")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      M104 (NGC 4594) Galaxy
                    </Link>
                    . Having departed Earth in AD 3500, humanity reached the halo region of the M104
                    Galaxy and built their civilization with the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      E16 Binary Star System
                    </Link>{" "}
                    as their first home. However, human activity did not stop at E16, expanding
                    outward to surrounding planets and star systems.
                  </>
                ) : (
                  <>
                    <span className="text-edu-accent2 font-medium">Eternal Dominion Universe</span>
                    は、
                    <Link
                      href={`/wiki/${encodeURIComponent("M104銀河")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      M104（NGC 4594）銀河
                    </Link>
                    を舞台とする壮大な文明圏である。AD
                    3500年に地球を離脱した人類は、M104銀河のハロー領域に到達し、
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      E16連星系
                    </Link>
                    を第一の故郷として文明を築き上げた。しかし、人類の活動はE16に留まらず、周辺の惑星や星系へと拡大していった。
                  </>
                )}
              </p>
              <p>
                {lang === "en" ? (
                  <>
                    Today, the M104 Galaxy contains multiple inhabited worlds beyond the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      E16 Binary Star System
                    </Link>
                    , including{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("Eros-7")}`}
                      className="text-pink-400 font-medium hover:underline"
                    >
                      Eros-7
                    </Link>{" "}
                    with its female-led matrical society,{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("惑星ビブリオ")}`}
                      className="text-emerald-400 font-medium hover:underline"
                    >
                      Planet Bibliotheca
                    </Link>{" "}
                    — the center of academia and research — and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("惑星Solaris")}`}
                      className="text-orange-400 font-medium hover:underline"
                    >
                      Planet Solaris
                    </Link>
                    . Each planet maintains its own political system, culture, and history, while
                    being loosely connected through the Interstellar Economic Cooperative{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("UECO")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      UECO
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      Galactic Consortium
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    現在、M104銀河内には
                    <Link
                      href={`/wiki/${encodeURIComponent("E16連星系")}`}
                      className="text-edu-accent2 font-medium hover:underline"
                    >
                      E16連星系
                    </Link>
                    のほかに、女性主導のマトリカル社会を持つ
                    <Link
                      href={`/wiki/${encodeURIComponent("Eros-7")}`}
                      className="text-pink-400 font-medium hover:underline"
                    >
                      Eros-7
                    </Link>
                    、学術・研究の中心地である
                    <Link
                      href={`/wiki/${encodeURIComponent("惑星ビブリオ")}`}
                      className="text-emerald-400 font-medium hover:underline"
                    >
                      惑星ビブリオ
                    </Link>
                    、そして
                    <Link
                      href={`/wiki/${encodeURIComponent("惑星Solaris")}`}
                      className="text-orange-400 font-medium hover:underline"
                    >
                      惑星Solaris
                    </Link>
                    など、複数の居住世界が存在する。それぞれの惑星は独自の政治体制・文化・歴史を持ちながらも、星間経済協同組合
                    <Link
                      href={`/wiki/${encodeURIComponent("UECO")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      UECO
                    </Link>
                    や
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="text-cyan-400 font-medium hover:underline"
                    >
                      銀河系コンソーシアム
                    </Link>
                    を通じて緩やかに結合されている。
                  </>
                )}
              </p>
              <p>
                {lang === "en" ? (
                  <>
                    Politics in this universe are multipolar. Within E16, the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Trinity Alliance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("V7")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      V7
                    </Link>{" "}
                    vie for hegemony over the Eastern and Western Continents, while on Eros-7, the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・カウンシル")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Matrical Council
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("シャドウ・ユニオン")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Shadow Union
                    </Link>{" "}
                    clash over the social system. On a galactic scale, a grand political
                    transformation spans from the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("バーズ帝国")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Birds Empire
                    </Link>{" "}
                    through{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Tekrosas
                    </Link>{" "}
                    to the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      Galactic Consortium
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    この宇宙の政治は多極的であり、E16内では
                    <Link
                      href={`/wiki/${encodeURIComponent("トリニティ・アライアンス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      トリニティ・アライアンス
                    </Link>
                    と
                    <Link
                      href={`/wiki/${encodeURIComponent("V7")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      V7
                    </Link>
                    が東西大陸の覇権を争い、Eros-7では
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・カウンシル")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      マトリカル・カウンシル
                    </Link>
                    と
                    <Link
                      href={`/wiki/${encodeURIComponent("シャドウ・ユニオン")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      シャドウ・ユニオン
                    </Link>
                    が社会制度を巡って対立している。さらに銀河規模では、
                    <Link
                      href={`/wiki/${encodeURIComponent("バーズ帝国")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      バーズ帝国
                    </Link>
                    から
                    <Link
                      href={`/wiki/${encodeURIComponent("テクロサス")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      テクロサス
                    </Link>
                    を経て
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="hover:text-edu-accent2 hover:underline"
                    >
                      銀河系コンソーシアム
                    </Link>
                    に至る壮大な政治変遷の歴史が刻まれている。
                  </>
                )}
              </p>
            </div>
          </div>

          {/* 宇宙マップ概略 */}
          <div className="edu-card rounded-xl p-6 mb-8 border border-cyan-500/20">
            <h3 className="text-base font-bold text-edu-text mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              {tl("銀河規模組織", "Galactic-scale Organizations", lang)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <Link
                    href={`/wiki/${encodeURIComponent("UECO")}`}
                    className="text-cyan-400 hover:underline"
                  >
                    UECO
                  </Link>
                </h4>
                <p className="text-xs text-edu-muted leading-relaxed">
                  {lang === "en"
                    ? "Interstellar Economic Cooperative. Coordinates economic activities between planets and oversees currency and trade regulations. Integrated with the Hero Agency, it became the core of the Galactic Consortium."
                    : "星間経済協同組合。各惑星間の経済活動を調整し、通貨・貿易のルールを統轄する。ヒーローエージェンシーと統合され、銀河系コンソーシアムの中核となった。"}
                </p>
              </div>
              <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <Link
                    href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                    className="text-cyan-400 hover:underline"
                  >
                    {lang === "en" ? "Galactic Consortium" : "銀河系コンソーシアム"}
                  </Link>
                </h4>
                <p className="text-xs text-edu-muted leading-relaxed">
                  {lang === "en"
                    ? "A unified body established between E495–E500, formed by the integration of the Neo-Clan Alliance, UECO, and the Hero Agency. A universal-scale cooperative framework aimed at avoiding the Hegemony Paradox."
                    : "E495〜E500年に設立された統合体。ネオクラン同盟・UECO・ヒーローエージェンシーが統合。ヘゲモニー・パラドックス回避を志向する全宇宙規模の協力枠組み。"}
                </p>
              </div>
              <div className="bg-edu-bg/50 rounded-lg p-4 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <Link
                    href={`/wiki/${encodeURIComponent("M104銀河")}`}
                    className="text-cyan-400 hover:underline"
                  >
                    {lang === "en" ? "M104 Galaxy (NGC 4594)" : "M104銀河（NGC 4594）"}
                  </Link>
                </h4>
                <p className="text-xs text-edu-muted leading-relaxed">
                  {lang === "en"
                    ? "The Sombrero Galaxy. Home to inhabited worlds such as the E16 Binary System and Eros-7. Human civilization has expanded within its halo region."
                    : "sombrero galaxy。E16連星系やEros-7などの居住世界が存在する銀河。ハロー領域に人類文明が展開している。"}
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
              wikiHref={`/wiki/${encodeURIComponent("E16連星系")}`}
              stats={[
                [
                  tl("所在", "Location", lang),
                  lang === "en" ? "Somewhere in M104 Galaxy Halo" : "M104銀河ハロー某所",
                ],
                [
                  tl("主星", "Primary Star", lang),
                  lang === "en" ? "Ea16 (Yellow-White Giant)" : "Ea16（黄白色巨星）",
                ],
                [
                  tl("伴星", "Companion Star", lang),
                  lang === "en" ? "Eb16 (Red Dwarf)" : "Eb16（赤色矮星）",
                ],
                [
                  tl("主要惑星", "Major Planets", lang),
                  <Link
                    key="s"
                    href={`/wiki/${encodeURIComponent("シンフォニー・オブ・スターズ")}`}
                    className="text-edu-muted hover:text-edu-accent2 hover:underline"
                  >
                    {lang === "en" ? "Symphony of Stars" : "シンフォニー・オブ・スターズ"}
                  </Link>,
                ],
                [tl("自転周期", "Rotation Period", lang), "44h 4m"],
                [
                  tl("暦法", "Calendar", lang),
                  lang === "en"
                    ? "Eastern Calendar (E Calendar) E1 = AD 3501"
                    : "東暦（E暦）E1 = AD 3501",
                ],
              ]}
              description={
                lang === "en"
                  ? "The first star system reached by humanity. Home to two major civilization zones — the Gigapolis region of the Western Continent and the Crescent Continent region of the Eastern Continent — it is the center of E16 civilization."
                  : "人類が最初に到達した星系。西大陸のGigapolis圈と東大陸のクレセント大地方の二大文明圏を擁し、E16文明の中心地。"
              }
              regions={[
                [
                  { name: "Gigapolis", wiki: `/wiki/${encodeURIComponent("ギガポリス")}` },
                  { name: "Chem", wiki: null },
                  { name: "Abrivo", wiki: null },
                  { name: "Troyane", wiki: null },
                  { name: "Ronve", wiki: null },
                  { name: "Valoria", wiki: `/wiki/${encodeURIComponent("Valoria")}` },
                  { name: "Persepolis", wiki: null },
                ],
                [
                  {
                    name: "ヴァーミリオン",
                    nameEn: "Vermillion",
                    wiki: `/wiki/${encodeURIComponent("ヴァーミリオン")}`,
                  },
                  {
                    name: "ブルー・ローズ",
                    nameEn: "Blue Rose",
                    wiki: `/wiki/${encodeURIComponent("ブルーローズ")}`,
                  },
                  {
                    name: "ミエルテンガ",
                    nameEn: "Miel Tenga",
                    wiki: `/wiki/${encodeURIComponent("ミエルテンガ")}`,
                  },
                  { name: "クロセヴィア", nameEn: "Crocevia", wiki: null },
                  { name: "アイアン・シンジケート", nameEn: "Iron Syndicate", wiki: null },
                  { name: "ファティマ連邦", nameEn: "Fatima Federation", wiki: null },
                ],
              ]}
              lang={lang}
            />

            {/* Eros-7 */}
            <PlanetCard
              icon={<Globe2 className="w-5 h-5" />}
              title="Eros-7"
              titleEn="Eros-7"
              color="text-pink-400"
              borderColor="border-pink-400/20"
              wikiHref={`/wiki/${encodeURIComponent("Eros-7")}`}
              stats={[
                [tl("所在", "Location", lang), lang === "en" ? "E16 Outskirts" : "E16外縁"],
                [tl("重力", "Gravity", lang), "1.1G"],
                [
                  tl("大気", "Atmosphere", lang),
                  lang === "en" ? "Thin oxygen atmosphere" : "薄い酸素大気",
                ],
                [
                  tl("社会体制", "Social System", lang),
                  <Link
                    key="mc"
                    href={`/wiki/${encodeURIComponent("マトリカル・カウンシル")}`}
                    className="text-edu-muted hover:text-pink-400 hover:underline"
                  >
                    {lang === "en" ? "Matrical Society (Female-led)" : "マトリカル社会（女性主導）"}
                  </Link>,
                ],
                [
                  tl("統治機関", "Governing Body", lang),
                  <Link
                    key="ms"
                    href={`/wiki/${encodeURIComponent("男性指令省")}`}
                    className="text-edu-muted hover:text-pink-400 hover:underline"
                  >
                    {lang === "en" ? "Male Directive Ministry" : "男性指令省"}
                  </Link>,
                ],
                [
                  tl("対立組織", "Opposing Org", lang),
                  <Link
                    key="su"
                    href={`/wiki/${encodeURIComponent("シャドウ・ユニオン")}`}
                    className="text-edu-muted hover:text-pink-400 hover:underline"
                  >
                    {lang === "en" ? "Shadow Union" : "シャドウ・ユニオン"}
                  </Link>,
                ],
              ]}
              description={
                lang === "en" ? (
                  <>
                    A planet where a female-led matrical society took root. It developed a unique
                    civilization around{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("リーチ・ドレイン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Leech Drain
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("エスパー能力")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Esper abilities
                    </Link>
                    , and in E525 the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・リフォーム運動")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Matrical Reform Movement
                    </Link>{" "}
                    erupted. It produced heroes such as{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("リリス・ヴェイン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Lilith Vane
                    </Link>
                    ,{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("シルヴィア・クロウ")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Sylvia Crow
                    </Link>
                    , and{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("アヤカ・リン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      Ayaka Rin
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    女性主導のマトリカル社会が形成された惑星。
                    <Link
                      href={`/wiki/${encodeURIComponent("リーチ・ドレイン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      リーチ・ドレイン
                    </Link>
                    と
                    <Link
                      href={`/wiki/${encodeURIComponent("エスパー能力")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      エスパー能力
                    </Link>
                    をめぐる独自の文明を発展させ、E525年には
                    <Link
                      href={`/wiki/${encodeURIComponent("マトリカル・リフォーム運動")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      マトリカル・リフォーム運動
                    </Link>
                    が勃発。
                    <Link
                      href={`/wiki/${encodeURIComponent("リリス・ヴェイン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      リリス・ヴェイン
                    </Link>
                    、
                    <Link
                      href={`/wiki/${encodeURIComponent("シルヴィア・クロウ")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      シルヴィア・クロウ
                    </Link>
                    、
                    <Link
                      href={`/wiki/${encodeURIComponent("アヤカ・リン")}`}
                      className="hover:text-pink-400 hover:underline"
                    >
                      アヤカ・リン
                    </Link>
                    などの英雄を輩出。
                  </>
                )
              }
              regions={[
                [
                  {
                    name: "ネオンクレーター宮殿",
                    nameEn: "Neon Crater Palace",
                    wiki: `/wiki/${encodeURIComponent("ネオンクレーター宮殿")}`,
                  },
                  {
                    name: "スクイーズ・アビス",
                    nameEn: "Squeeze Abyss",
                    wiki: `/wiki/${encodeURIComponent("スクイーズ・アビス")}`,
                  },
                  {
                    name: "アンダーグリッド",
                    nameEn: "Undergrid",
                    wiki: `/wiki/${encodeURIComponent("アンダーグリッド")}`,
                  },
                  {
                    name: "セントラル・タワー",
                    nameEn: "Central Tower",
                    wiki: `/wiki/${encodeURIComponent("セントラル・タワー")}`,
                  },
                ],
              ]}
              lang={lang}
            />

            {/* 惑星ビブリオ */}
            <PlanetCard
              icon={<Globe2 className="w-5 h-5" />}
              title="惑星ビブリオ"
              titleEn="Planet Bibliotheca"
              color="text-emerald-400"
              borderColor="border-emerald-400/20"
              wikiHref={`/wiki/${encodeURIComponent("惑星ビブリオ")}`}
              stats={[
                [tl("所在", "Location", lang), lang === "en" ? "Within M104 Galaxy" : "M104銀河内"],
                [
                  tl("特徴", "Characteristics", lang),
                  lang === "en" ? "Academic & Research Center" : "学術・研究の中心地",
                ],
                [
                  tl("主要施設", "Key Institution", lang),
                  <Link
                    key="uu"
                    href={`/wiki/${encodeURIComponent("ロレンツィオ国際大学")}`}
                    className="text-edu-muted hover:text-emerald-400 hover:underline"
                  >
                    {lang === "en" ? "Bibliotheca International University" : "ビブリオ国際大学"}
                  </Link>,
                ],
                [
                  tl("関連人物", "Related Figures", lang),
                  <Link
                    key="mi"
                    href={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`}
                    className="text-edu-muted hover:text-emerald-400 hover:underline"
                  >
                    {lang === "en" ? "Mina (Enrolled E514)" : "ミナ（E514年入学）"}
                  </Link>,
                ],
              ]}
              description={
                lang === "en" ? (
                  <>
                    An academic planet located within the M104 Galaxy. Home to Bibliotheca
                    International University, it hosts advanced educational and research
                    institutions, including the AI Department.{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`}
                      className="hover:text-emerald-400 hover:underline"
                    >
                      Mina Eureka Ernst
                    </Link>{" "}
                    enrolled in this planet&apos;s AI Department in E514, nurturing the seeds of the
                    later{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
                      className="hover:text-emerald-400 hover:underline"
                    >
                      Liminal Forge
                    </Link>{" "}
                    concept.
                  </>
                ) : (
                  <>
                    M104銀河内に位置する学術惑星。ビブリオ国際大学を擁し、AI学部をはじめとする高度な教育・研究機関が集積している。
                    <Link
                      href={`/wiki/${encodeURIComponent("ミナ・エウレカ・エルンスト")}`}
                      className="hover:text-emerald-400 hover:underline"
                    >
                      ミナ・エウレカ・エルンスト
                    </Link>
                    はE514年にこの惑星のAI学部に入学し、後の
                    <Link
                      href={`/wiki/${encodeURIComponent("リミナル・フォージ")}`}
                      className="hover:text-emerald-400 hover:underline"
                    >
                      リミナル・フォージ
                    </Link>
                    構想の種を育んだ。
                  </>
                )
              }
              lang={lang}
            />

            {/* 惑星Solaris */}
            <PlanetCard
              icon={<Globe2 className="w-5 h-5" />}
              title="惑星Solaris"
              titleEn="Planet Solaris"
              color="text-orange-400"
              borderColor="border-orange-400/20"
              wikiHref={`/wiki/${encodeURIComponent("惑星Solaris")}`}
              stats={[
                [tl("所在", "Location", lang), lang === "en" ? "Within M104 Galaxy" : "M104銀河内"],
                [
                  tl("特徴", "Characteristics", lang),
                  lang === "en" ? "Stellar Energy Research" : "恒星エネルギー研究",
                ],
              ]}
              description={
                lang === "en" ? (
                  <>
                    A planet within the M104 Galaxy. It serves as a research hub for stellar energy,
                    playing a key role in supporting the technological foundation of the{" "}
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="hover:text-orange-400 hover:underline"
                    >
                      Galactic Consortium
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    M104銀河内に位置する惑星。恒星エネルギーの研究拠点として機能し、
                    <Link
                      href={`/wiki/${encodeURIComponent("銀河系コンソーシアム")}`}
                      className="hover:text-orange-400 hover:underline"
                    >
                      銀河系コンソーシアム
                    </Link>
                    の技術基盤を支える一翼を担っている。
                  </>
                )
              }
              lang={lang}
            />
          </div>

          {/* 宇宙5大文明圏 */}
          <RevealSection>
            <div className="edu-card rounded-xl p-6 border border-amber-500/20 mb-8">
              <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                {tl("宇宙5大文明圏", "Five Great Cosmic Civilizations", lang)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Link
                  href="/civilizations/granbell"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-amber-400/20 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-400">
                      {lang === "en" ? "Granbell" : "グランベル"}
                    </span>
                    <span className="text-xs text-edu-muted">#1</span>
                  </div>
                  <p className="text-xs text-edu-muted mt-1">
                    {lang === "en"
                      ? "Quantum Economics · Interdimensional Technology — GDP $150 Trillion"
                      : "量子経済・次元間技術 — GDP150兆ドル"}
                  </p>
                </Link>
                <Link
                  href="/civilizations/elyseon"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-emerald-400/20 hover:border-emerald-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-400">
                      {lang === "en" ? "Elyseon" : "エレシオン"}
                    </span>
                    <span className="text-xs text-edu-muted">#2</span>
                  </div>
                  <p className="text-xs text-edu-muted mt-1">
                    {lang === "en"
                      ? "Medical Technology · Environmental Restoration — Peaceful Diplomacy"
                      : "医療技術・環境再生 — 平和外交"}
                  </p>
                </Link>
                <Link
                  href="/civilizations/tyeria"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-rose-400/20 hover:border-rose-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-rose-400">
                      {lang === "en" ? "Tyeria" : "ティエリア"}
                    </span>
                    <span className="text-xs text-edu-muted">#3</span>
                  </div>
                  <p className="text-xs text-edu-muted mt-1">
                    {lang === "en"
                      ? "Military Power · Defense Network"
                      : "軍事力・防衛ネットワーク"}
                  </p>
                </Link>
                <Link
                  href="/civilizations/fallujah"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-violet-400/20 hover:border-violet-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-violet-400">
                      {lang === "en" ? "Fallujah" : "ファルージャ"}
                    </span>
                    <span className="text-xs text-edu-muted">#4</span>
                  </div>
                  <p className="text-xs text-edu-muted mt-1">
                    {lang === "en"
                      ? "Cultural Influence · Diplomacy · Mediation"
                      : "文化的影響力・外交・調停"}
                  </p>
                </Link>
                <Link
                  href="/civilizations/dioclenis"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">
                      {lang === "en" ? "Dioclenis" : "ディオクレニス"}
                    </span>
                    <span className="text-xs text-edu-muted">#5</span>
                  </div>
                  <p className="text-xs text-edu-muted mt-1">
                    {lang === "en"
                      ? "Space Exploration · Scientific Research"
                      : "宇宙探査・科学技術研究"}
                  </p>
                </Link>
                <Link
                  href="/civilizations"
                  className="bg-edu-bg/50 rounded-lg p-3 border border-edu-border/30 hover:border-amber-400/40 transition-colors flex items-center justify-center"
                >
                  <span className="text-xs text-edu-muted">
                    {tl("全文明圏を見る →", "View all civilizations →", lang)}
                  </span>
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </RevealSection>

      <footer className="relative border-t border-edu-border/50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-accent transition-colors">
            ← {tl("トップページに戻る", "Back to top page", lang)}
          </Link>
        </div>
      </footer>
    </div>
  )
}
