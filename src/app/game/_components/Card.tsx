"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { CardDef } from "../_lib/rules";

const TYPE_COLORS: Record<string, string> = {
  character: "border-nebula-purple bg-nebula-purple/10",
  event: "border-electric-blue bg-electric-blue/10",
  location: "border-amber-400 bg-amber-400/10",
  tech: "border-gold-accent bg-gold-accent/10",
};

const TYPE_ICONS: Record<string, string> = {
  character: "⚔",
  event: "✦",
  location: "🌍",
  tech: "⚙",
};

interface CardProps {
  card: CardDef;
  faceDown?: boolean;
  selected?: boolean;
  canPlay?: boolean;
  canAttack?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function Card({
  card,
  faceDown = false,
  selected = false,
  canPlay = false,
  canAttack = false,
  onClick,
  compact = false,
}: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const h = compact ? "h-28" : "h-36";
  const w = compact ? "w-20" : "w-24";

  if (faceDown) {
    return (
      <div
        className={`${w} ${h} rounded-xl border-2 border-cosmic-border bg-cosmic-surface flex items-center justify-center shrink-0 cursor-default`}
      >
        <span className="text-2xl text-cosmic-muted">🂠</span>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        ${w} ${h} rounded-xl border-2 cursor-pointer shrink-0 select-none
        ${TYPE_COLORS[card.type] || "border-cosmic-border bg-cosmic-surface"}
        ${selected ? "ring-2 ring-electric-blue shadow-lg shadow-electric-blue/30 scale-105" : ""}
        ${canPlay ? "ring-1 ring-gold-accent/50 hover:ring-gold-accent" : ""}
        ${canAttack ? "ring-2 ring-red-400 animate-pulse-glow" : ""}
        transition-all duration-200
      `}
    >
      <div className="flex flex-col h-full p-1.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-cosmic-muted">
            {TYPE_ICONS[card.type]} {card.cost}Mana
          </span>
          {card.power > 0 && (
            <span className="text-[10px] font-bold text-red-400">
              ⚔{card.power}
            </span>
          )}
        </div>
        {/* Name */}
        <p className={`text-[10px] font-bold text-cosmic-text leading-tight mb-1 ${compact ? "line-clamp-1" : "line-clamp-2"}`}>
          {card.name}
        </p>
        {/* Type badge */}
        <span className="text-[8px] px-1 py-0.5 rounded bg-cosmic-dark/50 text-cosmic-muted self-start mb-auto">
          {card.type}
        </span>
        {/* Description */}
        <p className={`text-[8px] text-cosmic-muted leading-tight mt-1 ${compact ? "line-clamp-1" : "line-clamp-2"}`}>
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}
