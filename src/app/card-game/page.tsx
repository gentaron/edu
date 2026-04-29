"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { m, AnimatePresence } from "framer-motion"
import {
  Swords,
  ArrowLeft,
  Trash2,
  ChevronRight,
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react"
import { ALL_CARDS } from "@/lib/card-data"
import type { GameCard } from "@/types"
import { useDeckStore } from "@/lib/game-store"
import { useShallow } from "zustand/react/shallow"

type RarityFilter = "全て" | "C" | "R" | "SR"

const rarityColors: Record<string, { border: string; label: string }> = {
  C: { border: "border-edu-border bg-edu-surface", label: "text-edu-muted" },
  R: { border: "border-blue-400/50 bg-blue-500/10", label: "text-blue-400" },
  SR: { border: "border-yellow-400/50 bg-yellow-500/10", label: "text-yellow-400" },
}

const rarityCardClass: Record<string, string> = {
  SR: "card-sr",
  R: "card-r",
  C: "card-c",
}

const rarityBadgeClass: Record<string, string> = {
  SR: "rarity-badge-sr",
  R: "rarity-badge-r",
  C: "bg-edu-surface/50 text-edu-muted border border-edu-border/30",
}

function CardInPool({
  card,
  inDeck,
  onAdd,
}: {
  card: GameCard
  inDeck: boolean
  onAdd: () => void
}) {
  const rc = rarityColors[card.rarity] ?? {
    border: "border-edu-border bg-edu-surface",
    label: "text-edu-muted",
  }
  const cardClass = rarityCardClass[card.rarity] ?? ""
  const badgeClass = rarityBadgeClass[card.rarity] ?? ""

  return (
    <m.button
      layout
      whileHover={!inDeck ? { scale: 1.05 } : {}}
      whileTap={!inDeck ? { scale: 0.95 } : {}}
      onClick={onAdd}
      disabled={inDeck}
      className={`relative w-28 h-40 sm:w-36 sm:h-52 rounded-xl ${rc.border} backdrop-blur-sm flex flex-col overflow-hidden transition-all duration-200 shrink-0 ${cardClass} ${
        inDeck ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${card.rarity === "SR" ? "" : ""}`}
    >
      {/* In-deck badge */}
      {inDeck && (
        <div className="absolute top-1.5 right-1.5 z-20 w-5 h-5 rounded-full bg-emerald-500 border border-emerald-400/50 flex items-center justify-center">
          <span className="text-[8px]">✓</span>
        </div>
      )}

      {/* Image */}
      <div className="h-16 sm:h-20 w-full overflow-hidden bg-edu-bg/50 relative z-10">
        <Image
          src={card.imageUrl}
          alt={card.name}
          width={144}
          height={80}
          sizes="(max-width: 640px) 100vw, 200px"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col items-center justify-between p-1.5 sm:p-2 min-h-0 relative z-10">
        <div className="text-center">
          <p className="text-[8px] sm:text-[9px] font-bold text-edu-text leading-tight line-clamp-2">
            {card.name}
          </p>
          <span
            className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${badgeClass}`}
          >
            {card.rarity}
          </span>
        </div>

        {/* Stats preview */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[7px] sm:text-[8px] font-bold">
          <span className="text-red-400">⚔{card.attack}</span>
          <span className="text-blue-400">🛡{card.defense}</span>
          <span className="text-purple-300">✨{card.effectValue}</span>
          <span className="text-yellow-400">💥{card.ultimate}</span>
        </div>
      </div>
    </m.button>
  )
}

function DeckSlot({
  card,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  card: GameCard
  index: number
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const rc = rarityColors[card.rarity] ?? {
    border: "border-edu-border bg-edu-surface",
    label: "text-edu-muted",
  }
  const badgeClass = rarityBadgeClass[card.rarity] ?? ""

  return (
    <m.div
      layout
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-edu-bg/30 border border-edu-border/20"
    >
      {/* Position number */}
      <span className="text-[10px] font-black text-edu-accent2 w-4 text-center shrink-0">
        {index + 1}
      </span>

      {/* Card image */}
      <div
        className={`w-7 h-7 rounded border ${rc.border} flex items-center justify-center shrink-0 overflow-hidden`}
      >
        <Image
          src={card.imageUrl}
          alt=""
          width={24}
          height={24}
          sizes="28px"
          loading="lazy"
          className="w-6 h-6 rounded object-cover"
        />
      </div>

      {/* Name */}
      <span className="text-[10px] font-medium text-edu-text flex-1 truncate">{card.name}</span>

      {/* Rarity */}
      <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${badgeClass}`}>
        {card.rarity}
      </span>

      {/* Reorder buttons */}
      <div className="flex flex-col gap-0 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className={`p-0 leading-none ${index === 0 ? "text-edu-border/20 cursor-not-allowed" : "text-edu-muted hover:text-edu-text"}`}
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === 4}
          className={`p-0 leading-none ${index === 4 ? "text-edu-border/20 cursor-not-allowed" : "text-edu-muted hover:text-edu-text"}`}
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-edu-muted hover:text-rose-400 transition-colors shrink-0 min-w-[16px] min-h-[16px] flex items-center justify-center"
      >
        ×
      </button>
    </m.div>
  )
}

