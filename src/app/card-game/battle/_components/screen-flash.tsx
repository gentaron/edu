"use client"

import { m, AnimatePresence } from "framer-motion"

export function ScreenFlash({
  color,
  active,
  intensity = 0.3,
}: {
  color: string
  active: boolean
  intensity?: number
}) {
  return (
    <AnimatePresence>
      {active && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, intensity, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  )
}
