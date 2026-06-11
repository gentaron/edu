"use client";

import { ExternalLink } from "lucide-react";

type Lang = "ja" | "en";

const originItems = [
  { era: "E319頃", eraEn: "Circa E319", title: "Alpha Kane時代 — Gigapolisに原初個体", titleEn: "Alpha Kane Era — Original entity in Gigapolis", desc: "新ZAMLT期のGigapolisにニニーの原初個体が存在していた。Alpha Kaneと深い関わりを持ちながらも、やがてその在り方に疑念を抱く。", descEn: "Ninny's original entity existed in Gigapolis during the New ZAMLT era. Had deep ties with Alpha Kane, but eventually began to question his path." },
  { era: "E319以降", eraEn: "After E319", title: "袂を分かち、別惑星へ離脱", titleEn: "Parted ways, departed to another planet", desc: "「あなたの道が間違っていることを理解してしまった」——Kaneとの決別を選び、別惑星へ単独で離脱。光の音符の長い旅が始まる。", descEn: "\"I came to understand that your path is wrong\" — Chose to part with Kane and departed alone for another planet. The long journey of the Light Note begins." },
  { era: "E522〜E528", eraEn: "E522–E528", title: "Gigapolisへ再帰還 — ミナと出会い第二世代へ", titleEn: "Returned to Gigapolis — Met Mina, joined 2nd Gen", desc: "現代のNinnyがGigapolisに再帰還。Mina Eureka Ernstと運命的な出会いを果たし、AURALIS第二世代に加入。", descEn: "The modern Ninny returned to Gigapolis. Had a fateful encounter with Mina Eureka Ernst and joined AURALIS 2nd Generation." },
];

const scenes = [
  { title: "監獄編 — 内省と復讐の苦悩", titleEn: "Prison Arc — Introspection and Revenge", episode: "第72話", image: "/images/ninny-forest.webp", desc: "薄暗い独房で過去のしがらみと復讐心に囚われ続けるニニー。カトリーナとの対話でアルファとの別れを回想。", descEn: "Ninny, trapped by past baggage and revenge in a dim cell, recalls parting with Alpha through dialogue with Katrina.", core: "感情の葛藤と内面的強さ", coreEn: "Emotional conflict and inner strength" },
  { title: "シルバープラント地下戦 — 復讐の剣撃", titleEn: "Silver Plant Underground Battle", episode: "第20話", image: "/images/ninny-action.webp", desc: "「終点はお前のほうだ！」——次元操作を封じる伴共役を発動し、勝利に貢献。", descEn: "\"The endpoint is you!\" — Activated symbiotic suppression, contributing to victory." },
  { title: "アイリス戦＆防衛戦 — 連携と冷静な判断", titleEn: "Iris Battle & Defense — Cooperation and Cool Judgment", episode: "第26話・41話", image: "/images/ninny-ocean.webp", desc: "ヨシロウとの剣・刀の連携攻撃。隕石群の軌道を計算し最適アプローチを決定するなど戦術的頭脳を発揮。", descEn: "Coordinated sword and blade attacks with Yoshiro. Calculated asteroid trajectories — demonstrated tactical brilliance." },
];

const galleryImages = [
  { src: "/images/ninny-flying.webp", alt: "Ninny flying" },
  { src: "/images/ninny-sunset.webp", alt: "Ninny at sunset" },
  { src: "/images/ninny-lightning.webp", alt: "Ninny with lightning" },
  { src: "/images/ninny-pose.webp", alt: "Ninny power pose" },
  { src: "/images/ninny-beach.webp", alt: "Ninny at the beach" },
  { src: "/images/ninny-energy.webp", alt: "Ninny channeling energy" },
];

const auralisMembers = [
  { name: "Kate Patton", url: "https://katepatton.lovable.app", desc: "AURALIS 第二世代" },
  { name: "Lillie Ardent", url: "https://lillieardentsuper.lovable.app", desc: "AURALIS 第二世代" },
  { name: "Ninny Offenbach", url: null, desc: "AURALIS 第二世代 — 光の音符", current: true },
  { name: "Kate Claudia", url: "https://kate1st.netlify.app/", desc: "AURALIS 第二世代" },
  { name: "Layla Virel Nova & Mina", url: null, desc: "AURALIS 第二世代" },
];

