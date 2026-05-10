"use client"

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react"
import type { Lang } from "./lang"

/* ═══════════════════════════════════════════
   LangContext — global language state
   All components share the same Lang via Context,
   so toggling in the nav bar updates every page instantly.
   ═══════════════════════════════════════════ */

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ja",
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("edu-lang") as Lang | null
      if (saved === "en" || saved === "ja") {
        return saved
      }
    }
    return "ja"
  })

  useEffect(() => {
    localStorage.setItem("edu-lang", lang)
    // Update <html lang> attribute to match
    document.documentElement.lang = lang === "en" ? "en" : "ja"
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
  }, [])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
