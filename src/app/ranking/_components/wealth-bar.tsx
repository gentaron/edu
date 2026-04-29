import React from "react"

export function WealthBar({
  wealthNum,
  maxWealth,
  rank,
}: {
  wealthNum: number
  maxWealth: number
  rank: number
}) {
  const pct = (wealthNum / maxWealth) * 100
  const barColor =
    rank === 1
      ? "bg-edu-accent"
      : rank === 2
        ? "bg-edu-muted"
        : rank === 3
          ? "bg-edu-accent/70"
          : "bg-edu-accent2"

  return (
    <div className="w-full h-1.5 rounded-full bg-edu-surface overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-1000`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
