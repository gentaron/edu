"use client"
import { useState, useEffect } from "react"
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
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-edu-bg border-b border-edu-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-semibold text-edu-text hover:text-edu-accent transition-colors tracking-widest shrink-0"
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
                  className={`relative px-2.5 py-1 text-xs tracking-wide transition-all rounded-md ${
                    isActive ? "text-edu-accent" : "text-edu-muted hover:text-edu-text"
                  }`}
                >
                  {s.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, transparent, #c8a44e, transparent)",
                      }}
                    />
                  )}
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

        {/* Mobile menu — fullscreen overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-12 bg-edu-bg/95 backdrop-blur-2xl z-40">
            <div className="flex flex-col p-6 gap-1">
              {SECTIONS.map((s) => {
                const isActive = pathname === s.href || pathname.startsWith(s.href + "/")
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                      isActive
                        ? "text-edu-accent bg-edu-accent/5 border-l-2 border-edu-accent"
                        : "text-edu-muted hover:text-edu-text hover:bg-edu-surface"
                    }`}
                  >
                    {s.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
