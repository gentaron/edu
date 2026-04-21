"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  turn: number;
  phase: string;
};

export default function PlayerStatus({ hp, maxHp, mana, maxMana, turn, phase }: Props) {
  const hpPercent = (hp / maxHp) * 100;

  const phaseLabels: Record<string, string> = {
    draw: "ドロー",
    main: "メイン",
    enemy: "敵ターン",
    result: "結果",
  };
  const phaseColors: Record<string, string> = {
    draw: "text-cyan-400",
    main: "text-green-400",
    enemy: "text-rose-400",
    result: "text-gold-accent",
  };

  return (
    <div className="glass-card rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between gap-4">
        {/* HP */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-400 font-medium flex items-center gap-1">
              ❤️ HP
            </span>
            <span className="text-cosmic-text font-bold">
              {hp} / {maxHp}
            </span>
          </div>
          <div className="h-2.5 bg-cosmic-dark/80 rounded-full overflow-hidden border border-cosmic-border/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Mana */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-electric-blue font-medium">💎 MP</span>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: maxMana }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm border ${
                  i < mana
                    ? "bg-electric-blue border-electric-blue/60"
                    : "bg-cosmic-dark/80 border-cosmic-border/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Turn & Phase */}
        <div className="text-right">
          <div className="text-[10px] text-cosmic-muted">ターン</div>
          <div className="text-sm font-bold text-cosmic-text">{turn}</div>
          <div className={`text-[10px] font-bold ${phaseColors[phase] || "text-cosmic-muted"}`}>
            {phaseLabels[phase] || phase}
          </div>
        </div>
      </div>
    </div>
  );
}
