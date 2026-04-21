"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swords, ChevronRight, Shield, Zap, Skull } from "lucide-react";
import { ENEMIES } from "@/lib/card-data";
import { useGameStore } from "@/lib/game-store";
import { ALL_CARDS } from "@/lib/card-data";

function difficultyBadge(maxHp: number) {
  if (maxHp >= 41)
    return { text: "BOSS", cls: "text-red-400 border-red-500/40 bg-red-500/10", icon: <Skull className="w-4 h-4 text-red-400" /> };
  if (maxHp >= 26)
    return { text: "HARD", cls: "text-orange-400 border-orange-500/40 bg-orange-500/10", icon: <Swords className="w-4 h-4 text-orange-400" /> };
  return { text: "NORMAL", cls: "text-green-400 border-green-500/40 bg-green-500/10", icon: <Shield className="w-4 h-4 text-green-400" /> };
}

export default function CardGamePage() {
  const router = useRouter();
  const selectEnemy = useGameStore((s) => s.selectEnemy);

  const handleBattle = (enemyId: string) => {
    const enemy = ENEMIES.find((e) => e.id === enemyId);
    if (!enemy) return;
    selectEnemy(enemy, ALL_CARDS);
    router.push("/card-game/battle");
  };

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors">
            ← ホームに戻る
          </Link>
          <span className="text-cosmic-border">|</span>
          <Swords className="w-5 h-5 text-rose-400" />
          <h1 className="text-sm font-bold text-cosmic-gradient">EDU CARD GAME</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-black text-cosmic-gradient mb-2"
          >
            EDU CARD GAME
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-cosmic-muted"
          >
            PvE — バトルする敵を選べ
          </motion.p>
        </div>

        {/* Enemy Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ENEMIES.map((enemy, i) => {
            const diff = difficultyBadge(enemy.maxHp);
            return (
              <motion.div
                key={enemy.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="glass-card glass-card-hover rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                  {/* Enemy Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-cosmic-deep flex items-center justify-center">
                    <img
                      src={enemy.imageUrl}
                      alt={enemy.name}
                      className="w-24 h-24 object-contain opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-cosmic-dark/30 to-transparent" />
                    {/* Difficulty badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diff.cls}`}>
                        {diff.text}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-cosmic-text mb-2">{enemy.name}</h3>

                    <div className="flex items-center gap-4 text-xs text-cosmic-muted mb-3">
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

                    <p className="text-[11px] text-cosmic-muted leading-relaxed line-clamp-2 mb-3">
                      {enemy.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-cosmic-muted">
                        {diff.icon}
                        <span>{diff.text} モード</span>
                      </div>
                      <button
                        onClick={() => handleBattle(enemy.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-400 text-xs font-bold hover:bg-rose-500/30 hover:scale-[1.03] transition-all"
                      >
                        バトル開始
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[10px] text-gold-accent/60 mt-2">
                      🏆 {enemy.reward}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card rounded-xl p-6"
        >
          <h3 className="text-sm font-bold text-cosmic-gradient mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> 遊び方
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-cosmic-muted">
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">カードを出す</p>
              <p>手札のカードをクリックして使用。マナを消費します。</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">ターン制バトル</p>
              <p>毎ターンマナが回復。カードを出し終えたらターン終了。</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">エネミーの攻撃</p>
              <p>HPが減るとエネミーが強化される。フェーズに注意！</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">勝利条件</p>
              <p>敵のHPを0にすれば勝利。防御カードでダメージを軽減しよう。</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
