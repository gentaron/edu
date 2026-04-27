"use client"

/* Seeded PRNG for deterministic star positions */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: seededRandom(i * 7 + 1)() * 100,
  top: seededRandom(i * 13 + 3)() * 100,
  size: seededRandom(i * 17 + 5)() * 2 + 0.5,
  delay: seededRandom(i * 23 + 7)() * 5,
  duration: seededRandom(i * 29 + 11)() * 3 + 2,
  opacity: seededRandom(i * 31 + 13)() * 0.5 + 0.2,
}))

export default function StarField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
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