export default function DeckBuildPage() {
  const router = useRouter()
  const { deck, deckName, addCard, removeCard, moveCard, clearDeck, setDeckName } = useDeckStore(
    useShallow((s) => ({
      deck: s.deck,
      deckName: s.deckName,
      addCard: s.addCard,
      removeCard: s.removeCard,
      moveCard: s.moveCard,
      clearDeck: s.clearDeck,
      setDeckName: s.setDeckName,
    }))
  )
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("全て")

  const deckIds = useMemo(() => new Set(deck.map((c) => c.id)), [deck])

  const filteredCards = useMemo(() => {
    return ALL_CARDS.filter((c) => {
      if (rarityFilter !== "全て" && c.rarity !== rarityFilter) return false
      return true
    })
  }, [rarityFilter])

  const isReady = deck.length >= 5

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* Header */}
      <div className="edu-card border-b border-edu-border/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-xs text-edu-muted hover:text-edu-text transition-colors">
            <ArrowLeft className="w-4 h-4 inline" />{" "}
            <span className="hidden sm:inline">ホームへ</span>
          </Link>
          <span className="text-edu-border">|</span>
          <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <h1 className="text-xs sm:text-sm font-bold text-edu-text">EDU CARD GAME — デッキ構築</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Description */}
        <div className="flex items-start gap-2 mb-4 sm:mb-6">
          <Info className="w-4 h-4 text-edu-accent2 shrink-0 mt-0.5" />
          <p className="text-xs text-edu-muted">
            64種のキャラクターから<strong className="text-edu-text">5枚</strong>
            を選び、順番を決めてバトルに挑もう。
            各カードは攻撃・防御・効果・必殺の4つの能力を持っています。順番は戦略の要です！
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
          {/* Left: Card Pool */}
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <Filter className="w-3.5 h-3.5 text-edu-muted" />
              {(["全て", "C", "R", "SR"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-all ${
                    rarityFilter === r
                      ? "border-edu-accent2/50 bg-edu-accent2/20 text-edu-accent2"
                      : "border-edu-border/30 bg-edu-surface/30 text-edu-muted hover:text-edu-text"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Card Grid */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <AnimatePresence mode="popLayout">
                {filteredCards.map((card) => (
                  <CardInPool
                    key={card.id}
                    card={card}
                    inDeck={deckIds.has(card.id)}
                    onAdd={() => addCard(card)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Current Deck */}
          <div className="edu-card rounded-xl p-3 sm:p-4 h-fit lg:sticky lg:top-4 order-first lg:order-last">
            {/* Deck Name */}
            <input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full bg-edu-bg/50 border border-edu-border/30 rounded-lg px-3 py-2 text-sm font-bold text-edu-text mb-3 focus:outline-none focus:border-edu-accent2/50"
              placeholder="デッキ名"
            />

            {/* Count */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-edu-muted">
                デッキ枚数:{" "}
                <span
                  className={isReady ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}
                >
                  {deck.length}
                </span>
                /5
              </span>
              <button
                onClick={clearDeck}
                className="text-[10px] text-edu-muted hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> クリア
              </button>
            </div>

            {/* Deck slots */}
            <div className="space-y-1.5 mb-4">
              {deck.length === 0 ? (
                <p className="text-[10px] text-edu-muted/50 text-center py-6 sm:py-8">
                  カードを下のプールから追加してください
                </p>
              ) : (
                <AnimatePresence>
                  {deck.map((card, index) => (
                    <DeckSlot
                      key={card.id}
                      card={card}
                      index={index}
                      onRemove={() => removeCard(card.id)}
                      onMoveUp={() => moveCard(index, index - 1)}
                      onMoveDown={() => moveCard(index, index + 1)}
                    />
                  ))}
                </AnimatePresence>
              )}

              {/* Empty slots indicator */}
              {deck.length < 5 && (
                <div className="space-y-1.5">
                  {Array.from({ length: 5 - deck.length }, (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex items-center justify-center px-2 py-1.5 rounded-lg border border-dashed border-edu-border/20"
                    >
                      <span className="text-[9px] text-edu-muted/40">
                        空きスロット {deck.length + i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Battle Button */}
            <button
              onClick={() => router.push("/card-game/select")}
              disabled={!isReady}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isReady
                  ? "bg-edu-accent/20 border border-edu-accent/40 text-edu-accent hover:bg-edu-accent/30"
                  : "bg-edu-bg/50 border border-edu-border/20 text-edu-muted cursor-not-allowed"
              }`}
            >
              バトルへ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
