"use client"

import { m, AnimatePresence } from "framer-motion"

export function HealWaveEffect({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.5, 0.3, 0], y: [-10, -20, -30] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 rounded-xl pointer-events-none z-20 overflow-hidden"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0], y: -30, scale: [0.5, 1.2, 0.8] }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="absolute text-emerald-400 text-lg"
              style={{ left: `${10 + i * 12}%`, bottom: "30%" }}
            >
              +
            </m.div>
          ))}
        </m.div>
      )}
    </AnimatePresence>
  )
}
