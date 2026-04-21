"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EnemyData } from "@/lib/game-engine";

type Props = {
  enemy: EnemyData;
  enemyHp: number;
  enemyPhase: number;
  isShaking: boolean;
};

export default function EnemyPanel({ enemy, enemyHp, enemyPhase, isShaking }: Props) {
  const maxHp = enemy.maxHp;
  const hpPercent = (enemyHp / maxHp) * 100;
  const phaseNames: Record<number, string> = { 1: "通常", 2: "強化", 3: "最終" };
  const phaseColors: Record<number, string> = {
    1: "bg-yellow-500",
    2: "bg-orange-500",
    3: "bg-red-500",
  };

  return (
    <motion.div
      animate={
        isShaking
          ? { x: [0, -10, 10, -8, 8, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Enemy Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-rose-500/30 flex-shrink-0">
          <img
            src={enemy.imageUrl}
            alt={enemy.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/60 to-transparent" />
          {/* Phase indicator */}
          <div className="absolute top-1 right-1">
            <span
              className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${phaseColors[enemyPhase]} bg-opacity-90`}
            >
              {phaseNames[enemyPhase] || `P${enemyPhase}`}
            </span>
          </div>
        </div>

        {/* Enemy Info */}
        <div className="flex-1 w-full space-y-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-cosmic-text">
              {enemy.name}
            </h3>
            {enemy.description && (
              <p className="text-[10px] text-cosmic-muted leading-relaxed">
                {enemy.description}
              </p>
            )}
          </div>

          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-400 font-medium">HP</span>
              <span className="text-cosmic-text">
                {enemyHp} / {maxHp}
              </span>
            </div>
            <div className="h-3 bg-cosmic-dark/80 rounded-full overflow-hidden border border-cosmic-border/50">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    hpPercent > 60
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : hpPercent > 30
                      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                      : "linear-gradient(90deg, #ef4444, #f87171)",
                }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-[10px] text-cosmic-muted">
            <span>ATK: <span className="text-rose-400 font-bold">{enemy.attack}</span></span>
            <span>Phase: <span className="text-yellow-400 font-bold">{enemyPhase}</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
