"use client"

import { m, AnimatePresence } from "framer-motion"

export function ShieldDomeEffect({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.15, 0.3, 0.15, 0], scale: [0.8, 1, 1.1, 1, 0.9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(96,165,250,0.3) 0%, transparent 70%)",
            border: "2px solid rgba(96,165,250,0.3)",
          }}
        />
      )}
    </AnimatePresence>
  )
}
