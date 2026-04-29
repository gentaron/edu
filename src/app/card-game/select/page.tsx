"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { m } from "framer-motion"
import { Swords, ArrowLeft, Shield, Skull, AlertTriangle, ChevronRight, Crown } from "lucide-react"
import { ENEMIES } from "@/lib/card-data"
import type { Enemy } from "@/types"
import { useDeckStore } from "@/lib/stores"

const diffColors: Record<string, { border: string; badge: string; icon: React.ReactNode }> = {
  NORMAL: {
    border: "border-green-400/40",
    badge: "text-green-400 bg-green-500/10 border-green-500/40",
    icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />,
  },
  HARD: {
    border: "border-orange-400/40",
    badge: "text-orange-400 bg-orange-500/10 border-orange-500/40",
    icon: <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />,
  },
  BOSS: {
    border: "border-red-400/40",
    badge: "text-red-400 bg-red-500/10 border-red-500/40",
    icon: <Skull className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />,
  },
  FINAL: {
    border: "border-yellow-400/40",
    badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40",
    icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />,
  },
}

const DIFF_ORDER: Enemy["difficulty"][] = ["NORMAL", "HARD", "BOSS", "FINAL"]
const DIFF_LABELS: Record<string, string> = {
  NORMAL: "NORMAL — 標準敵",
  HARD: "HARD — 上級敵",
  BOSS: "BOSS — ボス敵",
  FINAL: "FINAL — 最終ボス",
}

function EnemyCard({ enemy, onBattle }: { enemy: Enemy; onBattle: () => void }) {
  const dc = diffColors[enemy.difficulty] ?? { border: "border-edu-border", badge: "", icon: <></> }

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`edu-card rounded-xl overflow-hidden border ${dc.border} transition-all`}
    >
      {/* Header bar */}
      <div className="relative h-20 sm:h-28 bg-edu-bg flex items-center justify-center">
        <Image
          src={enemy.imageUrl}
          alt={enemy.name}
          width={64}
          height={64}
          loading="lazy"
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-edu-bg via-edu-bg/40 to-transparent" />
        <div className="absolute top-2 right-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${dc.badge}`}>
            {enemy.difficulty}
          </span>
        </div>
        <div className="absolute bottom-2 left-3">
          <h3 className="text-xs sm:text-sm font-bold text-edu-text">{enemy.name}</h3>
          <p className="text-[9px] sm:text-[10px] text-edu-muted">{enemy.title}</p>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-edu-muted">
          <span>
            HP: <span className="text-rose-400 font-bold">{enemy.maxHp}</span>
          </span>
          <span>
            ATK: <span className="text-orange-400 font-bold">{enemy.attackPower}</span>
          </span>
          <span>
            Phase: <span className="text-yellow-400 font-bold">{enemy.phases.length + 1}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-[10px] text-edu-muted leading-relaxed line-clamp-2">
          {enemy.description}
        </p>

        {/* Special Rule */}
        {enemy.specialRule && (
          <div className="flex items-start gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5">
            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{enemy.specialRule}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-edu-accent/60">🏆 {enemy.reward}</span>
          <button
            onClick={onBattle}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-all"
          >
            バトル開始
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </m.div>
  )
}

export default function EnemySelectPage() {
  const router = useRouter()
  const deck = useDeckStore((s) => s.deck)

  if (deck.length < 5) {
    return (
      <div className="min-h-screen bg-edu-bg flex items-center justify-center">
        <div className="edu-card rounded-xl p-6 sm:p-8 text-center max-w-sm mx-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-edu-text mb-2">デッキが未完成です</h2>
          <p className="text-xs text-edu-muted mb-6">
            デッキは5枚必要です。現在 <span className="text-rose-400 font-bold">{deck.length}</span>
            /5枚
          </p>
          <Link
            href="/card-game"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-edu-accent2/20 border border-edu-accent2/40 text-edu-accent2 text-sm font-bold hover:bg-edu-accent2/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> デッキ構築へ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* Header */}
      <div className="edu-card border-b border-edu-border/50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
          <Link
            href="/card-game"
            className="text-xs text-edu-muted hover:text-edu-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline" />{" "}
            <span className="hidden sm:inline">デッキ構築に戻る</span>
          </Link>
          <span className="text-edu-border hidden sm:inline">|</span>
          <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <h1 className="text-xs sm:text-sm font-bold text-edu-text">敵を選択</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {DIFF_ORDER.map((diff) => {
          const enemies = ENEMIES.filter((e) => e.difficulty === diff)
          if (enemies.length === 0) return null
          return (
            <div key={diff} className="mb-8 sm:mb-10">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                {diffColors[diff]?.icon}
                <h2 className="text-[10px] sm:text-xs font-bold text-edu-muted uppercase tracking-widest">
                  {DIFF_LABELS[diff] ?? ""}
                </h2>
                <div className="flex-1 h-px bg-edu-border/20" />
              </div>

              <div
                className={`grid gap-3 sm:gap-4 ${
                  diff === "FINAL"
                    ? "grid-cols-1 max-w-md mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {enemies.map((enemy) => (
                  <EnemyCard
                    key={enemy.id}
                    enemy={enemy}
                    onBattle={() => {
                      router.push(`/card-game/battle?enemy=${enemy.id}`)
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
