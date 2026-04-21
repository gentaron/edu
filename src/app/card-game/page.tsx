"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swords, ChevronRight, Shield, Zap, Skull } from "lucide-react";
import type { EnemyData } from "@/lib/game-engine";

const API_ENEMIES = "/api/enemies";

export default function CardGamePage() {
  const router = useRouter();
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENEMIES)
      .then((r) => r.json())
      .then(setEnemies)
      .finally(() => setLoading(false));
  }, []);

  const difficultyLabel = (maxHp: number) => {
    if (maxHp >= 50) return { text: "HARD", color: "text-red-400 border-red-500/40 bg-red-500/10" };
    if (maxHp >= 30) return { text: "NORMAL", color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" };
    return { text: "EASY", color: "text-green-400 border-green-500/40 bg-green-500/10" };
  };

  const difficultyIcon = (maxHp: number) => {
    if (maxHp >= 50) return <Skull className="w-5 h-5 text-red-400" />;
    if (maxHp >= 30) return <Swords className="w-5 h-5 text-yellow-400" />;
    return <Shield className="w-5 h-5 text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors"
            >
              ← EDU
            </Link>
            <span className="text-cosmic-border">|</span>
            <Swords className="w-5 h-5 text-rose-400" />
            <h1 className="text-sm font-bold text-cosmic-gradient">EDU Card Game — PvE</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-cosmic-gradient mb-2">
            エネミーを選択
          </h2>
          <p className="text-sm text-cosmic-muted">
            E16連星系の脅威に立ち向かえ。カードをドラッグして戦闘を開始。
          </p>
        </div>

        {/* Enemy Selection */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto"
            />
            <p className="text-xs text-cosmic-muted mt-4">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {enemies.map((enemy, i) => {
              const diff = difficultyLabel(enemy.maxHp);
              return (
                <motion.button
                  key={enemy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => router.push(`/card-game/battle/${enemy.id}`)}
                  className="group glass-card glass-card-hover rounded-xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 overflow-hidden">
                    <img
                      src={enemy.imageUrl}
                      alt={enemy.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-cosmic-dark/40 to-transparent" />

                    {/* Difficulty badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${diff.color}`}
                      >
                        {diff.text}
                      </span>
                    </div>

                    {/* Bottom info overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base font-bold text-cosmic-text mb-1">
                        {enemy.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-cosmic-muted">
                        <span>
                          HP: <span className="text-rose-400 font-bold">{enemy.maxHp}</span>
                        </span>
                        <span>
                          ATK: <span className="text-orange-400 font-bold">{enemy.attack}</span>
                        </span>
                        <span>
                          Phase:{" "}
                          <span className="text-yellow-400 font-bold">
                            {enemy.maxHp >= 50 ? 3 : enemy.maxHp >= 30 ? 2 : 1}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <p className="text-[11px] text-cosmic-muted leading-relaxed line-clamp-2 mb-3">
                      {enemy.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-cosmic-muted">
                        {difficultyIcon(enemy.maxHp)}
                        <span>{diff.text} モード</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cosmic-muted group-hover:text-electric-blue transition-colors" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* How to play */}
        <div className="mt-12 glass-card rounded-xl p-6">
          <h3 className="text-sm font-bold text-cosmic-gradient mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> 遊び方
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-cosmic-muted">
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">ターン制バトル</p>
              <p>毎ターン3MP回復。手札からカードを場に出して敵にダメージを与えよう。</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">カードを出す</p>
              <p>手札をクリックするか、場エリアにドラッグ＆ドロップ。コスト（MP）を消費。</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">エネミーの攻撃</p>
              <p>「ターン終了」で敵ターンへ。フェーズが進むと攻撃が激しくなる。</p>
            </div>
            <div className="space-y-1">
              <p className="text-cosmic-text font-medium">勝利条件</p>
              <p>敵のHPを0にすれば勝利。自分のHPが0になると敗北。墓地が切れたらリシャッフル。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
