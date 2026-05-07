"use client"

import type { Lang } from "@/lib/lang"

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center border border-white/10 rounded-full overflow-hidden shrink-0 backdrop-blur-md bg-white/5">
      <button
        type="button"
        onClick={() => setLang("ja")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "ja"
            ? "bg-white/15 text-white shadow-inner"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        JP
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
          lang === "en"
            ? "bg-white/15 text-white shadow-inner"
            : "text-white/40 hover:text-white/70"
        }`}
      >
        EN
      </button>
    </div>
  )
}
