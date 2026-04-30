"use client"

import { useState, useEffect, useRef } from "react"

const FULL_TEXT = "Eternal Dominion\nUniverse"
const TOTAL_CHARS = FULL_TEXT.length
const NEWLINE_POS = FULL_TEXT.indexOf("\n")

const FONT_CYCLE = [
  { family: "'Noto Sans JP', sans-serif", weight: "900", spacing: "0.05em" },
  { family: "'Courier New', 'DejaVu Sans Mono', monospace", weight: "700", spacing: "0.14em" },
  { family: "'Georgia', 'Noto Serif SC', serif", weight: "700", spacing: "0.1em" },
  { family: "'Trebuchet MS', 'Noto Sans JP', sans-serif", weight: "800", spacing: "0.16em" },
  { family: "'Palatino Linotype', 'Book Antiqua', serif", weight: "700", spacing: "0.06em" },
]

const TYPE_SPEED = 75
const DELETE_SPEED = 40
const PAUSE_TYPED = 2000
const PAUSE_DELETED = 500
const FONT_SWITCH_MS = 400

type Phase = "typing" | "paused-typed" | "deleting" | "paused-deleted" | "font-switch"

export function TypewriterTitle() {
  const [charIndex, setCharIndex] = useState(0)
  const [fontIdx, setFontIdx] = useState(0)
  const [fontFading, setFontFading] = useState(false)

  const phaseRef = useRef<Phase>("typing")
  const charRef = useRef(0)
  const fontRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const mountedRef = useRef(true)

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

      if (phase === "typing") {
        if (char < TOTAL_CHARS) {
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
          phaseRef.current = "font-switch"
          setFontFading(true)
          scheduleNext(FONT_SWITCH_MS, () => {
            const nextFont = (fontRef.current + 1) % FONT_CYCLE.length
            fontRef.current = nextFont
            setFontIdx(nextFont)
            setFontFading(false)
            phaseRef.current = "typing"
            scheduleNext(PAUSE_DELETED, tick)
          })
        }
      }
    }

    scheduleNext(300, tick)

    return () => {
      mountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const currentText = FULL_TEXT.slice(0, charIndex)
  const [line1, line2] = currentText.split("\n", 2)
  const cursorOnLine2 = charIndex > NEWLINE_POS

  const font = FONT_CYCLE[fontIdx] ?? FONT_CYCLE[0]!

  return (
    <h1
      className="text-4xl sm:text-6xl lg:text-7xl font-black text-edu-text mb-4 leading-tight min-h-[5.5rem] sm:min-h-[7rem]"
      style={{
        fontFamily: font.family,
        fontWeight: font.weight,
        letterSpacing: font.spacing,
        opacity: fontFading ? 0 : 1,
        transition: "opacity 0.3s ease",
        textShadow: "0 0 40px rgba(129, 140, 248, 0.15), 0 0 80px rgba(200, 164, 78, 0.08)",
      }}
    >
      {line1 ?? ""}
      {!cursorOnLine2 && (
        <span
          className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-edu-accent ml-1 align-middle animate-pulse"
          style={{ boxShadow: "0 0 8px rgba(200, 164, 78, 0.5)" }}
        />
      )}
      {line1 !== undefined && (
        <>
          <br />
          <span className={cursorOnLine2 ? "" : "opacity-0"}>
            {line2 ?? ""}
            {cursorOnLine2 && (
              <span
                className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-edu-accent ml-1 align-middle animate-pulse"
                style={{ boxShadow: "0 0 8px rgba(200, 164, 78, 0.5)" }}
              />
            )}
          </span>
        </>
      )}
    </h1>
  )
}
