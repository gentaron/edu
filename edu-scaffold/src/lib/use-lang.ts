"use client"

import { useState, useEffect, useCallback } from "react"
import type { Lang } from "./lang"

export function useLang() {
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
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
  }, [])

  return { lang, setLang } as const
}
