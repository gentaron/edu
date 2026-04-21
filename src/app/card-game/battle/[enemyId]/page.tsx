"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swords } from "lucide-react";
import { useGameStore, type EnemyData } from "@/lib/game-engine";
import BattleField from "@/components/card-game/BattleField";

const API_ENEMIES = "/api/enemies";

export default function BattlePage() {
  const params = useParams();
  const enemyId = params.enemyId as string;
  const [loading, setLoading] = useState(true);
  const startBattle = useGameStore((s) => s.startBattle);

  useEffect(() => {
    fetch(API_ENEMIES)
      .then((r) => r.json())
      .then((enemies: EnemyData[]) => {
        const enemy = enemies.find((e) => e.id === enemyId);
        if (enemy) {
          startBattle(enemy);
        }
      })
      .finally(() => setLoading(false));
  }, [enemyId, startBattle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-cosmic-muted">バトルを準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Minimal header */}
      <div className="glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          <Link
            href="/card-game"
            className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors"
          >
            ← エネミー選択
          </Link>
          <span className="text-cosmic-border">|</span>
          <Swords className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-cosmic-gradient">Battle</span>
        </div>
      </div>

      <BattleField />
    </div>
  );
}
