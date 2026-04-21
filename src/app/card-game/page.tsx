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
  Plus,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ALL_CARDS, type GameCard, type CardType } from "@/lib/card-data";
import { useDeckStore } from "@/lib/game-store";

const TYPE_FILTERS: ("全て" | CardType)[] = ["全て", "攻撃", "防御", "効果", "必殺"];
type RarityFilter = "全て" | "C" | "R" | "SR";

const typeColors: Record<CardType, { border: string; bg: string; badge: string; text: string }> = {
  攻撃: { border: "border-red-400/50", bg: "bg-red-500/10", badge: "bg-red-500/20 text-red-400", text: "text-red-400" },
  防御: { border: "border-blue-400/50", bg: "bg-blue-500/10", badge: "bg-blue-500/20 text-blue-400", text: "text-blue-400" },
  効果: { border: "border-purple-400/50", bg: "bg-purple-500/10", badge: "bg-purple-500/20 text-purple-400", text: "text-purple-400" },
  必殺: { border: "border-yellow-400/50", bg: "bg-yellow-500/10", badge: "bg-yellow-500/20 text-yellow-400", text: "text-yellow-400" },
};

const rarityColors: Record<string, { border: string; label: string }> = {
  C: { border: "border-cosmic-border bg-cosmic-surface", label: "text-cosmic-muted" },
  R: { border: "border-blue-400/50 bg-blue-500/10", label: "text-blue-400" },
  SR: { border: "border-yellow-400/50 bg-yellow-500/10", label: "text-yellow-400" },
};

function CardInPool({ card, countInDeck, onAdd }: { card: GameCard; countInDeck: number; onAdd: () => void }) {
  const maxed = countInDeck >= 2;
  const tc = typeColors[card.type];
  const rc = rarityColors[card.rarity];

  return (
    <motion.button
      layout
      whileHover={!maxed ? { scale: 1.05 } : {}}
      whileTap={!maxed ? { scale: 0.95 } : {}}
      onClick={onAdd}
      disabled={maxed}
      className={`relative w-36 h-52 rounded-xl border ${rc.border} ${tc.bg} backdrop-blur-sm flex flex-col overflow-hidden transition-all duration-200 shrink-0 ${
        maxed ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      } ${card.rarity === "SR" ? "animate-pulse-glow" : ""}`}
    >
      {/* Count badge */}
      {countInDeck > 0 && (
        <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-nebula-purple border border-nebula-purple/50 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{countInDeck}</span>
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
          <span className={`inline-block text-[7px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${tc.badge}`}>
            {card.type}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[9px] font-bold">
          {card.attack > 0 && <span className="text-red-400">ATK {card.attack}</span>}
          {card.defense > 0 && <span className="text-blue-400">DEF {card.defense}</span>}
          {card.effect && <span className="text-purple-300 text-[7px] text-center leading-tight max-w-[5rem]">{card.effect}</span>}
        </div>

        {/* Cost */}
        <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-nebula-purple border border-nebula-purple/50 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white">{card.cost}</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function DeckBuildPage() {
  const router = useRouter();
  const { deck, deckName, addCard, removeCard, clearDeck, setDeckName } = useDeckStore();
  const [typeFilter, setTypeFilter] = useState<"全て" | CardType>("全て");
  const [rarityFilter, setRarityFilter] = useState<"全て" | "C" | "R" | "SR">("全て");

  const countMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of deck) m[c.id] = (m[c.id] || 0) + 1;
    return m;
  }, [deck]);

  const filteredCards = useMemo(() => {
    return ALL_CARDS.filter((c) => {
      if (typeFilter !== "全て" && c.type !== typeFilter) return false;
      if (rarityFilter !== "全て" && c.rarity !== rarityFilter) return false;
      return true;
    });
  }, [typeFilter, rarityFilter]);

  const isReady = deck.length >= 20;

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
        <p className="text-xs text-cosmic-muted mb-6">
          64種のキャラクターカードプールから20枚のデッキを構築してください（同一カード最大2枚）
        </p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Card Pool */}
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Filter className="w-3.5 h-3.5 text-cosmic-muted" />
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-all ${
                    typeFilter === t
                      ? "border-nebula-purple/50 bg-nebula-purple/20 text-nebula-purple"
                      : "border-cosmic-border/30 bg-cosmic-surface/30 text-cosmic-muted hover:text-cosmic-text"
                  }`}
                >
                  {t}
                </button>
              ))}
              <span className="text-cosmic-border mx-1">|</span>
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
                    countInDeck={countMap[card.id] || 0}
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
                デッキ枚数: <span className={isReady ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{deck.length}</span>/20
              </span>
              <button
                onClick={clearDeck}
                className="text-[10px] text-cosmic-muted hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> クリア
              </button>
            </div>

            {/* Deck cards list */}
            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 mb-4">
              {deck.length === 0 ? (
                <p className="text-[10px] text-cosmic-muted/50 text-center py-8">
                  カードを左のプールから追加してください
                </p>
              ) : (
                <AnimatePresence>
                  {Array.from(new Set(deck.map((c) => c.id))).map((id) => {
                    const card = deck.find((c) => c.id === id)!;
                    const cnt = deck.filter((c) => c.id === id).length;
                    const tc = typeColors[card.type];
                    return (
                      <motion.div
                        key={id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cosmic-deep/30 border border-cosmic-border/20"
                      >
                        <div className={`w-6 h-6 rounded border ${tc.border} ${tc.bg} flex items-center justify-center shrink-0`}>
                          <Image src={card.imageUrl} alt="" width={20} height={20} className="w-5 h-5 rounded object-cover" />
                        </div>
                        <span className="text-[10px] font-medium text-cosmic-text flex-1 truncate">{card.name}</span>
                        <span className={`text-[9px] font-bold ${tc.badge} px-1.5 py-0.5 rounded`}>{card.type}</span>
                        <span className="text-[9px] text-cosmic-muted">×{cnt}</span>
                        <button
                          onClick={() => removeCard(id)}
                          className="text-cosmic-muted hover:text-rose-400 transition-colors"
                        >
                          ×
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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
