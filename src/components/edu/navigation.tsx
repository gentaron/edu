"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const SECTIONS = [
  { id: "universe", label: "宇宙構造", href: "/universe" },
  { id: "civilizations", label: "文明圏", href: "/civilizations" },
  { id: "timeline", label: "年表", href: "/timeline" },
  { id: "auralis", label: "AURALIS", href: "/auralis" },
  { id: "mina", label: "ミナ", href: "/mina" },
  { id: "liminal", label: "リミナル", href: "/liminal" },
  { id: "iris", label: "アイリス", href: "/iris" },
  { id: "characters", label: "キャラ", href: "/characters" },
  { id: "factions", label: "勢力", href: "/factions" },
  { id: "technology", label: "技術", href: "/technology" },
  { id: "card-game-link", label: "Card Game", href: "/card-game" },
  { id: "wiki-link", label: "Wiki", href: "/wiki" },
  { id: "story-link", label: "Story", href: "/story" },
  { id: "ranking-link", label: "番付", href: "/ranking" },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-edu-border bg-edu-bg/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link
            href="/"
            className="text-sm font-medium text-edu-text hover:text-edu-accent transition-colors shrink-0 tracking-wide"
          >
            EDU
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {SECTIONS.map((s) => {
              const isActive = pathname === s.href || pathname.startsWith(s.href + "/")
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  className={`px-2.5 py-1 text-xs tracking-wide transition-colors rounded ${
                    isActive
                      ? "text-edu-text bg-edu-surface"
                      : "text-edu-muted hover:text-edu-accent"
                  }`}
                >
                  {s.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 text-edu-muted hover:text-edu-text transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 flex flex-wrap gap-1">
            {SECTIONS.map((s) => {
              const isActive = pathname === s.href || pathname.startsWith(s.href + "/")
              return (
                <Link
                  key={s.id}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    isActive
                      ? "text-edu-text bg-edu-surface"
                      : "text-edu-muted hover:text-edu-accent hover:bg-edu-surface"
                  }`}
                >
                  {s.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
