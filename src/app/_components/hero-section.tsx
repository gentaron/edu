import React from "react"
import { Star, Globe2, Zap, Radio, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider text-edu-text mb-4 leading-tight">
          Eternal Dominion
          <br />
          Universe
        </h1>
        <hr className="edu-divider mx-auto w-24 mb-6" />
        <p className="text-lg sm:text-xl text-edu-muted font-light tracking-widest mb-2">
          統合時空構造書 v3.0
        </p>
        <p className="text-sm sm:text-base text-edu-accent2 tracking-wide mb-8">
          M104銀河全域 — E16・Eros-7・ビブリオ・Solaris
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="edu-tag">
            <Star className="w-3 h-3 mr-1 inline-block align-text-bottom" />
            E16連星系
          </span>
          <span className="edu-tag">
            <Globe2 className="w-3 h-3 mr-1 inline-block align-text-bottom" />
            Eros-7
          </span>
          <span className="edu-tag">
            <Zap className="w-3 h-3 mr-1 inline-block align-text-bottom" />
            AURALIS
          </span>
          <span className="edu-tag">
            <Radio className="w-3 h-3 mr-1 inline-block align-text-bottom" />
            Liminal Forge
          </span>
          <span className="edu-tag">
            <Shield className="w-3 h-3 mr-1 inline-block align-text-bottom" />
            Iris Worlds
          </span>
        </div>
      </div>
    </section>
  )
}
