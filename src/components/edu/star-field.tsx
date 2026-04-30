"use client"
import React from "react"

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function StarField() {
  // Layer 1: Nebulae — large translucent color blobs
  const nebulae = React.useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const r = seededRandom(i * 97 + 13)
        return {
          id: `nebula-${i}`,
          left: r() * 100,
          top: r() * 100,
          width: 300 + r() * 500,
          height: 300 + r() * 400,
          color: [
            "rgba(99, 102, 241, 0.04)",
            "rgba(139, 92, 246, 0.03)",
            "rgba(34, 211, 238, 0.025)",
            "rgba(200, 164, 78, 0.02)",
          ][i % 4],
          duration: 20 + r() * 30,
        }
      }),
    []
  )

  // Layer 2: Stars — 150 (mixed sizes)
  const stars = React.useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => {
        const r = seededRandom(i * 7 + 1)
        const size = r() < 0.1 ? 1.5 + r() * 1.5 : r() < 0.3 ? 0.8 + r() * 0.7 : 0.3 + r() * 0.5
        return {
          id: i,
          left: r() * 100,
          top: r() * 100,
          size,
          delay: r() * 8,
          duration: 3 + r() * 5,
          opacity: 0.1 + r() * 0.4,
          isBright: size > 2,
        }
      }),
    []
  )

  // Layer 3: Cosmic dust — 50 ultra-small points
  const dust = React.useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const r = seededRandom(i * 31 + 17)
        return {
          id: i,
          left: r() * 100,
          top: r() * 100,
          size: 0.2 + r() * 0.3,
          opacity: 0.05 + r() * 0.1,
        }
      }),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Nebulae */}
      {nebulae.map((n) => (
        <div
          key={n.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${n.left}%`,
            top: `${n.top}%`,
            width: n.width,
            height: n.height,
            background: `radial-gradient(ellipse, ${n.color}, transparent 70%)`,
            animation: `float-nebula ${n.duration}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.isBright ? "#e2e8f0" : "#94a3b8",
            boxShadow: s.isBright ? `0 0 ${s.size * 3}px rgba(226,232,240,0.3)` : "none",
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Cosmic dust */}
      {dust.map((d) => (
        <div
          key={`dust-${d.id}`}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            backgroundColor: "#64748b",
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}
