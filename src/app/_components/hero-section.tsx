import React from "react"
import Link from "next/link"
import { Star, Globe2, Zap, Radio, Shield, ChevronDown } from "lucide-react"
import { TypewriterTitle } from "./typewriter-title"

const TAGS = [
  { icon: Star, label: "E16連星系" },
  { icon: Globe2, label: "Eros-7" },
  { icon: Zap, label: "AURALIS" },
  { icon: Radio, label: "Liminal Forge" },
  { icon: Shield, label: "Iris Worlds" },
]

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Radial gradient — subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(129, 140, 248, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Bottom horizontal gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200, 164, 78, 0.3), rgba(129, 140, 248, 0.3), transparent)",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <TypewriterTitle />

        <div
          className="h-px w-24 mx-auto mt-4 mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, #c8a44e, transparent)",
          }}
        />

        <p className="text-lg sm:text-xl text-edu-muted font-light tracking-[0.2em] mb-2">
          統合時空構造書 v3.0
        </p>
        <p className="text-sm text-edu-accent2 tracking-wider mb-10">
          M104銀河全域 — E16・Eros-7・ビブリオ・Solaris
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {TAGS.map((tag) => (
            <span key={tag.label} className="edu-tag">
              <tag.icon className="w-3 h-3" />
              {tag.label}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-edu-muted/40" />
        </div>
      </div>
    </section>
  )
}
