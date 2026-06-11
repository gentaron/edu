"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, X } from "lucide-react";

const kateTimeline = [
  { year: "E270", title: "AURALISの誕生", titleEn: "Birth of AURALIS", desc: "ケイトとリリー・アーデントが、ギガポリスの小さな集会スペースで出会う。五人にも満たない集団「AURALIS」が静かに産声を上げた。", descEn: "Kate and Lillie Ardent meet in a small gathering space in Gigapolis. The group 'AURALIS,' fewer than five people, quietly takes its first breath." },
  { year: "E290", title: "第1期　正式組織化", titleEn: "1st Gen Formal Organization", desc: "ロンバルディア帝国の余波が薄れる中、AURALISは第1期として正式組織化。ケイトは「設計者」と呼ばれることを許した。", descEn: "As the Lombardia Empire's influence wanes, AURALIS is formally organized as the 1st Generation. Kate allows herself to be called 'The Designer.'" },
  { year: "E325", title: "レイラ加入", titleEn: "Layla Joins", desc: "アルファ・ケインの反乱後、レイラ・ヴィレル・ノヴァ（ピンク・ヴォルテージ）がAURALISに加入。", descEn: "After Alpha Kane's rebellion, Layla Virel Nova (Pink Voltage) joins AURALIS." },
  { year: "E335–370", title: "黄金期", titleEn: "Golden Age", desc: "セリア・ドミニクスがアルファ・ケインを打倒し、セリノポリスに黄金期をもたらす。", descEn: "Celia Dominicus defeats Alpha Kane and brings the Golden Age to Selinopolis." },
  { year: "E400", title: "解体・消息不明", titleEn: "Dismantled · Disappeared", desc: "エバトロンがギガポリスを掌握。AURALIS 1期は解体を命じられ、ケイト・クラウディアとリリー・アーデントは逮捕。", descEn: "Evatron seizes Gigapolis. AURALIS 1st Gen is ordered to disband. Kate Claudia and Lillie Ardent are arrested." },
];

const chapters = [
  { chapter: "序章", chapterEn: "Prologue", title: "声なき時代に生まれた問い", titleEn: "The Question Born in a Voiceless Age", period: "E270年以前", periodEn: "Before E270", body: "E270年。交響の星（Symphony of Stars）の西大陸に広がるギガポリスは、ロンバルディア帝国の長い支配が終焉を迎えつつある混沌の中にあった。商業は乱立し、文化は断片化し、人々は「意味」を失いかけていた。その時代に、ケイト・クラウディアは生きていた。彼女は音楽家でも革命家でもなかった。ただ、問いを持つ人間だった。", bodyEn: "E270. The Gigapolis spreading across the Western Continent of Symphony of Stars was in chaos as the long rule of the Lombardia Empire neared its end. Commerce was fragmented, culture was splintered, and people were losing 'meaning.' In that era, Kate Claudia lived. She was neither a musician nor a revolutionary. She was simply a person with a question.", quote: "なぜ、この星には本当の意味で「届く」表現がないのだろう？", quoteEn: "Why is there no expression that truly 'reaches' people on this star?" },
  { chapter: "第一章", chapterEn: "Ch.1", title: "小さな創設", titleEn: "A Small Beginning", period: "E270年", body: "AURALISは、最初から「組織」ではなかった。ケイトが盟友リリー・アーデントと出会ったのは、ギガポリスの狭い路地にある、壁に音符が落書きされた小さな集会スペースだった。", bodyEn: "AURALIS was not an 'organization' from the start. Kate met her ally Lillie Ardent in a small gathering space in a narrow Gigapolis alley, with musical notes graffitied on the walls.", quote: "人の耳に翼を生やす。それだけのことをしたいんだ", quoteEn: "I just want to give wings to people's ears." },
  { chapter: "第二章", chapterEn: "Ch.2", title: "帝国の終わりと声の誕生", titleEn: "End of Empire and Birth of Voice", period: "E290年", body: "ロンバルディア帝国の余波が薄れ、ZAMLTユニオンが台頭しはじめた混乱期の中で、AURALISは正式に「第1期」として組織化された。ケイトはリーダーと呼ばれることを好まなかった。「設計者」と呼ばれることを許した。", bodyEn: "As the Lombardia Empire's influence faded and the ZAMLT Union began to rise, AURALIS was formally organized as the '1st Generation.' Kate didn't like being called a leader. She allowed herself to be called 'The Designer.'", quote: "光と音を永遠のものに（Make Light and Sound Eternal）", quoteEn: "Make Light and Sound Eternal" },
  { chapter: "終章", chapterEn: "Epilogue", title: "問いは、続く", titleEn: "The Question Continues", period: "E400年 / E528年現在", body: "E400年。エバトロンがギガポリスを掌握した。AURALIS 1期は解体を命じられた。ケイト・クラウディア初代とリリー・アーデント初代は、逮捕された。その後の消息は、記録から消えた。しかし彼女たちが守ったレイラは冷凍保存で生き延び、E528年現在もAURALIS 2期として活動を続けている。", bodyEn: "E400. Evatron seized Gigapolis. AURALIS 1st Gen was ordered to disband. Kate Claudia and Lillie Ardent were arrested. Their subsequent fate vanished from records. But Layla, whom they protected, survived in cryogenic preservation and continues her activities as AURALIS 2nd Gen as of E528.", quote: "来た、聴いた、続けた", quoteEn: "Came, Listened, Continued" },
];

