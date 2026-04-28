"use client"
import React from "react"

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function StarField() {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: seededRandom(i * 7 + 1)() * 100,
        top: seededRandom(i * 13 + 3)() * 100,
        size: seededRandom(i * 17 + 5)() * 1.2 + 0.3,
        delay: seededRandom(i * 23 + 7)() * 6,
        duration: seededRandom(i * 29 + 11)() * 4 + 3,
        opacity: seededRandom(i * 31 + 13)() * 0.15 + 0.05,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-edu-muted animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}
