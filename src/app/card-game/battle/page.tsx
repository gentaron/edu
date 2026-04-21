"use client";

import React, { useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Heart,
  Droplets,
  Shield,
  Skull,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { ENEMIES, type GameCard, type CardType } from "@/lib/card-data";
import { useDeckStore, useBattleStore } from "@/lib/game-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Card Type Colors ─── */
const typeStyles: Record<CardType, { border: string; bg: string; badge: string }> = {
  攻撃: { border: "border-red-400/50", bg: "bg-red-500/10", badge: "bg-red-500/20 text-red-400" },
  防御: { border: "border-blue-400/50", bg: "bg-blue-500/10", badge: "bg-blue-500/20 text-blue-400" },
  効果: { border: "border-purple-400/50", bg: "bg-purple-500/10", badge: "bg-purple-500/20 text-purple-400" },
  必殺: { border: "border-yellow-400/50", bg: "bg-yellow-500/10", badge: "bg-yellow-500/20 text-yellow-400" },
};

/* ─── Hand Card ─── */
function HandCard({
  card,
  playable,
  onClick,
  isSpiderRestricted,
}: {
  card: GameCard;
  playable: boolean;
  onClick: () => void;
  isSpiderRestricted: boolean;
}) {
  const ts = typeStyles[card.type];
  const disabled = !playable || isSpiderRestricted;
  const reason = isSpiderRestricted ? "今ターンは1枚のみ" : "";

  return (
    <motion.button
      layout
      whileHover={disabled ? {} : { y: -8 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={reason}
      className={`relative w-28 h-40 rounded-xl border backdrop-blur-sm flex flex-col items-center justify-between p-2 transition-all duration-200 shrink-0 ${ts.border} ${ts.bg} ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${card.rarity === "SR" ? "shadow-yellow-400/20 shadow-md" : ""}`}
    >
      {/* Cost */}
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-nebula-purple border border-nebula-purple/50 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">{card.cost}</span>
      </div>

      {/* Rarity badge */}
      {card.rarity !== "C" && (
        <div className="absolute top-0.5 left-0.5">
          <span className={`text-[7px] font-bold ${card.rarity === "SR" ? "text-yellow-400" : "text-blue-400"}`}>
            {card.rarity}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-cosmic-deep/50 mb-1">
        <img src={card.imageUrl} alt={card.name} className="w-full h-full object-contain" />
      </div>

      {/* Name */}
      <p className="text-[8px] font-bold text-cosmic-text text-center leading-tight line-clamp-2">
        {card.name}
      </p>

      {/* Type Badge */}
      <span className={`text-[7px] font-bold px-1 py-0.5 rounded ${ts.badge}`}>{card.type}</span>

      {/* Stats */}
      <div className="text-[8px] text-center">
        {card.type === "攻撃" && <span className="text-red-400 font-bold">ATK {card.attack}</span>}
        {card.type === "防御" && <span className="text-blue-400 font-bold">DEF {card.defense}</span>}
        {card.type === "効果" && card.effect && (
          <span className="text-purple-300 leading-tight">{card.effect}</span>
        )}
        {card.type === "必殺" && <span className="text-yellow-400 font-bold">ATK {card.attack}</span>}
      </div>
    </motion.button>
  );
}

/* ─── HP Bar ─── */
function HpBar({ current, max, color }: { current: number; max: number; color: "rose" | "emerald" }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const cls = color === "rose" ? "bg-rose-500" : "bg-emerald-500";
  return (
    <div className="w-full h-3 bg-cosmic-deep rounded-full overflow-hidden border border-cosmic-border/30">
      <motion.div
        className={`h-full rounded-full ${cls}`}
        initial={{ width: "100%" }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─── Battle Content (needs useSearchParams) ─── */
function BattleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logRef = useRef<HTMLDivElement>(null);

  const deck = useDeckStore((s) => s.deck);

  const phase = useBattleStore((s) => s.phase);
  const playerHp = useBattleStore((s) => s.playerHp);
  const playerMaxHp = useBattleStore((s) => s.playerMaxHp);
  const playerMana = useBattleStore((s) => s.playerMana);
  const shieldBuffer = useBattleStore((s) => s.shieldBuffer);
  const hand = useBattleStore((s) => s.hand);
  const battleDeck = useBattleStore((s) => s.battleDeck);
  const discard = useBattleStore((s) => s.discard);
  const selectedEnemy = useBattleStore((s) => s.selectedEnemy);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const enemyCurrentPhase = useBattleStore((s) => s.enemyCurrentPhase);
  const turn = useBattleStore((s) => s.turn);
  const cardsPlayedThisTurn = useBattleStore((s) => s.cardsPlayedThisTurn);
  const poisonActive = useBattleStore((s) => s.poisonActive);
  const log = useBattleStore((s) => s.log);

  const startBattle = useBattleStore((s) => s.startBattle);
  const playCard = useBattleStore((s) => s.playCard);
  const endTurn = useBattleStore((s) => s.endTurn);
  const resetBattle = useBattleStore((s) => s.resetBattle);

  // Start battle on mount
  useEffect(() => {
    const enemyId = searchParams.get("enemy");
    if (enemyId && !selectedEnemy) {
      const enemy = ENEMIES.find((e) => e.id === enemyId);
      if (enemy && deck.length >= 20) {
        startBattle(enemy, deck);
      } else {
        router.replace("/card-game/select");
      }
    } else if (!selectedEnemy) {
      router.replace("/card-game/select");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const handleRetry = useCallback(() => {
    resetBattle();
    router.push("/card-game/select");
  }, [resetBattle, router]);

  const handleDeckChange = useCallback(() => {
    resetBattle();
    router.push("/card-game");
  }, [resetBattle, router]);

  if (!selectedEnemy) return null;

  const maxMana = Math.min(turn + 1, 6);
  const isPlayerTurn = phase === "main";
  const isVictory = phase === "victory";
  const isDefeat = phase === "defeat";

  const isSpiderRestricted =
    selectedEnemy.id === "void-spider" && turn % 2 === 0 && cardsPlayedThisTurn >= 1;

  const phaseMessages = log.filter(
    (l) => l.startsWith("⚠️") || l.startsWith("🌪️") || l.startsWith("💚")
  );
  const lastPhaseMsg = phaseMessages.slice(-1);

  return (
    <div className="min-h-screen bg-cosmic-dark flex flex-col">
      {/* Header */}
      <div className="glass-card border-b border-cosmic-border/50 shrink-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          <Link href="/card-game/select" className="text-xs text-cosmic-muted hover:text-cosmic-text transition-colors">
            ← 敵選択
          </Link>
          <span className="text-cosmic-border">|</span>
          <Swords className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-cosmic-gradient">Battle</span>
          <span className="text-[10px] text-cosmic-muted ml-auto">ターン {turn}</span>
        </div>
      </div>

      {/* 3-Row Layout */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-3 gap-3 overflow-hidden">

        {/* ── Top: Enemy Area ── */}
        <motion.div
          animate={phase === "enemy" ? { x: [0, -12, 12, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-xl p-4 shrink-0"
        >
          <div className="flex items-start gap-4">
            {/* Enemy image */}
            <div className="w-20 h-20 rounded-xl bg-cosmic-deep/50 border border-cosmic-border/30 flex items-center justify-center shrink-0">
              <img src={selectedEnemy.imageUrl} alt={selectedEnemy.name} className="w-16 h-16 object-contain" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-sm font-bold text-cosmic-text">{selectedEnemy.name}</h3>
                <span className="text-[10px] text-cosmic-muted">{selectedEnemy.title}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${diffColors[selectedEnemy.difficulty].badge}`}>
                  {selectedEnemy.difficulty}
                </span>
              </div>

              {/* HP Bar */}
              <div className="flex items-center gap-2 mb-1.5">
                <Heart className="w-3 h-3 text-rose-400 shrink-0" />
                <HpBar current={enemyHp} max={selectedEnemy.maxHp} color="rose" />
                <span className="text-[10px] font-bold text-rose-400 whitespace-nowrap">
                  {enemyHp}/{selectedEnemy.maxHp}
                </span>
              </div>

              {/* Phase message */}
              <div className="min-h-[1.2rem]">
                <AnimatePresence>
                  {lastPhaseMsg.map((msg, i) => (
                    <motion.p
                      key={`${turn}-${i}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-red-400 font-medium"
                    >
                      {msg}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>

              {/* Special rule */}
              {selectedEnemy.specialRule && (
                <p className="text-[9px] text-amber-400/50">
                  ⚡ {selectedEnemy.specialRule}
                </p>
              )}

              {/* Log */}
              <div ref={logRef} className="mt-2 space-y-0.5 max-h-16 overflow-hidden">
                {log.slice(-4).map((msg, i) => (
                  <p key={i} className="text-[9px] text-cosmic-muted/60 truncate">
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Middle: Battle Info ── */}
        <div className="glass-card rounded-xl p-3 shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Player HP */}
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <HpBar current={playerHp} max={playerMaxHp} color="emerald" />
              <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                {playerHp}/{playerMaxHp}
              </span>
            </div>

            {/* Mana */}
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-electric-blue" />
              {Array.from({ length: maxMana }, (_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < playerMana ? "bg-electric-blue" : "bg-cosmic-deep border border-cosmic-border/30"
                  }`}
                />
              ))}
              <span className="text-[9px] text-cosmic-muted ml-0.5">{playerMana}/{maxMana}</span>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-1.5">
              {shieldBuffer > 0 && (
                <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                  <Shield className="w-3 h-3" /> {shieldBuffer}
                </span>
              )}
              {poisonActive && (
                <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-400/20 rounded px-1.5 py-0.5">
                  ☠️ 毒
                </span>
              )}
              {isSpiderRestricted && (
                <span className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-400/20 rounded px-1.5 py-0.5">
                  🕸️ 1枚制限
                </span>
              )}
            </div>

            {/* Deck / Discard counts */}
            <div className="text-[9px] text-cosmic-muted flex items-center gap-2">
              <span>山札: {battleDeck.length}</span>
              <span>墓地: {discard.length}</span>
            </div>
          </div>
        </div>

        {/* ── Bottom: Player Area ── */}
        <div className="glass-card rounded-xl p-3 flex-1 flex flex-col min-h-0">
          {/* Hand */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 flex-1 items-end">
            <AnimatePresence mode="popLayout">
              {hand.map((card) => (
                <motion.div
                  key={card.id + "_" + turn + "_" + hand.indexOf(card)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <HandCard
                    card={card}
                    playable={isPlayerTurn && playerMana >= card.cost}
                    onClick={() => playCard(card.id)}
                    isSpiderRestricted={isSpiderRestricted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* End Turn */}
          <div className="shrink-0">
            <button
              onClick={endTurn}
              disabled={!isPlayerTurn}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                isPlayerTurn
                  ? "bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple hover:bg-nebula-purple/30"
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
          <div className="text-center py-4 space-y-4">
            <p className="text-sm text-gold-accent font-medium">🏆 {selectedEnemy.reward}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRetry}
                className="py-2 rounded-lg bg-gold-accent/20 border border-gold-accent/40 text-gold-accent text-sm font-bold hover:bg-gold-accent/30 transition-all"
              >
                もう一度挑戦
              </button>
              <button
                onClick={handleDeckChange}
                className="py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all"
              >
                デッキを変える
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
              {selectedEnemy.name} に倒された…
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-cosmic-muted">
              敵残りHP: <span className="text-rose-400 font-bold">{enemyHp}</span> /
              <span className="text-cosmic-muted">{selectedEnemy.maxHp}</span>
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRetry}
                className="py-2 rounded-lg bg-red-500/20 border border-red-400/40 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all"
              >
                もう一度挑戦
              </button>
              <button
                onClick={handleDeckChange}
                className="py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all"
              >
                デッキを変える
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Diff colors for enemy area ─── */
const diffColors: Record<string, { badge: string }> = {
  NORMAL: { badge: "text-green-400 bg-green-500/10 border-green-500/40" },
  HARD: { badge: "text-orange-400 bg-orange-500/10 border-orange-500/40" },
  BOSS: { badge: "text-red-400 bg-red-500/10 border-red-500/40" },
  FINAL: { badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40" },
};

/* ─── Main Page (wraps with Suspense for useSearchParams) ─── */
export default function BattlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-cosmic-muted">バトルを準備中...</p>
          </div>
        </div>
      }
    >
      <BattleContent />
    </Suspense>
  );
}
