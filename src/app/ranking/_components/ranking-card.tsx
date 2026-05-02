import React from "react"
import Link from "next/link"
import { Gem, Building2, Clock } from "lucide-react"
import type { RankingEntry } from "./ranking-data"
import { RankBadge } from "./rank-badge"
import { WealthBar } from "./wealth-bar"

export function RankingCard({ entry, maxWealth }: { entry: RankingEntry; maxWealth: number }) {
  const isTop3 = entry.rank <= 3
  const borderColor =
    entry.rank === 1
      ? "border-edu-accent/40 hover:border-edu-accent/60"
      : entry.rank === 2
        ? "border-edu-border hover:border-edu-muted"
        : entry.rank === 3
          ? "border-edu-accent/30 hover:border-edu-accent/50"
          : "border-edu-border hover:border-edu-accent2/40"

  return (
    <div
      className={`group relative edu-card rounded-xl border ${borderColor} p-5 sm:p-6 transition-all duration-300`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Rank Badge */}
        <RankBadge rank={entry.rank} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-lg font-bold truncate ${
                    isTop3 ? "text-edu-accent" : "text-edu-text"
                  }`}
                >
                  <Link
                    href={`/wiki/${encodeURIComponent(entry.wikiId)}`}
                    className="hover:underline"
                  >
                    {entry.name}
                  </Link>
                </h3>
                {entry.isHistorical && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-edu-surface border border-edu-border text-edu-muted whitespace-nowrap">
                    歴史的人物
                  </span>
                )}
              </div>
              <p className="text-sm text-edu-muted">{entry.title}</p>
            </div>

            {/* Wealth Display */}
            <div className="text-right shrink-0">
              <p
                className={`text-xl sm:text-2xl font-black tabular-nums ${
                  isTop3 ? "text-edu-accent" : "text-edu-accent2"
                }`}
              >
                {entry.wealth}
              </p>
              <p className="text-[10px] text-edu-muted tracking-wider">推定資産額</p>
            </div>
          </div>

          {/* Wealth Bar */}
          <div className="mb-4">
            <WealthBar wealthNum={entry.wealthNum} maxWealth={maxWealth} rank={entry.rank} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-edu-muted">
              <Gem className="w-3.5 h-3.5 text-edu-accent2 shrink-0" />
              <span className="truncate">{entry.source}</span>
            </div>
            <div className="flex items-center gap-2 text-edu-muted">
              <Building2 className="w-3.5 h-3.5 text-edu-accent2 shrink-0" />
              <span className="truncate">{entry.affiliation}</span>
            </div>
            <div className="flex items-center gap-2 text-edu-muted">
              <Clock className="w-3.5 h-3.5 text-edu-accent shrink-0" />
              <span className="truncate">{entry.era}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
