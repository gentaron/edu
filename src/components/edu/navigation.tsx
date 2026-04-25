"use client"
import { useState } from "react"
import Link from "next/link"
import { Star, Menu, X } from "lucide-react"

const SECTIONS = [
  { id: "universe", label: "宇宙構造", href: "/universe" },
  { id: "timeline", label: "年表", href: "/timeline" },
  { id: "auralis", label: "AURALIS", href: "/auralis" },
  { id: "mina", label: "ミナ", href: "/mina" },
  { id: "liminal", label: "リミナル・フォージ", href: "/liminal" },
  { id: "iris", label: "アイリス", href: "/iris" },
  { id: "characters", label: "キャラクター", href: "/characters" },
  { id: "factions", label: "勢力系譜", href: "/factions" },
  { id: "technology", label: "技術体系", href: "/technology" },
  { id: "card-game-link", label: "Card Game", href: "/card-game" },
  { id: "wiki-link", label: "Wiki", href: "/wiki" },
  { id: "story-link", label: "Story", href: "/story" },
  { id: "ranking-link", label: "長者番付", href: "/ranking" },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cosmic-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Star className="w-5 h-5 text-nebula-purple" />
            <span className="text-sm font-bold text-cosmic-gradient hidden sm:block">EDU</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all rounded-md hover:bg-cosmic-surface ${
                  s.id === "wiki-link"
                    ? "text-gold-accent hover:text-gold-accent/80"
                    : s.id === "story-link"
                      ? "text-cyan-400 hover:text-cyan-300"
                      : s.id === "ranking-link"
                        ? "text-emerald-400 hover:text-emerald-300"
                        : s.id === "card-game-link"
                          ? "text-orange-400 hover:text-orange-300"
                          : "text-cosmic-muted hover:text-electric-blue"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  s.id === "wiki-link"
                    ? "text-gold-accent bg-cosmic-surface"
                    : s.id === "story-link"
                      ? "text-cyan-400 bg-cosmic-surface"
                      : s.id === "ranking-link"
                        ? "text-emerald-400 bg-cosmic-surface"
                        : s.id === "card-game-link"
                          ? "text-orange-400 bg-cosmic-surface"
                          : "text-cosmic-muted hover:bg-cosmic-surface"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
