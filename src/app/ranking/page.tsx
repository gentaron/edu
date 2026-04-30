import React from "react"
import Link from "next/link"
import { TrendingUp, Globe2 } from "lucide-react"
import { CIVILIZATION_LEADERS } from "@/domains/civilizations/civ.data"
import { RANKING_DATA } from "./_components/ranking-data"
import { RankingCard } from "./_components/ranking-card"
import { FooterNotes } from "./_components/footer-notes"

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function RankingPage() {
  const maxWealth = RANKING_DATA[0]?.wealthNum ?? 0

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* Hero Header */}
      <header className="pt-28 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-edu-surface border border-edu-border mb-6">
            <TrendingUp className="w-8 h-8 text-edu-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-edu-text mb-4 leading-tight">
            世界長者番付
          </h1>
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-edu-accent to-transparent mb-6" />
          <p className="text-sm sm:text-base text-edu-muted max-w-2xl mx-auto leading-relaxed">
            E16連星系経済圏における富豪ランキング。現代の実力者から歴史的人物まで、
            推定資産額をnトークンで公開。次元技術、星間交易、量子ファイナンス —
            宇宙規模の富の分布を網羅。
          </p>

          {/* Summary Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xl font-black text-edu-accent tabular-nums">15</p>
              <p className="text-[10px] text-edu-muted tracking-wider">ランクイン</p>
            </div>
            <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xl font-black text-edu-accent2 tabular-nums">150兆</p>
              <p className="text-[10px] text-edu-muted tracking-wider">最高推定資産 (n)</p>
            </div>
            <div className="edu-card rounded-lg px-4 py-3 min-w-[120px]">
              <p className="text-xl font-black text-edu-accent2 tabular-nums">12</p>
              <p className="text-[10px] text-edu-muted tracking-wider">勢力・組織</p>
            </div>
          </div>
        </div>
      </header>

      {/* Ranking List */}
      <main className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {RANKING_DATA.map((entry) => (
              <RankingCard key={entry.rank} entry={entry} maxWealth={maxWealth} />
            ))}
          </div>

          {/* Civilization Leaders Section */}
          <div className="mt-12 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Globe2 className="w-5 h-5 text-edu-accent" />
                <h2 className="text-xl font-bold text-edu-text">文明圏指導者</h2>
              </div>
              <p className="text-xs text-edu-muted">
                宇宙5大文明圏の指導者 — 国家規模の力を持つ指導者たち
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CIVILIZATION_LEADERS.map((leader, i) => (
                <Link
                  key={leader.wikiId}
                  href={`/wiki/${encodeURIComponent(leader.wikiId)}`}
                  className="edu-card rounded-xl border border-edu-border hover:border-edu-accent/30 p-5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-edu-surface border border-edu-border">
                      <span className="text-sm font-bold text-edu-accent">#{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-edu-text">{leader.name}</h3>
                      <p className={`text-xs ${leader.civilizationColor}`}>{leader.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-edu-muted">文明圏</span>
                      <span className={leader.civilizationColor}>{leader.civilization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-edu-muted">規模</span>
                      <span className="text-edu-accent2">{leader.wealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-edu-muted">時代</span>
                      <span className="text-edu-accent">{leader.era}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-edu-muted">出自</span>
                      <span className="text-edu-muted">{leader.source}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Notes */}
          <FooterNotes />
        </div>
      </main>
    </div>
  )
}
