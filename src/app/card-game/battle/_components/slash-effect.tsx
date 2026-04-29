"use client"

import { m } from "framer-motion"

export function SlashEffect({ type, x, y }: { type: "attack" | "ultimate"; x: number; y: number }) {
  const isUlt = type === "ultimate"
  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: isUlt ? 3 : 1 }, (_, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, rotate: -45 + i * 30, scaleX: 0 }}
          animate={{ opacity: [0, 1, 1, 0], rotate: -45 + i * 30 + 15, scaleX: [0, 1.5, 1.5, 0] }}
          transition={{ duration: isUlt ? 0.6 : 0.4, delay: i * 0.15, ease: "easeInOut" }}
          className={`absolute ${isUlt ? "w-32 h-1" : "w-24 h-0.5"} ${isUlt ? "bg-gradient-to-r from-transparent via-yellow-400 to-transparent" : "bg-gradient-to-r from-transparent via-red-400 to-transparent"}`}
          style={{ filter: `drop-shadow(0 0 ${isUlt ? 8 : 4}px ${isUlt ? "#facc15" : "#f87171"})` }}
        />
      ))}
    </div>
  )
}
