"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe2, Users, LayoutGrid, Search, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/use-lang"
import { LangToggle } from "@/platform/lang-toggle"

const SECTIONS = [
  { id: "universe", label: "宇宙構造", labelEn: "Universe", href: "/universe" },
  { id: "civilizations", label: "文明圏", labelEn: "Civilizations", href: "/civilizations" },
  { id: "timeline", label: "年表", labelEn: "Timeline", href: "/timeline" },
  { id: "auralis", label: "AURALIS", labelEn: "AURALIS", href: "/auralis" },
  { id: "mina", label: "ミナ", labelEn: "Mina", href: "/mina" },
  { id: "liminal", label: "リミナル", labelEn: "Liminal", href: "/liminal" },
  { id: "iris", label: "アイリス", labelEn: "Iris", href: "/iris" },
  { id: "characters", label: "キャラ", labelEn: "Characters", href: "/characters" },
  { id: "factions", label: "勢力", labelEn: "Factions", href: "/factions" },
  { id: "technology", label: "技術", labelEn: "Technology", href: "/technology" },
  { id: "card-game-link", label: "Card Game", labelEn: "Card Game", href: "/card-game" },
  { id: "wiki-link", label: "Wiki", labelEn: "Wiki", href: "/wiki" },
  { id: "story-link", label: "Story", labelEn: "Story", href: "/story" },
  { id: "ranking-link", label: "番付", labelEn: "Ranking", href: "/ranking" },
]

type NavGroup = {
  id: string
  label: string
  labelEn: string
  icon: React.ComponentType<{ className?: string }>
  items: (typeof SECTIONS)[number][]
}

const MOBILE_GROUPS: NavGroup[] = [
  {
    id: "world",
    label: "世界",
    labelEn: "World",
    icon: Globe2,
    items: [
      SECTIONS.find((s) => s.id === "universe")!,
      SECTIONS.find((s) => s.id === "civilizations")!,
      SECTIONS.find((s) => s.id === "timeline")!,
    ],
  },
  {
    id: "characters",
    label: "キャラクター",
    labelEn: "Characters",
    icon: Users,
    items: [
      SECTIONS.find((s) => s.id === "auralis")!,
      SECTIONS.find((s) => s.id === "mina")!,
      SECTIONS.find((s) => s.id === "liminal")!,
      SECTIONS.find((s) => s.id === "iris")!,
      SECTIONS.find((s) => s.id === "characters")!,
      SECTIONS.find((s) => s.id === "factions")!,
    ],
  },
  {
    id: "systems",
    label: "ツール",
    labelEn: "Tools",
    icon: LayoutGrid,
    items: [
      SECTIONS.find((s) => s.id === "technology")!,
      SECTIONS.find((s) => s.id === "card-game-link")!,
      SECTIONS.find((s) => s.id === "wiki-link")!,
      SECTIONS.find((s) => s.id === "story-link")!,
      SECTIONS.find((s) => s.id === "ranking-link")!,
    ],
  },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { lang, setLang } = useLang()

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }
    window.addEventListener("resize", handler, { passive: true })
    return () => window.removeEventListener("resize", handler)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-edu-bg/80 backdrop-blur-xl border-b edu-nav-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-11 sm:h-12">
            <Link
              href="/"
              onClick={closeMobile}
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
                    {lang === "en" && s.labelEn ? s.labelEn : s.label}
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
              <div className="ml-2">
                <LangToggle lang={lang} setLang={setLang} />
              </div>
            </div>

            {/* Mobile toggle — larger touch target */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 -mr-2 text-edu-muted hover:text-edu-text transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in panel */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-[70] w-[85vw] max-w-[320px] bg-edu-surface border-l border-edu-border transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-edu-border/50">
          <span className="text-sm font-semibold text-edu-text tracking-widest">EDU</span>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <button
              onClick={closeMobile}
              className="flex items-center justify-center w-9 h-9 text-edu-muted hover:text-edu-text transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search link */}
        <div className="px-3 pt-3">
          <Link
            href="/wiki"
            onClick={closeMobile}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-edu-muted hover:text-edu-text hover:bg-edu-card transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{lang === "en" ? "Search Wiki..." : "Wikiを検索..."}</span>
          </Link>
        </div>

        {/* Scrollable nav groups */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 pt-2 pb-8">
          {MOBILE_GROUPS.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.id} className="mb-4">
                {/* Group header */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                  <Icon className="w-3.5 h-3.5 text-edu-accent" />
                  <span className="text-[11px] font-semibold text-edu-accent tracking-wider uppercase">
                    {lang === "en" ? group.labelEn : group.label}
                  </span>
                </div>

                {/* Group items */}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((s) => {
                    const isActive = pathname === s.href || pathname.startsWith(s.href + "/")
                    return (
                      <Link
                        key={s.id}
                        href={s.href}
                        onClick={closeMobile}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? "text-edu-accent bg-edu-accent/10 font-medium"
                            : "text-edu-text-dim hover:text-edu-text hover:bg-edu-card"
                        }`}
                      >
                        <span>{lang === "en" && s.labelEn ? s.labelEn : s.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-edu-accent shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel footer — home link */}
        <div className="border-t border-edu-border/50 px-5 py-3">
          <Link
            href="/"
            onClick={closeMobile}
            className={`flex items-center gap-2 text-sm transition-colors ${
              pathname === "/" ? "text-edu-accent" : "text-edu-muted hover:text-edu-text"
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>{lang === "en" ? "Home" : "トップ"}</span>
          </Link>
        </div>
      </div>
    </>
  )
}
