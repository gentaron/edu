"use client"

import { useState, useEffect, useRef } from "react"
import { useLang } from "@/lib/use-lang"

interface QuoteEntry {
  text: string
  textEn: string
  speaker: string
  speakerEn: string
  era?: string
}

const QUOTES: QuoteEntry[] = [
  {
    text: "「光と音を永遠にする」",
    textEn: '"Where Light and Sound Become Eternal"',
    speaker: "AURALIS",
    speakerEn: "AURALIS",
    era: "E290–",
  },
  {
    text: "「私はもう、あなたと一緒に歩むことはできない」",
    textEn: '"I can no longer walk with you"',
    speaker: "Ninny Offenbach",
    speakerEn: "Ninny Offenbach",
    era: "E319",
  },
  {
    text: "「Gigapolis — セリア黄金期の伝統的な名称」",
    textEn: '"Gigapolis — the traditional name from the Seria Golden Age"',
    speaker: "Mina Eureka Ernst",
    speakerEn: "Mina Eureka Ernst",
    era: "E499–",
  },
  {
    text: "「E400のエヴァトロン弾圧で解体を余儀なくされた」",
    textEn: '"Dismantled by the Evatron suppression in E400"',
    speaker: "AURALIS 第一世代",
    speakerEn: "AURALIS 1st Generation",
    era: "E400",
  },
  {
    text: "「トリニティ・アライアンスは、この銀河を変える」",
    textEn: '"The Trinity Alliance will change this galaxy"',
    speaker: "Iris",
    speakerEn: "Iris",
    era: "E510–",
  },
  {
    text: "「Layla Virell Nova — ピンクの電撃、嵐を加速させる」",
    textEn: '"Layla Virell Nova — Pink Voltage, accelerating the storm"',
    speaker: "AURALIS Archives",
    speakerEn: "AURALIS Archives",
    era: "E325–",
  },
  {
    text: "「E528、Liminal Forgeが地球への放送を開始」",
    textEn: '"E528 — Liminal Forge begins broadcasting to Earth"',
    speaker: "Liminal Forge",
    speakerEn: "Liminal Forge",
    era: "E528",
  },
  {
    text: "「Lillie Ardent — 真夜中の炎、静かに燃え尽きることはない」",
    textEn: '"Lillie Ardent — The Midnight Flame never quietly burns out"',
    speaker: "AURALIS Archives",
    speakerEn: "AURALIS Archives",
    era: "E522–",
  },
  {
    text: "「Kate Patton — 大地の豊かさと安定、不動の意志」",
    textEn: '"Kate Patton — Earth Resonance, unwavering resolve"',
    speaker: "AURALIS Archives",
    speakerEn: "AURALIS Archives",
    era: "E522–",
  },
  {
    text: "「Timur Shahの第10次元Horasm理論がPersephoneを生んだ」",
    textEn: '"Timur Shah\'s 10th-dimensional Horasm theory gave birth to Persephone"',
    speaker: "EDU Archives",
    speakerEn: "EDU Archives",
    era: "E0",
  },
]

const TYPE_SPEED = 55
const PAUSE_TYPED = 3200
const DELETE_SPEED = 30
const PAUSE_DELETED = 600
const CROSSFADE_MS = 500

type Phase = "typing" | "paused-typed" | "deleting" | "paused-deleted"

export function TypewriterTitle() {
  const { lang } = useLang()
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)

  const phaseRef = useRef<Phase>("typing")
  const charRef = useRef(0)
  const quoteRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const mountedRef = useRef(true)

  const currentQuote = QUOTES[quoteIdx] ?? QUOTES[0]!
  const displayText = lang === "en" ? currentQuote.textEn : currentQuote.text
  const speaker = lang === "en" ? currentQuote.speakerEn : currentQuote.speaker
  const currentText = displayText.slice(0, charIndex)

  useEffect(() => {
    charRef.current = 0
    setCharIndex(0)
    phaseRef.current = "typing"
  }, [lang, quoteIdx])

  useEffect(() => {
    mountedRef.current = true

    function scheduleNext(ms: number, action: () => void) {
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) action()
      }, ms)
    }

    function tick() {
      const phase = phaseRef.current
      const char = charRef.current
      const total = displayText.length

      if (phase === "typing") {
        if (char < total) {
          charRef.current = char + 1
          setCharIndex(char + 1)
          scheduleNext(TYPE_SPEED, tick)
        } else {
          phaseRef.current = "paused-typed"
          scheduleNext(PAUSE_TYPED, tick)
        }
      } else if (phase === "paused-typed") {
        phaseRef.current = "deleting"
        tick()
      } else if (phase === "deleting") {
        if (char > 0) {
          charRef.current = char - 1
          setCharIndex(char - 1)
          scheduleNext(DELETE_SPEED, tick)
        } else {
          phaseRef.current = "paused-deleted"
          setFadingOut(true)
          scheduleNext(CROSSFADE_MS, () => {
            const next = (quoteRef.current + 1) % QUOTES.length
            quoteRef.current = next
            setQuoteIdx(next)
            setFadingOut(false)
            phaseRef.current = "typing"
            charRef.current = 0
            setCharIndex(0)
            scheduleNext(PAUSE_DELETED, tick)
          })
        }
      }
    }

    scheduleNext(400, tick)

    return () => {
      mountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [displayText])

  return (
    <div
      className="mb-6"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <p
        className="text-xl sm:text-4xl lg:text-5xl font-bold text-edu-text leading-snug min-h-[2.5rem] sm:min-h-[5rem]"
        style={{
          textShadow: "0 0 40px rgba(129, 140, 248, 0.15), 0 0 80px rgba(200, 164, 78, 0.08)",
        }}
      >
        {currentText}
        <span
          className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-edu-accent ml-1 align-middle animate-pulse"
          style={{ boxShadow: "0 0 8px rgba(200, 164, 78, 0.5)" }}
        />
      </p>
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
        {currentQuote.era && (
          <span className="text-[10px] sm:text-xs text-edu-muted/60 tracking-widest font-mono">
            {currentQuote.era}
          </span>
        )}
        <span className="text-[11px] sm:text-xs text-edu-accent tracking-wider font-medium">
          — {speaker}
        </span>
      </div>
    </div>
  )
}
