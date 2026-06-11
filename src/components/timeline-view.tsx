"use client";

import { useMemo } from "react";
import { TIMELINE_DATA, locColor } from "@/lib/timeline-data";
import { type Lang, tl } from "@/lib/lang";

export default function TimelineView({ lang }: { lang: Lang }) {
  const periods = useMemo(() => TIMELINE_DATA.map((p) => ({
    ...p,
    events: p.events.map((ev) => ({
      text: lang === "en" ? ev.textEn : ev.text,
      loc: ev.loc,
    })),
  })), [lang]);

  return (
    <div className="min-h-screen bg-[#08080d] text-white">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-white/90 mb-1">
          {tl("統合年表", "Integrated Timeline", lang)}
        </h1>
        <p className="text-xs text-white/40 mb-8">
          {lang === "en"
            ? "E16 binary system human history — AD 3500 to present E528"
            : "E16連星系の人類史 — AD 3500からE528現代まで"}
        </p>

        <div className="space-y-4">
          {periods.map((period, idx) => (
            <details key={idx} className={`group rounded-xl border overflow-hidden transition-all duration-300 ${period.borderColor} bg-white/[0.02]`}>
              <summary className="px-6 py-4 cursor-pointer hover:bg-white/[0.04] transition-colors select-none list-none">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className={`font-bold text-sm sm:text-base ${period.color}`}>
                    {lang === "en" && period.periodEn ? period.periodEn : period.period}
                  </span>
                  <span className="text-xs text-white/40">
                    {lang === "en" && period.rangeEn ? period.rangeEn : period.range}
                  </span>
                </div>
              </summary>
              <div className="px-6 pb-4">
                <div className="space-y-2.5 ml-2 border-l-2 border-white/10 pl-4">
                  {period.events.map((ev, evIdx) => (
                    <div key={evIdx} className="flex flex-wrap gap-2 text-sm items-start">
                      <span className="text-white/40 mt-0.5 shrink-0">▸</span>
                      {ev.loc && (
                        <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${locColor[ev.loc] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                          {ev.loc}
                        </span>
                      )}
                      <span className="text-white/70">{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
