"use client";

import React from "react";
import Card from "./Card";
import type { BoardSlot, PlayerState } from "../_lib/rules";

interface BoardProps {
  player: PlayerState;
  isOpponent?: boolean;
  selectedAttacker: number | null;
  onSlotClick?: (boardIndex: number) => void;
  label?: string;
}

export default function Board({
  player,
  isOpponent = false,
  selectedAttacker,
  onSlotClick,
  label,
}: BoardProps) {
  return (
    <div className="glass-card rounded-xl p-3">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-cosmic-muted uppercase tracking-wider font-bold">
            {label}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-cosmic-text font-bold">
              HP {player.hp}/{30}
            </span>
            <span className="text-gold-accent">
              💎 {player.mana}/{player.maxMana}
            </span>
            <span className="text-cosmic-muted">
              📚 {player.deck.length}
            </span>
          </div>
        </div>
      )}

      {/* HP bar */}
      <div className="w-full h-2 bg-cosmic-dark rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(player.hp / 30) * 100}%`,
            background:
              player.hp > 20
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : player.hp > 10
                ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                : "linear-gradient(90deg, #ef4444, #f87171)",
          }}
        />
      </div>

      {/* Board slots */}
      <div className="flex gap-2 min-h-[148px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const slot = player.board[i];
          if (slot) {
            return (
              <div
                key={slot.card.id}
                onClick={() => onSlotClick?.(i)}
                className="relative"
              >
                <Card
                  card={slot.card}
                  compact
                  selected={selectedAttacker === i}
                  canAttack={slot.canAttack && !isOpponent}
                />
                {/* Shield overlay */}
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <span className="text-[9px] font-bold text-blue-300 bg-cosmic-dark/80 px-1 rounded">
                    🛡{slot.shield}
                  </span>
                </div>
              </div>
            );
          }
          // Empty slot (drop target)
          return (
            <div
              key={`empty-${i}`}
              className="w-20 h-28 rounded-xl border-2 border-dashed border-cosmic-border/30 bg-cosmic-dark/30 flex items-center justify-center"
            >
              <span className="text-lg text-cosmic-border/40">+</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
