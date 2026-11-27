"use client"
import { useState } from "react"
import Image from "next/image"
import { type Portrait } from "./portrait-design"
export function CharacterPortrait({ portrait, name, size = 48, className = "" }: { portrait: Portrait; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  const src = failed ? portrait.fallback : portrait.src
  return <Image src={src} alt={name} width={size} height={size} unoptimized={src.startsWith("/") || src.endsWith(".svg")} onError={() => setFailed(true)} loading="lazy" className={"shrink-0 rounded-2xl border border-white/10 bg-edu-surface object-cover " + className} />
}
