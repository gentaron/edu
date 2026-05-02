"use client"

import { m } from "framer-motion"

export function FloatingText({
  text,
  color,
  x,
  y,
  isCrit = false,
}: {
  text: string
  color: string
  x: number
  y: number
  isCrit?: boolean
}) {
  return (
    <m.div
      initial={{ opacity: 1, y: 0, scale: isCrit ? 0.3 : 0.5 }}
      animate={{
        opacity: 0,
        y: isCrit ? -80 : -60,
        scale: isCrit ? [0.3, 1.5, 1.2] : [0.5, 1.2, 1],
      }}
      transition={{ duration: isCrit ? 1.4 : 1.2, ease: "easeOut" }}
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <span
        className={`${isCrit ? "text-2xl" : "text-xl"} font-black drop-shadow-lg ${color}`}
        style={{ textShadow: `0 0 ${isCrit ? 16 : 8}px ${color}` }}
      >
        {text}
      </span>
    </m.div>
  )
}
