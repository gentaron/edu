"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Heart, Droplets } from "lucide-react";
import { useGameStore } from "@/lib/game-store";
import { ALL_CARDS } from "@/lib/card-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Mini Card Component ─── */
function GameCardView({
  card,
  playable,
  onClick,
  inField = false,
}: {
  card: {
    id: string;
    name: string;
    type: string;
    attack: number;
    defense: number;
    cost: number;
    effect?: string;
    imageUrl: string;
  };
  playable: boolean;
  onClick?: () => void;
  inField?: boolean;
}) {
  const typeColors: Record<string, string> = {
    攻撃: "border-red-400/50 bg-red-500/10",
    防御: "border-blue-400/50 bg-blue-500/10",
    効果: "border-purple-400/50 bg-purple-500/10",
  };
  const typeBadge: Record<string, string> = {
    攻撃: "text-red-400 bg-red-500/20",
    防御: "text-blue-400 bg-blue-500/20",
    効果: "text-purple-400 bg-purple-500/20",
  };

  return (
    <motion.button
      layout
      whileHover={playable && !inField ? { y: -8, scale: 1.05 } : {}}
      whileTap={playable && !inField ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={!playable}
      className={`relative w-28 h-40 rounded-xl border backdrop-blur-sm flex flex-col items-center justify-between p-2 transition-all duration-200 shrink-0 ${
        typeColors[card.type] || "border-cosmic-border/50 bg-cosmic-surface/50"
      } ${!playable ? "opacity-40 cursor-not-allowed" : inField ? "cursor-default" : "cursor-pointer"}`}
    >
      {/* Cost */}
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-nebula-purple border border-nebula-purple/50 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{card.cost}</span>
      </div>

      {/* Image */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-cosmic-deep/50 mb-1">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Name */}
      <p className="text-[9px] font-bold text-cosmic-text text-center leading-tight line-clamp-2">
        {card.name}
      </p>

      {/* Type Badge */}
      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${typeBadge[card.type] || ""}`}>
        {card.type}
      </span>

      {/* Stats or Effect */}
      <div className="flex items-center gap-2 text-[9px]">
        {card.type === "攻撃" && (
          <span className="text-red-400 font-bold">ATK {card.attack}</span>
        )}
        {card.type === "防御" && (
          <span className="text-blue-400 font-bold">DEF {card.defense}</span>
        )}
        {card.type === "効果" && card.effect && (
          <span className="text-purple-300 text-[8px] text-center leading-tight">
            {card.effect}
          </span>
        )}
      </div>
    </motion.button>
  );
}

/* ─── HP Bar ─── */
function HpBar({ current, max, color = "rose" }: { current: number; max: number; color?: string }) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = color === "rose" ? "bg-rose-500" : "bg-emerald-500";
  return (
    <div className="w-full h-3 bg-cosmic-deep rounded-full overflow-hidden border border-cosmic-border/30">
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={{ width: "100%" }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─── Mana Display ─── */
function ManaDisplay({ current, max }: { current: number; max: number }) {
  const orbs = Array.from({ length: max }, (_, i) => i < current);
  return (
    <div className="flex items-center gap-1">
      <Droplets className="w-3.5 h-3.5 text-electric-blue" />
      <div className="flex gap-0.5">
        {orbs.map((filled, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              filled ? "bg-electric-blue" : "bg-cosmic-deep border border-cosmic-border/30"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] text-cosmic-muted ml-1">{current}/{max}</span>
    </div>
  );
}

/* ─── Main Battle Page ─── */
export default function BattlePage() {
  const router = useRouter();
  const logRef = useRef<HTMLDivElement>(null);

  const phase = useGameStore((s) => s.phase);
  const playerHp = useGameStore((s) => s.playerHp);
  const playerMaxHp = useGameStore((s) => s.playerMaxHp);
  const playerMana = useGameStore((s) => s.playerMana);
  const hand = useGameStore((s) => s.hand);
  const field = useGameStore((s) => s.field);
  const selectedEnemy = useGameStore((s) => s.selectedEnemy);
  const enemyHp = useGameStore((s) => s.enemyHp);
  const turn = useGameStore((s) => s.turn);
  const log = useGameStore((s) => s.log);
  const shieldBuffer = useGameStore((s) => s.shieldBuffer);

  const playCard = useGameStore((s) => s.playCard);
  const endTurn = useGameStore((s) => s.endTurn);
  const resetGame = useGameStore((s) => s.resetGame);

  // Redirect if no enemy selected
  useEffect(() => {
    if (!selectedEnemy) {
      router.replace("/card-game");
    }
  }, [selectedEnemy, router]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  if (!selectedEnemy) return null;

  const maxMana = Math.min(turn + 2, 6);
  const isPlayerTurn = phase === "main";
  const isVictory = phase === "victory";
  const isDefeat = phase === "defeat";

  return (
    <div className="min-h-screen bg-cosmic-dark flex flex-col">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50 shrink-0">
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
          <span className="text-[10px] text-cosmic-muted ml-auto">
            ターン {turn}
          </span>
        </div>
      </div>

      {/* 3-Row Battle Layout */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-4 gap-3 overflow-hidden">
        {/* ── Top: Enemy Area ── */}
        <motion.div
          animate={phase === "enemy" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-xl p-4 shrink-0"
        >
          <div className="flex items-start gap-4">
            {/* Enemy Image */}
            <div className="w-24 h-24 rounded-xl bg-cosmic-deep/50 border border-cosmic-border/30 flex items-center justify-center shrink-0">
              <img
                src={selectedEnemy.imageUrl}
                alt={selectedEnemy.name}
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Enemy Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-cosmic-text mb-1">
                {selectedEnemy.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <HpBar current={enemyHp} max={selectedEnemy.maxHp} />
                <span className="text-xs font-bold text-rose-400 whitespace-nowrap">
                  {enemyHp}/{selectedEnemy.maxHp}
                </span>
              </div>

              {/* Phase messages from log (last 3 log entries) */}
              <div className="space-y-0.5 min-h-[2.5rem]">
                {log
                  .filter((l) => l.startsWith("⚠️") || l.startsWith("👻"))
                  .slice(-1)
                  .map((msg, i) => (
                    <p key={i} className="text-[10px] text-red-400 font-medium animate-pulse">
                      {msg}
                    </p>
                  ))}
              </div>

              {/* Recent log */}
              <div className="mt-2 space-y-0.5 max-h-12 overflow-hidden">
                {log.slice(-3).map((msg, i) => (
                  <p key={i} className="text-[9px] text-cosmic-muted/60 truncate">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Middle: Field Area ── */}
        <div className="glass-card rounded-xl p-3 shrink-0 min-h-[6rem]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-cosmic-muted uppercase tracking-widest">
              フィールド
            </span>
            {shieldBuffer > 0 && (
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded px-1.5 py-0.5">
                🛡️ シールド+{shieldBuffer}
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {field.length === 0 ? (
              <div className="flex items-center justify-center w-full text-[10px] text-cosmic-muted/40">
                カードをここにドロップ
              </div>
            ) : (
              field.map((card) => (
                <GameCardView
                  key={card.id}
                  card={card}
                  playable={false}
                  inField
                />
              ))
            )}
          </div>
        </div>

        {/* ── Bottom: Player Area ── */}
        <div className="glass-card rounded-xl p-3 flex-1 flex flex-col min-h-0">
          {/* Player Status */}
          <div className="flex items-center gap-4 mb-3 shrink-0">
            <div className="flex items-center gap-2 flex-1">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <HpBar current={playerHp} max={playerMaxHp} color="emerald" />
              <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">
                {playerHp}/{playerMaxHp}
              </span>
            </div>
            <ManaDisplay current={playerMana} max={maxMana} />
          </div>

          {/* Hand */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            <AnimatePresence mode="popLayout">
              {hand.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCardView
                    card={card}
                    playable={isPlayerTurn && playerMana >= card.cost}
                    onClick={() => playCard(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* End Turn Button */}
          <div className="mt-auto shrink-0">
            <button
              onClick={endTurn}
              disabled={!isPlayerTurn}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                isPlayerTurn
                  ? "bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple hover:bg-nebula-purple/30 hover:scale-[1.01]"
                  : "bg-cosmic-deep/50 border border-cosmic-border/20 text-cosmic-muted cursor-not-allowed"
              }`}
            >
              {phase === "enemy" ? "敵の攻撃中..." : "ターン終了"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Victory Modal ── */}
      <Dialog open={isVictory} onOpenChange={() => {}}>
        <DialogContent className="bg-cosmic-dark border-gold-accent/50 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-black text-gold-accent">
              勝利！
            </DialogTitle>
            <DialogDescription className="text-center text-cosmic-muted">
              {selectedEnemy.name} を撃破した！
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-gold-accent font-medium">
              🏆 {selectedEnemy.reward}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const { selectEnemy } = useGameStore.getState();
                  selectEnemy(selectedEnemy, ALL_CARDS);
                }}
                className="py-2 rounded-lg bg-gold-accent/20 border border-gold-accent/40 text-gold-accent text-sm font-bold hover:bg-gold-accent/30 transition-all"
              >
                もう一度
              </button>
              <button
                onClick={() => {
                  resetGame();
                  router.push("/card-game");
                }}
                className="py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all"
              >
                敵選択に戻る
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Defeat Modal ── */}
      <Dialog open={isDefeat} onOpenChange={() => {}}>
        <DialogContent className="bg-cosmic-dark border-red-500/50 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-black text-red-400">
              敗北...
            </DialogTitle>
            <DialogDescription className="text-center text-cosmic-muted">
              {selectedEnemy.name} に倒された...
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4 space-y-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const { selectEnemy } = useGameStore.getState();
                  selectEnemy(selectedEnemy, ALL_CARDS);
                }}
                className="py-2 rounded-lg bg-red-500/20 border border-red-400/40 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all"
              >
                リトライ
              </button>
              <button
                onClick={() => {
                  resetGame();
                  router.push("/card-game");
                }}
                className="py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all"
              >
                敵選択に戻る
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
