import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { SECTION_PAGES } from "./home-data"

export function FooterSection() {
  return (
    <footer className="py-12 px-4">
      <hr className="edu-divider mb-8" />
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm font-bold text-edu-text">
          Eternal Dominion Universe 統合時空構造書 v3.0
        </p>
        <p className="text-xs text-edu-muted">AURALIS 地球2026交信プロジェクト設定書 v2.0</p>
        <div className="flex justify-center gap-4 text-xs text-edu-muted">
          <Link href="/wiki" className="edu-link">
            Wiki
          </Link>
          <span className="text-edu-border">|</span>
          <Link href="/story/IRIS_1" className="edu-link">
            Story
          </Link>
          <span className="text-edu-border">|</span>
          <span>E528 / AD2026</span>
          <span className="text-edu-border">|</span>
          <span>光と音を永遠にする</span>
        </div>
        <div className="flex justify-center flex-wrap gap-3 pt-2">
          {SECTION_PAGES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-[10px] text-edu-muted hover:text-edu-accent transition-colors"
            >
              {s.title}
            </Link>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-edu-border">
          <p className="text-[10px] tracking-[0.2em] uppercase text-edu-muted/60 mb-3">Universe Sites</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px]">
            <a href="https://auralis-eternal-light.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">AURALIS <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://e16super.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">E16 Portal <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://eurekaspace.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Eureka Space <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://laylaland.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Layla Land <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://irisworlds.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Iris Worlds <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://game-of-mina.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Game of Mina <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://orbital-eternity.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Orbital Eternity <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px]">
            <a href="https://katepatton.lovable.app" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Kate Patton <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://lillieardentsuper.lovable.app" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Lillie Ardent <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://ninnyoffenbach.lovable.app" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Ninny Offenbach <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
            <a href="https://kate1st.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-edu-muted hover:text-edu-accent transition-colors inline-flex items-center gap-1">Kate Claudia <ExternalLink className="w-2.5 h-2.5 opacity-40" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
