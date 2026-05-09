"use client"

import React from "react"
import { useLang } from "@/lib/use-lang"
import { Star, Globe2, Zap, Radio, Shield } from "lucide-react"
import { TypewriterTitle } from "./typewriter-title"

const TAGS = [
  { icon: Star, label: "E16連星系", labelEn: "E16 Binary System" },
  { icon: Globe2, label: "Eros-7", labelEn: "Eros-7" },
  { icon: Zap, label: "AURALIS", labelEn: "AURALIS" },
  { icon: Radio, label: "Liminal Forge", labelEn: "Liminal Forge" },
  { icon: Shield, label: "Iris Worlds", labelEn: "Iris Worlds" },
]

const PARTICLES = Array.from({ length: 12 }, (_, i) => i)

export function HeroSection() {
  const { lang } = useLang()

  return (
    <section className="min-h-screen flex items-center justify-center edu-mesh-bg overflow-hidden">
      {/* Floating particles */}
      <div className="edu-particles" aria-hidden="true">
        {PARTICLES.map((i) => (
          <span key={i} className="dot" />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <TypewriterTitle />

        <div
          className="h-px w-24 mx-auto mt-4 mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, #c8a44e, transparent)",
          }}
        />

        <p className="text-lg sm:text-xl text-edu-muted font-light tracking-[0.2em] mb-1">
          {lang === "en" ? "Unified Spatiotemporal Codex" : "統合時空構造書"}{" "}
          <span className="text-edu-accent text-base sm:text-lg">v3.0</span>
        </p>
        <p className="text-sm text-edu-accent2 tracking-wider mb-10">
          {lang === "en"
            ? "M104 Galaxy — E16 · Eros-7 · Biblios · Solaris"
            : "M104銀河全域 — E16・Eros-7・ビブリオ・Solaris"}
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {TAGS.map((tag) => (
            <span key={tag.label} className="edu-tag">
              <tag.icon className="w-3 h-3" />
              {lang === "en" && tag.labelEn ? tag.labelEn : tag.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
