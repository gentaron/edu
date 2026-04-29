import Link from "next/link"
import { Crown, Swords, Shield, Users } from "lucide-react"
import { StarField } from "@/components/edu/star-field"
import { RevealSection, SectionHeader } from "@/components/edu/reveal-section"
import { PageHeader } from "@/components/edu/page-header"
import { ALL_CARDS } from "@/lib/card-data"
import type { GameCard } from "@/types"
import { ALL_ENTRIES } from "@/lib/wiki-data"

/* Build a lookup from card display name → wiki entry id */
const nameToWikiId = new Map<string, string>()
ALL_ENTRIES.forEach((e) => {
  nameToWikiId.set(e.name, e.id)
  if (e.nameEn) nameToWikiId.set(e.nameEn, e.id)
})

export default function CharactersPage() {
  const srCards = ALL_CARDS.filter((c) => c.rarity === "SR").sort(
    (a, b) =>
      b.attack +
      b.defense +
      b.effectValue +
      b.ultimate -
      (a.attack + a.defense + a.effectValue + a.ultimate)
  )
  const rCards = ALL_CARDS.filter((c) => c.rarity === "R").sort(
    (a, b) =>
      b.attack +
      b.defense +
      b.effectValue +
      b.ultimate -
      (a.attack + a.defense + a.effectValue + a.ultimate)
  )
  const cCards = ALL_CARDS.filter((c) => c.rarity === "C").sort(
    (a, b) =>
      b.attack +
      b.defense +
      b.effectValue +
      b.ultimate -
      (a.attack + a.defense + a.effectValue + a.ultimate)
  )

  const cardsByAffiliation = (() => {
    const map = new Map<string, GameCard[]>()
    ALL_CARDS.forEach((card) => {
      const list = map.get(card.affiliation) || []
      list.push(card)
      map.set(card.affiliation, list)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([affiliation, cards]) => ({
        affiliation,
        cards: cards.sort((a, b) => {
          const rarityOrder = { SR: 0, R: 1, C: 2 }
          if (rarityOrder[a.rarity] !== rarityOrder[b.rarity])
            return rarityOrder[a.rarity] - rarityOrder[b.rarity]
          return (
            b.attack +
            b.defense +
            b.effectValue +
            b.ultimate -
            (a.attack + a.defense + a.effectValue + a.ultimate)
          )
        }),
      }))
  })()

  const tierSections = [
    {
      label: `SR — 伝説級 ×${srCards.length}`,
      color: "from-yellow-500/20 to-amber-500/10",
      borderColor: "border-yellow-400/30",
      textColor: "text-yellow-400",
      icon: <Crown className="w-4 h-4 text-yellow-400" />,
      cards: srCards,
      badgeClass: "rarity-badge-sr",
    },
    {
      label: `R — レア ×${rCards.length}`,
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-400/30",
      textColor: "text-blue-400",
      icon: <Swords className="w-4 h-4 text-blue-400" />,
      cards: rCards,
      badgeClass: "rarity-badge-r",
    },
    {
      label: `C — コモン ×${cCards.length}`,
      color: "from-edu-surface to-edu-bg/50",
      borderColor: "border-edu-border/40",
      textColor: "text-edu-muted",
      icon: <Shield className="w-4 h-4 text-edu-muted" />,
      cards: cCards,
      badgeClass: "bg-edu-bg/50 text-edu-muted border border-edu-border/30",
    },
  ]

  return (
    <div className="relative min-h-screen bg-edu-bg">
      <StarField />
      <div className="relative z-10">
        <PageHeader
          icon={<Crown className="w-6 h-6 text-edu-accent" />}
          title="キャラクターTier表"
          subtitle={`Eternal Dominion Universe — 全${ALL_CARDS.length}キャラクターのカードデータ`}
        />

        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4">
            {/* Tier Table */}
            <div className="space-y-6">
              {tierSections.map((tier) => (
                <div
                  key={tier.label}
                  className={`edu-card rounded-xl border ${tier.borderColor} overflow-hidden transition-all duration-300`}
                >
                  <div
                    className={`bg-gradient-to-r ${tier.color} px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3`}
                  >
                    {tier.icon}
                    <h3 className={`font-bold text-xs sm:text-sm ${tier.textColor}`}>
                      {tier.label}
                    </h3>
                  </div>
                  <div className="p-3 sm:p-4 overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-edu-border/30">
                          <th className="text-left py-2 px-2 text-edu-muted font-medium">キャラ</th>
                          <th className="text-left py-2 px-2 text-edu-muted font-medium hidden sm:table-cell">
                            勢力
                          </th>
                          <th className="text-center py-2 px-2 text-red-400 font-medium">⚔</th>
                          <th className="text-center py-2 px-2 text-blue-400 font-medium">🛡</th>
                          <th className="text-center py-2 px-2 text-purple-300 font-medium">✨</th>
                          <th className="text-center py-2 px-2 text-yellow-400 font-medium">💥</th>
                          <th className="text-center py-2 px-2 text-edu-muted font-medium">合計</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tier.cards.map((card) => {
                          const total =
                            card.attack + card.defense + card.effectValue + card.ultimate
                          return (
                            <tr
                              key={card.id}
                              className="border-b border-edu-border/10 hover:bg-edu-surface/30 transition-colors"
                            >
                              <td className="py-2 px-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tier.badgeClass}`}
                                  >
                                    {card.rarity}
                                  </span>
                                  <span className="text-edu-text font-medium">
                                    {nameToWikiId.has(card.name) ? (
                                      <Link
                                        href={`/wiki/${encodeURIComponent(nameToWikiId.get(card.name)!)}`}
                                        className="hover:text-edu-accent2 hover:underline"
                                      >
                                        {card.name}
                                      </Link>
                                    ) : (
                                      card.name
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-2 text-edu-muted text-xs hidden sm:table-cell">
                                {card.affiliation}
                              </td>
                              <td className="py-2 px-2 text-center text-red-400 font-bold">
                                {card.attack}
                              </td>
                              <td className="py-2 px-2 text-center text-blue-400 font-bold">
                                {card.defense}
                              </td>
                              <td className="py-2 px-2 text-center text-purple-300 font-bold">
                                {card.effectValue}
                              </td>
                              <td className="py-2 px-2 text-center text-yellow-400 font-bold">
                                {card.ultimate}
                              </td>
                              <td className={`py-2 px-2 text-center font-black ${tier.textColor}`}>
                                {total}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* IRIS Ranking */}
              <div className="edu-card rounded-xl p-4 sm:p-6 border border-pink-400/20">
                <h3 className="text-sm font-bold text-pink-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400" /> IRIS現代ランキング
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { rank: 1, name: "アイリス", wikiId: "アイリス", color: "text-edu-accent" },
                    { rank: 2, name: "フィオナ", wikiId: "フィオナ", color: "text-gray-300" },
                    {
                      rank: 3,
                      name: "マリーナ",
                      wikiId: "マリーナ・ボビン",
                      color: "text-amber-700",
                    },
                    {
                      rank: 4,
                      name: "セバスチャン",
                      wikiId: "セバスチャン・ヴァレリウス",
                      color: "text-edu-muted",
                    },
                    {
                      rank: 5,
                      name: "カスチーナ",
                      wikiId: "カスチーナ・テンペスト",
                      color: "text-edu-muted",
                    },
                  ].map((r) => (
                    <div
                      key={r.rank}
                      className="flex items-center gap-2 bg-edu-bg/50 rounded-lg px-3 py-2 border border-edu-border/50"
                    >
                      <span className={`text-lg font-black ${r.color} w-6 text-center`}>
                        {r.rank}
                      </span>
                      <Link
                        href={`/wiki/${encodeURIComponent(r.wikiId)}`}
                        className="text-sm text-edu-text font-medium hover:text-edu-accent2 hover:underline"
                      >
                        {r.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faction Character Roster */}
            <div className="mt-16">
              <SectionHeader
                icon={<Users className="w-6 h-6 text-red-400" />}
                title="勢力別キャラクター一覧"
                subtitle={`E528現代における主要勢力と所属キャラクターの完全リスト（全${ALL_CARDS.length}体）`}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {cardsByAffiliation.map((faction) => {
                  const srCount = faction.cards.filter((c) => c.rarity === "SR").length
                  const rCount = faction.cards.filter((c) => c.rarity === "R").length
                  const cCount = faction.cards.filter((c) => c.rarity === "C").length
                  return (
                    <div
                      key={faction.affiliation}
                      className="edu-card rounded-xl border border-edu-border/30 overflow-hidden transition-all duration-300"
                    >
                      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-edu-surface to-edu-bg/50 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-edu-accent2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs sm:text-sm text-edu-text truncate">
                            {faction.affiliation}
                          </h3>
                          <p className="text-[10px] text-edu-muted">{faction.cards.length}体</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {srCount > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded rarity-badge-sr">
                              SR×{srCount}
                            </span>
                          )}
                          {rCount > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded rarity-badge-r">
                              R×{rCount}
                            </span>
                          )}
                          {cCount > 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-edu-bg/50 text-edu-muted border border-edu-border/30">
                              C×{cCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 space-y-0.5">
                        {faction.cards.map((card) => (
                          <div
                            key={card.id}
                            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-edu-bg/50 transition-colors"
                          >
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${card.rarity === "SR" ? "rarity-badge-sr" : card.rarity === "R" ? "rarity-badge-r" : "bg-edu-bg/50 text-edu-muted border border-edu-border/30"}`}
                            >
                              {card.rarity}
                            </span>
                            <span className="text-xs sm:text-sm text-edu-text font-medium flex-1 truncate">
                              {nameToWikiId.has(card.name) ? (
                                <Link
                                  href={`/wiki/${encodeURIComponent(nameToWikiId.get(card.name)!)}`}
                                  className="hover:text-edu-accent2 hover:underline"
                                >
                                  {card.name}
                                </Link>
                              ) : (
                                card.name
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] shrink-0">
                              <span className="text-red-400 font-bold">{card.attack}</span>
                              <span className="text-blue-400 font-bold">{card.defense}</span>
                              <span className="text-purple-300 font-bold">{card.effectValue}</span>
                              <span className="text-yellow-400 font-bold">{card.ultimate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

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
