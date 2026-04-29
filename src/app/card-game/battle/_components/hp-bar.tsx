"use client"

import { m } from "framer-motion"

export function HpBar({
  current,
  max,
  color,
}: {
  current: number
  max: number
  color: "rose" | "emerald"
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const cls =
    color === "rose"
      ? "bg-gradient-to-r from-rose-600 via-red-400 to-rose-500"
      : "bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-500"
  return (
    <div className="w-full h-3 bg-edu-bg rounded-full overflow-hidden border border-edu-border/30 relative">
      {pct > 0 && (
        <m.div
          className={`h-full rounded-full ${cls} shadow-lg`}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      {pct > 0 && pct <= 25 && (
        <m.div
          className="absolute inset-0 rounded-full bg-rose-500/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}
