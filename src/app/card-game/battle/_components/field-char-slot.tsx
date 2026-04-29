"use client"

import { useEffect } from "react"
import Image from "next/image"
import { m } from "framer-motion"
import { Skull } from "lucide-react"
import type { AbilityType, FieldChar } from "@/types"

export function FieldCharSlot({
  char,
  index,
  isSelected,
  isPlayerTurn,
  isActing,
  actingAbility,
  isCharHit,
  onSelect,
  onActionEnd,
}: {
  char: FieldChar
  index: number
  isSelected: boolean
  isPlayerTurn: boolean
  isActing: boolean
  actingAbility: AbilityType | null
  isCharHit: boolean
  onSelect: () => void
  onActionEnd: () => void
}) {
  const hpPct = Math.max(0, (char.hp / char.maxHp) * 100)
  const hpColor =
    hpPct > 50
      ? "from-emerald-500 to-green-400"
      : hpPct > 25
        ? "from-yellow-500 to-amber-400"
        : "from-red-500 to-rose-400"

  useEffect(() => {
    if (isActing) {
      const t = setTimeout(onActionEnd, 1200)
      return () => clearTimeout(t)
    }
  }, [isActing, onActionEnd])

  const abilityGlow: Record<string, string> = {
    攻撃: "shadow-red-500/60 border-red-400/60",
    防御: "shadow-blue-500/60 border-blue-400/60",
    効果: "shadow-purple-500/60 border-purple-400/60",
    必殺: "shadow-yellow-500/60 border-yellow-400/60",
  }
  const abilityBg: Record<string, string> = {
    攻撃: "bg-red-500/15",
    防御: "bg-blue-500/15",
    効果: "bg-purple-500/15",
    必殺: "bg-yellow-500/15",
  }

  return (
    <m.button
      onClick={onSelect}
      disabled={!isPlayerTurn || char.isDown}
      whileHover={isPlayerTurn && !char.isDown ? { scale: 1.06, y: -5 } : {}}
      whileTap={isPlayerTurn && !char.isDown ? { scale: 0.96 } : {}}
      animate={
        isActing
          ? { scale: [1, 1.15, 1], y: [0, -8, 0] }
          : isCharHit
            ? { x: [0, -6, 6, -4, 0] }
            : {}
      }
      transition={isActing ? { duration: 0.6, repeat: 1 } : isCharHit ? { duration: 0.4 } : {}}
      className={`relative flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl border backdrop-blur-sm transition-all duration-300 min-w-[60px] sm:min-w-[72px] max-w-[76px] sm:max-w-[92px] ${
        char.isDown
          ? "opacity-30 border-edu-border/10 bg-edu-bg/20 cursor-not-allowed"
          : isActing && actingAbility
            ? `${abilityGlow[actingAbility]} ${abilityBg[actingAbility]} shadow-lg`
            : isCharHit
              ? "border-red-400/60 bg-red-500/15 shadow-lg shadow-red-500/30"
              : isSelected
                ? "border-yellow-400/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-400/30"
                : char.card.rarity === "SR"
                  ? "field-sr bg-edu-surface/50"
                  : char.card.rarity === "R"
                    ? "field-r bg-edu-surface/50"
                    : "border-edu-border/30 bg-edu-surface/50 hover:border-edu-accent2/50 hover:bg-edu-accent2/5"
      }`}
    >
      {isSelected && !isActing && (
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-400 border-2 border-edu-bg flex items-center justify-center z-10"
        >
          <span className="text-[8px] font-black text-edu-bg">&#9660;</span>
        </m.div>
      )}
      {isActing && actingAbility && (
        <m.div
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <span
            className={`text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${actingAbility === "攻撃" ? "bg-red-500 text-white" : actingAbility === "防御" ? "bg-blue-500 text-white" : actingAbility === "効果" ? "bg-purple-500 text-white" : "bg-yellow-500 text-black"}`}
          >
            {actingAbility === "必殺" ? "必殺！" : actingAbility}
          </span>
        </m.div>
      )}
      {char.isDown && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-edu-bg/60 rounded-xl">
          <m.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Skull className="w-5 h-5 text-rose-400/60" />
          </m.div>
        </div>
      )}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-edu-bg/50 border shrink-0 ${isActing && actingAbility === "必殺" ? "border-yellow-400 shadow-lg shadow-yellow-500/40" : isActing && actingAbility === "攻撃" ? "border-red-400 shadow-lg shadow-red-500/30" : "border-edu-border/20"}`}
      >
        <Image
          src={char.card.imageUrl}
          alt={char.card.name}
          width={48}
          height={48}
          sizes="(max-width: 640px) 100vw, 200px"
          className="w-full h-full object-cover"
        />
      </div>
      <p
        className={`text-[7px] sm:text-[8px] font-bold text-center leading-tight line-clamp-1 ${char.isDown ? "text-edu-muted/30" : "text-edu-text"}`}
      >
        {char.card.name}
      </p>
      <span
        className={`text-[6px] sm:text-[7px] font-black px-1 py-px rounded ${char.card.rarity === "SR" ? "rarity-badge-sr" : char.card.rarity === "R" ? "rarity-badge-r" : "bg-edu-bg/50 text-edu-muted border border-edu-border/30"}`}
      >
        {char.card.rarity}
      </span>
      {!char.isDown && (
        <div className="w-full">
          <div className="w-full h-1.5 bg-edu-bg rounded-full overflow-hidden relative">
            <m.div
              className={`h-full rounded-full bg-gradient-to-r ${hpColor} transition-all duration-500`}
              style={{ width: `${hpPct}%` }}
            />
            {hpPct <= 25 && hpPct > 0 && (
              <m.div
                className="absolute inset-0 rounded-full bg-rose-500/20"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
          <p
            className={`text-[7px] text-center mt-0.5 ${hpPct <= 25 ? "text-rose-400 font-bold" : "text-edu-muted"}`}
          >
            {char.hp}/{char.maxHp}
          </p>
        </div>
      )}
    </m.button>
  )
}
