"use client"
import React, { useEffect, useRef } from "react"

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible")
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal-section ${className}`}>{children}</div>
}

export function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-nebula-purple/20 mb-4 glow-purple">
        {icon}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-cosmic-gradient mb-2">{title}</h2>
      {subtitle && <p className="text-cosmic-muted text-sm max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}
