import React from "react"
import Link from "next/link"
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
      </div>
    </footer>
  )
}