const kateStats = [
  { label: "活動期間", labelEn: "Active Period", value: "E270–E400" },
  { label: "役割", labelEn: "Role", value: "設計者 / Founder" },
  { label: "所属", labelEn: "Affiliation", value: "AURALIS 第1期" },
  { label: "盟友", labelEn: "Allies", value: "Lillie Ardent / Layla Virel Nova" },
  { label: "ミッション", labelEn: "Mission", value: "光と音を永遠に" },
  { label: "時代", labelEn: "Era", value: "Symphony of Stars 西大陸" },
];

const kateQuotes = [
  { text: "刹那に生まれる感動を、時を超えて届ける存在であれ", textEn: "Be an existence that delivers emotions born in an instant, across time", context: "E290年 — AURALISの理念", contextEn: "E290 — AURALIS Philosophy" },
  { text: "あなたは嵐そのものだ。嵐はAURALISに必要だ", textEn: "You are the storm itself. AURALIS needs the storm", context: "E325年頃 — レイラとの初対面", contextEn: "Circa E325 — First meeting with Layla" },
];

const images = [
  { src: "/images/from-PixAI-2002575259721959112-0.png", label: "Stand By", alt: "Kate Claudia portrait" },
  { src: "/images/from-PixAI-2002574788326407153-1.png", label: "Charge", alt: "Kate Claudia" },
  { src: "/images/from-PixAI-2002574788326407153-2.png", label: "Strike", alt: "Kate Claudia" },
  { src: "/images/from-PixAI-2002575259721959112-3.png", label: "Surge", alt: "Kate Claudia" },
  { src: "/images/from-PixAI-2002574250635299453-0.png", label: "Apex", alt: "Kate Claudia" },
];

const members = [
  { name: "Kate Patton 新代", role: "安定化・基盤担当", roleEn: "Stabilization", url: "https://katepatton.lovable.app" },
  { name: "Lillie Ardent 新代", role: "感情増幅担当", roleEn: "Emotional Amplification", url: "https://lillieardentsuper.lovable.app" },
  { name: "Layla Virel Nova", role: "音楽放送担当", roleEn: "Music Broadcasting" },
  { name: "Mina Eureka Ernst", role: "総合プロデューサー", roleEn: "Executive Producer" },
  { name: "Ninny Offenbach", role: "拡散・バズ担当", roleEn: "Viral & Buzz", url: "https://ninnyoffenbach.lovable.app" },
];

type Lang = "ja" | "en";