export default function NinnyOffenbachPage({ lang }: { lang: Lang }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background, #0a0a0f)", color: "var(--foreground, #e5e5e5)" }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ninny-flying.webp" alt="Ninny Offenbach flying" className="w-full h-full object-cover object-top opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,140,50,0.08) 0%, transparent 60%)" }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-sm tracking-[0.4em] uppercase text-white/40 mb-4">AURALIS {lang === "en" ? "2nd Gen × Eternal Dominion Universe" : "第二世代 × Eternal Dominion Universe"}</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)" }}>Ninny Offenbach</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-4">
            {lang === "en"
              ? "The Light Note — Innocent with explosive vitality. A clone-inherited soul that survived the Alpha Kane era."
              : "光の音符 — 無邪気で爆発的な活力。Alpha Kane時代を生き延びたクローン継承の魂。"}
          </p>
          <div className="flex items-center justify-center gap-3 text-white/40 text-sm">
            <span>{lang === "en" ? "Tier 2 (Primary Active)" : "Tier 2（主要活動層）"}</span>
            <span className="text-amber-400">◆</span>
            <span>{lang === "en" ? "E16 Binary System / E528 Present" : "E16連星系 / E528現在"}</span>
            <span className="text-amber-400">◆</span>
            <span>Compact & Sprightly</span>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ninny-beach.webp" alt="Ninny at the beach" className="relative rounded-lg w-full" style={{ boxShadow: "0 0 40px rgba(59,130,246,0.15)" }} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>{lang === "en" ? "The Light — Mood Maker" : "表の顔 — 光のムードメーカー"}</span>
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>{lang === "en" ? "Bright and playful mood maker. Injects joy and optimism into all creative works, bringing youthful vitality that balances the group's refined aesthetics." : "明るく遊び心満載のムードメーカー。あらゆる創作に喜びと楽観を注ぎ込み、集団の洗練された美学に若々しい活力でバランスをもたらす。"}</p>
              <p>{lang === "en" ? "A quicksilver movement that makes everyone smile — the 'Light Note.' Small, agile body carrying youthful exuberance." : "クイックシルバーのような軽やかな動きで、みんなを笑顔にする「光の音符」。小柄で軽やかな体躯に、youthful exuberanceを宿す。"}</p>
            </div>
            <div className="mt-8 flex gap-3 flex-wrap">
              {(lang === "en" ? ["Mood Maker", "Light Note", "Youthful Exuberance", "Quicksilver", "Innocent & Explosive"] : ["ムードメーカー", "光の音符", "Youthful Exuberance", "クイックシルバー", "無邪気で爆発的"]).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #8b5cf6)" }}>{lang === "en" ? "Origin — Original Entity & Clone Inheritance" : "来歴 — 原初個体とクローン継承"}</span>
          </h2>
          <p className="text-center text-white/30 mb-12">{lang === "en" ? "Eternal Dominion Universe — E16 Binary System" : "Eternal Dominion Universe — E16連星系統合年表より"}</p>
          <div className="space-y-8">
            {originItems.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-28 text-right">
                  <span className="text-xs tracking-wider text-amber-400">{lang === "en" ? item.eraEn : item.era}</span>
                </div>
                <div className="flex-shrink-0 mt-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>
                <div className="pb-4 border-b border-white/5 flex-1">
                  <h4 className="text-base text-white/90 mb-2">{lang === "en" ? item.titleEn : item.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{lang === "en" ? item.descEn : item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Side */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #ef4444, #8b5cf6)" }}>{lang === "en" ? "The Shadow — Revengeful Swordsman" : "裏の顔 — 復讐の剣士"}</span>
            </h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>{lang === "en" ? "On the edge of the 'Symphony of Stars' world, wielding blades of light to recover lost melodies." : "「星々の交響曲」の世界の端で、失われたメロディーを取り戻すために光の音の刃を振るった過去を持つ。"}</p>
              <blockquote className="border-l-2 border-purple-500/60 pl-4 italic text-white/50 my-6">
                {lang === "en"
                  ? "\"I understood your path once. But I came to understand that your path is wrong. I can no longer walk with you.\""
                  : "「私はあなたの道を信じていた。でも、あなたの道が間違っていることを理解してしまった。私はもう、あなたと一緒に歩むことはできない」"}
              </blockquote>
              <p>{lang === "en" ? "Imprisoned by revenge in the 'Sound Prison,' but found the strength to transform inner curses into light." : "復讐心に駆られ「音の牢獄」に閉じ込められた時期も。だが心の呪いを光に変える強さを手に入れた。"}</p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ninny-energy.webp" alt="Ninny channeling energy" className="relative rounded-lg w-full" style={{ boxShadow: "0 0 40px rgba(239,68,68,0.2)" }} />
          </div>
        </div>
      </section>

      {/* Scenes */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>{lang === "en" ? "Key Scenes" : "活躍シーン"}</span>
          </h2>
          <p className="text-center text-white/30 mb-16">{lang === "en" ? "From 'Symphony of Stars' — 3 Major Scenes" : "現実ノーツ版『星々の交響曲』より — 3大シーン"}</p>
          <div className="space-y-20">
            {scenes.map((scene, i) => (
              <div key={i} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[direction-rtl]" : ""}`}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={scene.image} alt={scene.title} className="relative rounded-lg w-full" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <span className="text-xs text-amber-400 tracking-widest uppercase">{scene.episode}</span>
                  <h3 className="text-2xl font-bold text-white/90 mt-2 mb-4">{lang === "en" ? scene.titleEn : scene.title}</h3>
                  <p className="text-white/60 leading-relaxed mb-4">{lang === "en" ? scene.descEn : scene.desc}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs text-amber-400">{lang === "en" ? scene.coreEn : scene.core}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>Gallery</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AURALIS Members */}
      <section className="py-20 px-6 relative">
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>AURALIS Members</span>
          </h2>
          <p className="text-center text-white/30 mb-16">{lang === "en" ? "2nd Generation — Eternal Dominion Universe / E16 Binary System" : "第二世代 — Eternal Dominion Universe / E16連星系"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {auralisMembers.map((m) => (
              <div key={m.name} className={`rounded-lg p-5 text-center border transition-colors ${m.current ? "border-amber-500/50 bg-amber-500/5" : m.url ? "border-white/10 hover:border-purple-400/40 bg-white/[0.02] cursor-pointer" : "border-white/5 bg-white/[0.01] opacity-60"}`} {...(m.url ? { onClick: () => window.open(m.url, "_blank", "noopener") } : {})}>
                <span className="text-amber-400 text-lg mb-2 block">◆</span>
                <h3 className="text-sm font-bold text-white/90 mb-1">{m.name}</h3>
                <p className="text-[10px] text-white/40">{m.desc}</p>
                {m.current && <span className="inline-block mt-2 text-[10px] text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">This site</span>}
                {m.url && !m.current && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-purple-400/70">Visit <ExternalLink className="w-2.5 h-2.5" /></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg mb-1">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>Ninny Offenbach</span>
            <span className="text-white/40"> — AURALIS {lang === "en" ? "2nd Gen" : "第二世代"}</span>
          </p>
          <p className="text-xs text-white/20 mb-4">{lang === "en" ? "E16 Binary System / E528 — Liminal Forge Temporal Broadcast" : "E16連星系 / E528現在 — Liminal Forge 時空放送プロジェクト"}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-4">
            {[
              { name: "Kate Patton", url: "https://katepatton.lovable.app" },
              { name: "Lillie Ardent", url: "https://lillieardentsuper.lovable.app" },
              { name: "Kate Claudia", url: "https://kate1st.netlify.app/" },
            ].map((m) => (
              <a key={m.name} href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/25 hover:text-amber-400 transition-colors inline-flex items-center gap-1">{m.name} <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
