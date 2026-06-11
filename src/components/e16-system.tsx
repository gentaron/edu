"use client";

import { useMemo } from "react";

interface StarDot { id: number; x: number; y: number; size: number; opacity: number; animDuration: number; animDelay: number }

function StarField() {
  const stars = useMemo<StarDot[]>(() => Array.from({ length: 120 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.2, animDuration: Math.random() * 4 + 2, animDelay: Math.random() * 5,
  })), []);

  const nebulae = useMemo(() => [
    { cx: 15, cy: 20, rx: 22, ry: 14, color: "rgba(74,158,191,0.06)" },
    { cx: 75, cy: 65, rx: 28, ry: 18, color: "rgba(192,57,43,0.05)" },
    { cx: 55, cy: 10, rx: 20, ry: 12, color: "rgba(255,179,71,0.04)" },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`@keyframes starTwinkle { 0% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs><filter id="nebula-blur"><feGaussianBlur stdDeviation="40" /></filter></defs>
        <rect width="100%" height="100%" fill="#020813" />
        {nebulae.map((n, i) => <ellipse key={i} cx={`${n.cx}%`} cy={`${n.cy}%`} rx={`${n.rx}%`} ry={`${n.ry}%`} fill={n.color} filter="url(#nebula-blur)" />)}
        {stars.map((star) => <circle key={star.id} cx={`${star.x}%`} cy={`${star.y}%`} r={star.size} fill="white" opacity={star.opacity} style={{ animation: `starTwinkle ${star.animDuration}s ${star.animDelay}s ease-in-out infinite alternate` }} />)}
      </svg>
    </div>
  );
}

const eras = [
  { id: "origin", nameJa: "起源期", nameEn: "Origin Era", startYear: 0, endYear: 77, color: "#2D6A4F", description: "地球からの大移民。E16星系への入植開始。" },
  { id: "enlightenment", nameJa: "技術啓蒙時代", nameEn: "Tech Enlightenment", startYear: 78, endYear: 150, color: "#1A535C", description: "バイオエンジニアリングと次元技術の爆発的進化。" },
  { id: "prosperity3", nameJa: "第三繁栄期", nameEn: "3rd Prosperity", startYear: 151, endYear: 204, color: "#4A4E69", description: "マーストリヒト革命と自由経済の確立。" },
  { id: "pax", nameJa: "パクス・ロンバルディカ", nameEn: "Pax Lombardica", startYear: 205, endYear: 318, color: "#6B4226", description: "企業国家の全盛期。" },
  { id: "zamlt", nameJa: "ZAMLT・抵抗期", nameEn: "ZAMLT / Resistance", startYear: 301, endYear: 400, color: "#7B2D8B", description: "ZAMLT独裁体制。AURALIS第一世代。" },
  { id: "evatron", nameJa: "エヴァトロン支配期", nameEn: "Evatron Age", startYear: 400, endYear: 475, color: "#8B1A1A", description: "エヴァトロンの銀河支配。" },
  { id: "mina", nameJa: "ミナの時代", nameEn: "Mina's Era", startYear: 475, endYear: 528, color: "#1A3A5C", description: "リミナル・フォージ立ち上げ。" },
];

const keyEvents = [
  { eYear: 0, title: "大移民・E16星系到着", titleEn: "Great Migration · Arrival at E16" },
  { eYear: 150, title: "マーストリヒト革命", titleEn: "Maastricht Revolution" },
  { eYear: 270, title: "AURALIS Proto発足", titleEn: "AURALIS Proto Founded" },
  { eYear: 290, title: "AURALIS第1世代組織化", titleEn: "AURALIS 1st Gen Organized" },
  { eYear: 318, title: "アルファ・ケイン覚醒", titleEn: "Alpha Kane Awakens" },
  { eYear: 335, title: "セリア黄金期開始", titleEn: "Celia's Golden Age Begins" },
  { eYear: 400, title: "AURALIS解体・ケイト消息不明", titleEn: "AURALIS Dismantled" },
  { eYear: 475, title: "エヴァトロン崩壊", titleEn: "Evatron Collapses" },
  { eYear: 499, title: "ミナ誕生", titleEn: "Mina Born" },
  { eYear: 525, title: "リミナル・フォージ立ち上げ", titleEn: "Liminal Forge Launched" },
];

const planets = [
  { name: "ヴェレクス", color: "#8B7355", size: 4 },
  { name: "アレネックス", color: "#CD7F32", size: 5 },
  { name: "星々の交響曲", color: "#4A9EBF", size: 9, key: true },
  { name: "エロス7", color: "#C0392B", size: 7, key: true },
  { name: "グラシウス", color: "#7EC8E3", size: 5 },
  { name: "マグノル", color: "#E8A44A", size: 11 },
  { name: "ウンブリクス", color: "#5D4E6D", size: 6 },
];

type Lang = "ja" | "en";

export default function E16SystemPage({ lang }: { lang: Lang }) {
  return (
    <div className="relative min-h-screen text-white" style={{ background: "#020813" }}>
      <StarField />

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-px h-8 bg-amber-400/40" />
            <span className="text-amber-300/60 text-xs tracking-[0.4em] uppercase">M104 Galaxy — Halo Region — Binary Star System</span>
            <div className="w-px h-8 bg-amber-400/40" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-white/90">E16</span>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FFB347 0%, #4A9EBF 100%)" }}> 星系</span>
          </h1>
          <p className="text-white/40 text-lg">{lang === "en" ? "Symphony of Stars — The cradle of E16 civilization" : "交響の星（Symphony of Stars）— E16文明のゆりかご"}</p>
        </div>
      </section>

      {/* Solar System Diagram */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white/80">
            {lang === "en" ? "Solar System — 7 Planets" : "惑星系 — 7惑星"}
          </h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-full bg-amber-400/80 shadow-[0_0_16px_rgba(255,179,71,0.6)]" title="Ea16 (K2)" />
            <div className="w-5 h-5 rounded-full bg-red-400/60 shadow-[0_0_10px_rgba(255,107,107,0.5)]" title="Eb16 (M3)" />
            <div className="flex items-center gap-2 ml-4">
              {planets.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full transition-transform hover:scale-125"
                    style={{
                      width: p.size * 3,
                      height: p.size * 3,
                      background: p.color,
                      boxShadow: p.key ? `0 0 ${p.size}px ${p.color}80` : "none",
                    }}
                  />
                  <span className={`text-[9px] ${p.key ? "text-white/70" : "text-white/30"} whitespace-nowrap`}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chronicle Timeline */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-3 text-center text-white/80">
            {lang === "en" ? "Chronicle — E0 to E528" : "クロニクル — E0からE528"}
          </h2>
          <p className="text-center text-white/30 text-sm mb-12">{lang === "en" ? "Key events in E16 binary system history (AD3500–AD4028)" : "E16連星系の歴史的軌跡 (AD3500–AD4028)"}</p>

          {/* Era bars */}
          <div className="space-y-3 mb-12">
            {eras.map((era) => (
              <div key={era.id} className="relative">
                <div className="flex items-center gap-3">
                  <div className="w-20 sm:w-28 text-right text-xs font-mono text-white/30 shrink-0">E{era.startYear}–E{era.endYear}</div>
                  <div className="flex-1 h-8 rounded overflow-hidden" style={{ background: era.color + "20" }}>
                    <div className="h-full rounded flex items-center px-3" style={{ background: era.color + "40", width: `${((era.endYear - era.startYear) / 528) * 100}%`, minWidth: "80px" }}>
                      <span className="text-[10px] font-bold truncate" style={{ color: era.color }}>{lang === "en" ? era.nameEn : era.nameJa}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/20 mt-0.5 ml-[calc(7rem+0.75rem)] sm:ml-[calc(7.5rem+0.75rem)]">{lang === "en" ? era.description : era.description}</p>
              </div>
            ))}
          </div>

          {/* Key Events */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-white/10 to-transparent" />
            <div className="space-y-6">
              {keyEvents.map((ev, i) => {
                const era = eras.find((e) => ev.eYear >= e.startYear && ev.eYear <= e.endYear);
                return (
                  <div key={i} className={`relative grid grid-cols-[1fr_auto] gap-4 items-start ${i % 2 === 1 ? "direction-rtl" : ""}`}>
                    <div className={i % 2 === 1 ? "text-right" : ""}>
                      <div className={`inline-flex flex-col ${i % 2 === 1 ? "items-end" : "items-start"}`}>
                        <span className="text-xs font-bold text-white/60">E{ev.eYear}</span>
                        <span className="text-sm text-white/80 font-medium">{lang === "en" ? ev.titleEn : ev.title}</span>
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-1 -translate-x-1/2 w-3 h-3 rounded-full border-2" style={{ borderColor: era?.color || "#666", background: "#020813" }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-white/30 text-xs">{lang === "en" ? "E16 Star System — EDU Integrated Wiki" : "E16星系 歴史記録 — EDU統合版Wiki準拠"}</p>
          <div className="flex items-center justify-center gap-3 text-[10px] text-white/20">
            <span>{lang === "en" ? "Liminal Forge — Temporal Broadcast from E528" : "リミナル・フォージ — 時相放送 — E528"}</span>
            <span>·</span>
            <span>AURALIS — Make Light and Sound Eternal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
