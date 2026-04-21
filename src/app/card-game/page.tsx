"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  ArrowLeft,
  Trash2,
  ChevronRight,
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";
import { ALL_CARDS, type GameCard } from "@/lib/card-data";
import { useDeckStore } from "@/lib/game-store";

type RarityFilter = "全て" | "C" | "R" | "SR";

const rarityColors: Record<string, { border: string; label: string }> = {
  C: { border: "border-cosmic-border bg-cosmic-surface", label: "text-cosmic-muted" },
  R: { border: "border-blue-400/50 bg-blue-500/10", label: "text-blue-400" },
  SR: { border: "border-yellow-400/50 bg-yellow-500/10", label: "text-yellow-400" },
};

function CardInPool({ card, inDeck, onAdd }: { card: GameCard; inDeck: boolean; onAdd: () => void }) {
  const rc = rarityColors[card.rarity];

  return (
    <motion.button
      layout
      whileHover={!inDeck ? { scale: 1.05 } : {}}
      whileTap={!inDeck ? { scale: 0.95 } : {}}
      onClick={onAdd}
      disabled={inDeck}
      className={`relative w-36 h-52 rounded-xl border ${rc.border} backdrop-blur-sm flex flex-col overflow-hidden transition-all duration-200 shrink-0 ${
        inDeck ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      } ${card.rarity === "SR" ? "animate-pulse-glow" : ""}`}
    >
      {/* In-deck badge */}
      {inDeck && (
        <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-emerald-500 border border-emerald-400/50 flex items-center justify-center">
          <span className="text-[8px]">✓</span>
        </div>
      )}

      {/* Image */}
      <div className="h-20 w-full overflow-hidden bg-cosmic-deep/50">
        <Image src={card.imageUrl} alt={card.name} width={144} height={80} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col items-center justify-between p-2 min-h-0">
        <div className="text-center">
          <p className="text-[9px] font-bold text-cosmic-text leading-tight line-clamp-2">{card.name}</p>
          <span className="inline-block text-[7px] font-bold px-1.5 py-0.5 rounded mt-0.5 bg-cosmic-surface/50 text-cosmic-muted border border-cosmic-border/30">
            {card.rarity}
          </span>
        </div>

        {/* Stats preview */}
        <div className="flex items-center gap-1.5 text-[8px] font-bold">
          <span className="text-red-400">⚔{card.attack}</span>
          <span className="text-blue-400">🛡{card.defense}</span>
          <span className="text-purple-300">✨{card.effectValue}</span>
          <span className="text-yellow-400">💥{card.ultimate}</span>
        </div>
      </div>
    </motion.button>
  );
}

function DeckSlot({
  card,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  card: GameCard;
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const rc = rarityColors[card.rarity];

  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cosmic-deep/30 border border-cosmic-border/20"
    >
      {/* Position number */}
      <span className="text-[10px] font-black text-nebula-purple w-4 text-center shrink-0">
        {index + 1}
      </span>

      {/* Card image */}
      <div className={`w-7 h-7 rounded border ${rc.border} flex items-center justify-center shrink-0 overflow-hidden`}>
        <Image src={card.imageUrl} alt="" width={24} height={24} className="w-6 h-6 rounded object-cover" />
      </div>

      {/* Name */}
      <span className="text-[10px] font-medium text-cosmic-text flex-1 truncate">{card.name}</span>

      {/* Rarity */}
      <span className={`text-[8px] font-bold ${rc.label} px-1 py-0.5 rounded`}>{card.rarity}</span>

      {/* Reorder buttons */}
      <div className="flex flex-col gap-0 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className={`p-0 leading-none ${index === 0 ? "text-cosmic-border/20 cursor-not-allowed" : "text-cosmic-muted hover:text-cosmic-text"}`}
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === 4}
          className={`p-0 leading-none ${index === 4 ? "text-cosmic-border/20 cursor-not-allowed" : "text-cosmic-muted hover:text-cosmic-text"}`}
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-cosmic-muted hover:text-rose-400 transition-colors shrink-0"
      >
        ×
      </button>
    </motion.div>
  );
}

export default function DeckBuildPage() {
  const router = useRouter();
  const { deck, deckName, addCard, removeCard, moveCard, clearDeck, setDeckName } = useDeckStore();
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("全て");

  const deckIds = useMemo(() => new Set(deck.map((c) => c.id)), [deck]);

  const filteredCards = useMemo(() => {
    return ALL_CARDS.filter((c) => {
      if (rarityFilter !== "全て" && c.rarity !== rarityFilter) return false;
      return true;
    });
  }, [rarityFilter]);

  const isReady = deck.length >= 5;

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors">
            <ArrowLeft className="w-4 h-4 inline" /> ホームへ
          </Link>
          <span className="text-cosmic-border">|</span>
          <Swords className="w-5 h-5 text-rose-400" />
          <h1 className="text-sm font-bold text-cosmic-gradient">EDU CARD GAME — デッキ構築</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Description */}
        <div className="flex items-start gap-2 mb-6">
          <Info className="w-4 h-4 text-nebula-purple shrink-0 mt-0.5" />
          <p className="text-xs text-cosmic-muted">
            64種のキャラクターから<strong className="text-cosmic-text">5枚</strong>を選び、順番を決めてバトルに挑もう。
            各カードは攻撃・防御・効果・必殺の4つの能力を持っています。順番は戦略の要です！
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Card Pool */}
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Filter className="w-3.5 h-3.5 text-cosmic-muted" />
              {(["全て", "C", "R", "SR"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-all ${
                    rarityFilter === r
                      ? "border-nebula-purple/50 bg-nebula-purple/20 text-nebula-purple"
                      : "border-cosmic-border/30 bg-cosmic-surface/30 text-cosmic-muted hover:text-cosmic-text"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Card Grid */}
            <div className="flex flex-wrap gap-3">
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
          <div className="glass-card rounded-xl p-4 h-fit lg:sticky lg:top-4">
            {/* Deck Name */}
            <input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full bg-cosmic-deep/50 border border-cosmic-border/30 rounded-lg px-3 py-2 text-sm font-bold text-cosmic-text mb-3 focus:outline-none focus:border-nebula-purple/50"
              placeholder="デッキ名"
            />

            {/* Count */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-cosmic-muted">
                デッキ枚数:{" "}
                <span className={isReady ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {deck.length}
                </span>
                /5
              </span>
              <button
                onClick={clearDeck}
                className="text-[10px] text-cosmic-muted hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> クリア
              </button>
            </div>

            {/* Deck slots */}
            <div className="space-y-1.5 mb-4">
              {deck.length === 0 ? (
                <p className="text-[10px] text-cosmic-muted/50 text-center py-8">
                  カードを左のプールから追加してください
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
                      className="flex items-center justify-center px-2 py-1.5 rounded-lg border border-dashed border-cosmic-border/20"
                    >
                      <span className="text-[9px] text-cosmic-muted/40">空きスロット {deck.length + i + 1}</span>
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
                  ? "bg-gold-accent/20 border border-gold-accent/40 text-gold-accent hover:bg-gold-accent/30 hover:scale-[1.01]"
                  : "bg-cosmic-deep/50 border border-cosmic-border/20 text-cosmic-muted cursor-not-allowed"
              }`}
            >
              バトルへ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
