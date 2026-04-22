"use client"

import { useEffect, useRef } from "react"

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      bar!.style.width = `${progress}%`
    }

    window.addEventListener("scroll", update, { passive: true })
    update()

    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-[56px] left-0 right-0 z-50 h-0.5 bg-cosmic-border/30">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-nebula-purple via-electric-blue to-nebula-purple w-0 transition-[width] duration-100"
      />
    </div>
  )
}
