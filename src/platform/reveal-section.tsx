"use client"
import React, { useEffect, useRef, useState } from "react"

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {return}
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, isVisible }
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function RevealGrid({
  children,
  className = "",
  staggerMs = 80,
}: {
  children: React.ReactNode
  className?: string
  staggerMs?: number
}) {
  const { ref, isVisible } = useReveal()
  const childArray = React.Children.toArray(children)

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
            transition: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * staggerMs}ms, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * staggerMs}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-edu-muted">{icon}</span>
        <h2 className="text-lg sm:text-xl font-semibold text-edu-text tracking-wide">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-edu-muted leading-relaxed">{subtitle}</p>}
      <div className="mt-4 h-px bg-gradient-to-r from-edu-border-bright via-edu-border to-transparent" />
    </div>
  )
}
