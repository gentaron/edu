"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CardData } from "@/lib/game-engine";

type Props = {
  card: CardData;
  onClick?: () => void;
  isDraggable?: boolean;
  variant?: "hand" | "field" | "select";
};

export default function PlayerCard({
  card,
  onClick,
  isDraggable = false,
  variant = "hand",
}: Props) {
  const sizeClass =
    variant === "hand"
      ? "w-28 h-40 sm:w-32 sm:h-44"
      : variant === "field"
      ? "w-24 h-34 sm:w-28 sm:h-38"
      : "w-32 h-44 sm:w-36 sm:h-48";

  return (
    <motion.div
      layout
      whileHover={variant === "hand" ? { y: -12, scale: 1.05 } : { scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${sizeClass} rounded-xl border border-cosmic-border/60 bg-gradient-to-br from-cosmic-surface/90 to-cosmic-dark/90 backdrop-blur-sm cursor-pointer select-none overflow-hidden flex flex-col shadow-lg shadow-cosmic-dark/50 transition-shadow hover:shadow-nebula-purple/20 ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative h-20 sm:h-24 overflow-hidden bg-cosmic-dark/50">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/80 to-transparent" />
        {/* Cost badge */}
        <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-electric-blue/90 flex items-center justify-center text-[10px] font-bold text-white border border-electric-blue/40">
          {card.cost}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-2 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-bold text-cosmic-text leading-tight line-clamp-2">
            {card.name}
          </p>
          {card.effect && (
            <p className="text-[9px] text-cosmic-muted mt-0.5 leading-tight line-clamp-2">
              {card.effect}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-1">
          {card.attack > 0 && (
            <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5">
              ⚔ {card.attack}
            </span>
          )}
          {card.defense > 0 && (
            <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
              🛡 {card.defense}
            </span>
          )}
          {card.attack === 0 && card.defense === 0 && (
            <span className="text-[10px] text-cosmic-muted">—</span>
          )}
          {card.flavorText && (
            <span className="text-[8px] text-cosmic-muted/60 italic truncate max-w-[60%] text-right">
              {card.flavorText}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
