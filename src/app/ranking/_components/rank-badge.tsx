import React from "react"
import { Crown } from "lucide-react"

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-accent bg-edu-accent/10">
          <Crown className="w-6 h-6 text-edu-accent" />
        </div>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-muted bg-edu-surface">
          <span className="text-lg font-black text-edu-text">2</span>
        </div>
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-14 h-14 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-edu-accent/50 bg-edu-accent/5">
          <span className="text-lg font-black text-edu-accent">3</span>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-14 h-14 shrink-0">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-edu-border bg-edu-surface">
        <span className="text-lg font-bold text-edu-muted">{rank}</span>
      </div>
    </div>
  )
}
