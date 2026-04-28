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
      { threshold: 0.08 }
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
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-edu-muted">{icon}</span>
        <h2 className="text-lg sm:text-xl font-medium text-edu-text tracking-wide">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-edu-muted leading-relaxed">{subtitle}</p>}
      <hr className="edu-divider mt-4" />
    </div>
  )
}
