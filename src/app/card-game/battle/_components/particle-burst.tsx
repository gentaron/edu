"use client"

import { m } from "framer-motion"

export function ParticleBurst({
  color,
  count = 12,
  x,
  y,
}: {
  color: string
  count?: number
  x: number
  y: number
}) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i
    const dist = 40 + Math.random() * 60
    const rad = (angle * Math.PI) / 180
    return {
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.2,
    }
  })
  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <m.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.tx, y: p.ty, scale: 0 }}
          transition={{ duration: 0.6 + Math.random() * 0.3, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}