export default function KateClaudiaPage({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0a18] to-[#0a0a0f]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(ellipse at 70% 50%, rgba(180,40,80,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(60,20,120,0.2) 0%, transparent 50%)` }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-px bg-gradient-to-b from-transparent via-red-900/20 to-transparent" style={{ left: `${(i / 12) * 100}%`, height: "100%", opacity: i % 3 === 0 ? 0.4 : 0.1 }} />
          ))}
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center py-24">
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-2">
              <p className="text-red-400/70 text-xs tracking-[0.4em] uppercase font-light">
                {lang === "en" ? "AURALIS 1st Gen — E270–E400 — The Designer" : "AURALIS 第1期 — E270–E400 — 設計者"}
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-none tracking-tight">
                <span className="block text-white/90">Kate</span>
                <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #e84060 0%, #ff6b8a 50%, #c82040 100%)" }}>Claudia</span>
                <span className="block text-white/40 text-2xl lg:text-3xl font-light mt-2 tracking-widest">ケイト・クラウディア</span>
              </h1>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-red-500 to-transparent" />
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              {lang === "en"
                ? <>First-generation Kate Claudia. The &ldquo;Designer&rdquo; of AURALIS.<br />Not a revolutionary, not a musician —<br /><span className="text-red-300/80">Simply someone who held a question.</span><br /><span className="text-white/40 text-sm">※ The new-era Kate continues under &ldquo;Kate Patton&rdquo;</span></>
                : <>初代ケイト・クラウディア。AURALISの「設計者」。<br />革命家でも音楽家でもなかった——<br /><span className="text-red-300/80">ただ、問いを持つ人間だった。</span><br /><span className="text-white/40 text-sm">※ 新代ケイトは「Kate Patton」名義で継承。</span></>}
            </p>
            <blockquote className="border-l-2 border-red-500/60 pl-6">
              <p className="text-white/80 text-xl italic leading-relaxed">
                {lang === "en" ? <>&ldquo;Be an existence that delivers emotions born in an instant, across time&rdquo;</> : <>「刹那に生まれる感動を、<br />時を超えて届ける存在であれ」</>}
              </p>
              <cite className="text-red-400/60 text-sm mt-2 block not-italic">{lang === "en" ? "— E290 AURALIS Philosophy" : "— E290年 AURALIS理念"}</cite>
            </blockquote>
          </div>
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-72 lg:w-96">
              <div className="absolute inset-0 rounded-sm opacity-60 blur-2xl" style={{ background: "radial-gradient(ellipse at center, rgba(200,40,80,0.4) 0%, rgba(100,20,160,0.2) 60%, transparent 100%)" }} />
              <div className="relative overflow-hidden border border-red-900/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0].src} alt={images[0].alt} className="w-full object-cover" style={{ aspectRatio: "3/4" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-red-400/70 tracking-widest uppercase">Kate Claudia</span>
                    <span className="text-xs text-white/30 tracking-widest">E270–E400</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t border-l border-red-500/40" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b border-r border-red-500/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">{lang === "en" ? "Visual Archive" : "Visual Archive"}</p>
            <h2 className="text-3xl font-bold text-white/90 tracking-tight">{lang === "en" ? "Kate Claudia" : "ケイト・クラウディア"}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((img) => (
              <button key={img.src} onClick={() => setActive(img.src)} className="group relative overflow-hidden border border-white/5 hover:border-red-500/40 transition-all duration-300" style={{ aspectRatio: "3/4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 text-white/80 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.label}</span>
              </button>
            ))}
          </div>
        </div>
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setActive(null)}>
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors" onClick={() => setActive(null)}><X size={28} /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active} alt="" className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </section>

      {/* Story */}
      <section className="py-20 bg-[#08080d]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">{lang === "en" ? "Chronicle" : "Chronicle"}</p>
            <h2 className="text-4xl font-bold text-white/90">{lang === "en" ? "Light and Sound, Eternal" : "音を、光を、永遠に"}</h2>
            <p className="text-white/40 mt-3 max-w-xl">{lang === "en" ? "The Story of the First Kate — A Question from E270" : "初代ケイトの物語 ——E270年から続く問い"}</p>
          </div>
          <div className="space-y-0">
            {chapters.map((ch, i) => (
              <div key={i} className="relative grid lg:grid-cols-[260px_1fr] gap-0 group">
                <div className="hidden lg:flex flex-col items-end pr-12 pt-8 pb-8">
                  <span className="text-red-500/40 text-xs tracking-[0.3em] uppercase">{lang === "en" ? ch.chapterEn : ch.chapter}</span>
                  <span className="text-white/20 text-sm mt-1 text-right">{lang === "en" ? ch.periodEn : ch.period}</span>
                </div>
                <div className="relative border-l border-white/5 pl-8 lg:pl-12 pt-8 pb-12 group-hover:border-red-900/30 transition-colors duration-500">
                  <div className="absolute -left-px top-10 w-px h-8 bg-gradient-to-b from-red-500/60 to-transparent" />
                  <div className="absolute -left-1.5 top-10 w-3 h-3 rounded-full bg-[#08080d] border border-red-500/40" />
                  <div className="lg:hidden flex items-center gap-4 mb-4">
                    <span className="text-red-500/50 text-xs tracking-widest uppercase">{lang === "en" ? ch.chapterEn : ch.chapter}</span>
                    <span className="text-white/20 text-xs">{lang === "en" ? ch.periodEn : ch.period}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white/80 mb-4">{lang === "en" ? ch.titleEn : ch.title}</h3>
                  <p className="text-white/45 leading-relaxed text-sm max-w-2xl mb-6">{lang === "en" ? ch.bodyEn : ch.body}</p>
                  <blockquote className="flex items-start gap-3">
                    <span className="text-red-500/40 text-3xl leading-none mt-1 font-serif">&ldquo;</span>
                    <p className="text-red-300/70 text-sm italic leading-relaxed">{lang === "en" ? ch.quoteEn : ch.quote}</p>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="py-20 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">{lang === "en" ? "Character Profile" : "Character Profile"}</p>
              <h2 className="text-3xl font-bold text-white/90 mb-10">{lang === "en" ? "The Designer" : "設計者"}</h2>
              <div className="grid grid-cols-2 gap-px bg-white/5">
                {kateStats.map((s) => (
                  <div key={s.label} className="bg-[#0a0a0f] p-5 hover:bg-white/[0.02] transition-colors">
                    <p className="text-red-400/50 text-xs tracking-widest uppercase mb-2">{lang === "en" ? s.labelEn : s.label}</p>
                    <p className="text-white/80 text-sm font-medium">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">{lang === "en" ? "Words" : "言葉の断片"}</p>
              <h2 className="text-3xl font-bold text-white/90 mb-10">{lang === "en" ? "Fragments of Words" : "言葉の断片"}</h2>
              <div className="space-y-6">
                {kateQuotes.map((q, i) => (
                  <div key={i} className="group relative pl-6 border-l border-white/5 hover:border-red-500/30 transition-colors duration-300">
                    <p className="text-white/75 text-base leading-relaxed mb-2">&ldquo;{lang === "en" ? q.textEn : q.text}&rdquo;</p>
                    <p className="text-white/25 text-xs">{lang === "en" ? q.contextEn : q.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#06060a] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">{lang === "en" ? "Timeline" : "Timeline"}</p>
            <h2 className="text-3xl font-bold text-white/90">{lang === "en" ? "Footprints of E Calendar" : "E暦の足跡"}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-900/40 via-red-700/20 to-transparent" />
            <div className="space-y-8">
              {kateTimeline.map((item, i) => (
                <div key={i} className="relative grid lg:grid-cols-2 gap-0">
                  <div className={`hidden lg:flex ${i % 2 === 0 ? "justify-end pr-12" : "justify-start pl-12 order-2"} items-center`}>
                    <div className={`text-right ${i % 2 !== 0 ? "text-left" : ""} max-w-xs`}>
                      <span className="text-red-500/70 text-2xl font-bold tracking-tight">{item.year}</span>
                      <h3 className="text-white/80 font-semibold mt-1">{lang === "en" ? item.titleEn : item.title}</h3>
                    </div>
                  </div>
                  <div className="absolute left-0 lg:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-[#06060a] border-2 border-red-500/50" />
                  <div className="pl-8 lg:pl-12 pb-6">
                    <div className="lg:hidden mb-3">
                      <span className="text-red-500/70 font-bold">{item.year}</span>
                      <h3 className="text-white/80 font-semibold">{lang === "en" ? item.titleEn : item.title}</h3>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-5 hover:border-red-900/30 transition-colors duration-300">
                      <p className="text-white/45 text-sm leading-relaxed">{lang === "en" ? item.descEn : item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auralis Section */}
      <section className="py-20 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">AURALIS</p>
              <h2 className="text-3xl font-bold text-white/90 mb-6">{lang === "en" ? "Make Light and Sound Eternal" : "光と音を永遠に"}</h2>
              <p className="text-white/45 leading-relaxed mb-8 text-sm">
                {lang === "en" ? "AURALIS, founded by Kate Claudia in E270. Dismantled by Evatron's suppression in E400, but its spirit never died. As of E528, five members of the 2nd Generation continue broadcasting across dimensions through the Liminal Forge." : "ケイト・クラウディアが E270年に礎を築いたAURALIS。E400年にエバトロンの弾圧により解体されたが、その精神は消えなかった。E528年現在、第2期として活動する5名が、リミナル・フォージを通じて次元を超えた放送を続けている。"}
              </p>
              <div className="p-6 bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/20 mb-8">
                <p className="text-red-400/60 text-xs tracking-widest uppercase mb-3">Mission</p>
                <p className="text-white/80 text-lg font-medium">Make Light and Sound Eternal</p>
                <p className="text-white/40 text-sm mt-1">{lang === "en" ? "Light and Sound into eternity" : "光と音を永遠のものに"}</p>
              </div>
            </div>
            <div>
              <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-3">AURALIS {lang === "en" ? "2nd Gen — E528" : "第2期 — E528"}</p>
              <h2 className="text-3xl font-bold text-white/90 mb-6">{lang === "en" ? "The Inheritors" : "継承者たち"}</h2>
              <div className="space-y-px">
                {members.map((m) => (
                  <div key={m.name} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all duration-200">
                    <div>
                      {m.url ? (
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-white/75 text-sm font-medium hover:text-red-400/80 transition-colors inline-flex items-center gap-1.5">
                          {m.name} <ExternalLink size={10} className="opacity-40" />
                        </a>
                      ) : (
                        <p className="text-white/75 text-sm font-medium">{m.name}</p>
                      )}
                    </div>
                    <span className="text-red-400/50 text-xs tracking-wide text-right max-w-[140px]">{lang === "en" ? m.roleEn : m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
