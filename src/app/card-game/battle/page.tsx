"use client";

import React, { useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Heart,
  Shield,
  Crown,
  AlertTriangle,
  Zap,
  Sparkles,
  Crosshair,
  Skull,
} from "lucide-react";
import { ENEMIES, type GameCard, type AbilityType } from "@/lib/card-data";
import { useDeckStore, useBattleStore } from "@/lib/game-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ─── Ability Button ─── */
function AbilityButton({
  label,
  icon,
  value,
  subLabel,
  color,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  subLabel?: string;
  color: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 rounded-xl border backdrop-blur-sm p-3 transition-all duration-200 flex flex-col items-center gap-1.5 ${
        disabled
          ? "opacity-30 cursor-not-allowed border-cosmic-border/20 bg-cosmic-deep/30"
          : `cursor-pointer hover:shadow-lg border-opacity-40 ${color}`
      }`}
    >
      {icon}
      <span className="text-xs font-bold text-cosmic-text">{label}</span>
      <span className="text-[10px] font-bold text-cosmic-muted">{value}</span>
      {subLabel && (
        <span className="text-[8px] text-cosmic-muted/70 leading-tight text-center line-clamp-2 max-w-full">
          {subLabel}
        </span>
      )}
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

/* ─── Battle Content ─── */
function BattleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logRef = useRef<HTMLDivElement>(null);

  const deck = useDeckStore((s) => s.deck);

  const phase = useBattleStore((s) => s.phase);
  const playerHp = useBattleStore((s) => s.playerHp);
  const playerMaxHp = useBattleStore((s) => s.playerMaxHp);
  const shieldBuffer = useBattleStore((s) => s.shieldBuffer);
  const selectedEnemy = useBattleStore((s) => s.selectedEnemy);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const enemyCurrentPhase = useBattleStore((s) => s.enemyCurrentPhase);
  const turn = useBattleStore((s) => s.turn);
  const currentCardIndex = useBattleStore((s) => s.currentCardIndex);
  const deckOrder = useBattleStore((s) => s.deckOrder);
  const playerAbility = useBattleStore((s) => s.playerAbility);
  const poisonActive = useBattleStore((s) => s.poisonActive);
  const enemyAttackReduction = useBattleStore((s) => s.enemyAttackReduction);
  const log = useBattleStore((s) => s.log);

  const startBattle = useBattleStore((s) => s.startBattle);
  const playAbility = useBattleStore((s) => s.playAbility);
  const resetBattle = useBattleStore((s) => s.resetBattle);

  const currentCard: GameCard | undefined = deckOrder[currentCardIndex];

  // Start battle on mount
  useEffect(() => {
    const enemyId = searchParams.get("enemy");
    if (enemyId && !selectedEnemy) {
      const enemy = ENEMIES.find((e) => e.id === enemyId);
      if (enemy && deck.length >= 5) {
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

  const isPlayerTurn = phase === "playerTurn";
  const isResolving = phase === "resolving";
  const isVictory = phase === "victory";
  const isDefeat = phase === "defeat";
  const remainingCards = deckOrder.length - currentCardIndex;

  // Check if defense is blocked (void-spider even turn)
  const isDefenseBlocked =
    selectedEnemy.id === "void-spider" && turn % 2 === 0;

  // Check if attack/effect damage is blocked (void-king phase 3)
  const isDamageBlocked =
    selectedEnemy.id === "void-king" && enemyCurrentPhase >= 2;

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
          <span className="text-[10px] text-cosmic-muted ml-auto">
            ターン {turn} | 残り {remainingCards}/{deckOrder.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-3 gap-3 overflow-hidden">

        {/* ── Top: Enemy Area ── */}
        <motion.div
          animate={phase === "enemyTurn" ? { x: [0, -12, 12, -10, 10, 0] } : {}}
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
            </div>
          </div>
        </motion.div>

        {/* ── Middle: Player Status ── */}
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
              {enemyAttackReduction > 0 && (
                <span className="text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-400/20 rounded px-1.5 py-0.5">
                  ⬇ 敵攻撃-{enemyAttackReduction}
                </span>
              )}
              {isDefenseBlocked && (
                <span className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-400/20 rounded px-1.5 py-0.5">
                  🕸️ 防御封じ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom: Card + Abilities + Log ── */}
        {currentCard && !isVictory && !isDefeat && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {/* Current Card Display */}
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-xl p-4 shrink-0"
            >
              <div className="flex items-center gap-4">
                {/* Card Image */}
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-cosmic-deep/50 border border-cosmic-border/30 shrink-0 relative">
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.name}
                    className="w-full h-full object-cover"
                  />
                  {currentCard.rarity !== "C" && (
                    <div className="absolute top-1 left-1">
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                        currentCard.rarity === "SR"
                          ? "bg-yellow-500/30 text-yellow-300 border border-yellow-400/50"
                          : "bg-blue-500/30 text-blue-300 border border-blue-400/50"
                      }`}>
                        {currentCard.rarity}
                      </span>
                    </div>
                  )}
                  {/* Card position */}
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-nebula-purple/80 border border-nebula-purple/50 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{currentCardIndex + 1}</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-cosmic-text mb-0.5">{currentCard.name}</h3>
                  <p className="text-[9px] text-cosmic-muted mb-2">{currentCard.affiliation}</p>

                  {/* Flavor Text */}
                  <p className="text-[9px] text-cosmic-muted/60 italic mb-2 line-clamp-2">
                    {currentCard.flavorText}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="text-red-400 font-bold">⚔ 攻撃 {currentCard.attack}</span>
                    <span className="text-blue-400 font-bold">🛡 防御 {currentCard.defense}</span>
                    <span className="text-purple-300 font-bold">✨ 効果 {currentCard.effectValue}</span>
                    <span className="text-yellow-400 font-bold">💥 必殺 {currentCard.ultimate}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ability Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              <AbilityButton
                label="攻撃"
                icon={<Crosshair className="w-5 h-5 text-red-400" />}
                value={`${currentCard.attack}ダメージ`}
                subLabel={isDamageBlocked ? "（無効化）" : undefined}
                color="bg-red-500/10 border-red-400/40 hover:bg-red-500/20"
                onClick={() => playAbility("攻撃")}
                disabled={!isPlayerTurn}
              />
              <AbilityButton
                label="防御"
                icon={<Shield className="w-5 h-5 text-blue-400" />}
                value={`シールド+${currentCard.defense}`}
                subLabel={isDefenseBlocked ? "（封じられ中）" : undefined}
                color="bg-blue-500/10 border-blue-400/40 hover:bg-blue-500/20"
                onClick={() => playAbility("防御")}
                disabled={!isPlayerTurn || isDefenseBlocked}
              />
              <AbilityButton
                label="効果"
                icon={<Sparkles className="w-5 h-5 text-purple-400" />}
                value={currentCard.effect}
                subLabel={isDamageBlocked && currentCard.effect.includes("ダメージ") ? "（ダメージ無効）" : undefined}
                color="bg-purple-500/10 border-purple-400/40 hover:bg-purple-500/20"
                onClick={() => playAbility("効果")}
                disabled={!isPlayerTurn}
              />
              <AbilityButton
                label="必殺"
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
                value={`${currentCard.ultimateName}！${currentCard.ultimate}ダメージ`}
                subLabel={
                  isDamageBlocked && selectedEnemy.id === "void-king" && enemyCurrentPhase >= 2
                    ? "（2倍！→ ${currentCard.ultimate * 2}ダメージ）"
                    : undefined
                }
                color="bg-yellow-500/10 border-yellow-400/40 hover:bg-yellow-500/20"
                onClick={() => playAbility("必殺")}
                disabled={!isPlayerTurn}
              />
            </div>

            {/* Status indicator */}
            <div className="text-center shrink-0">
              {isPlayerTurn && (
                <p className="text-[10px] text-emerald-400/70">能力を選んでください</p>
              )}
              {isResolving && (
                <p className="text-[10px] text-yellow-400/70">
                  {playerAbility === "必殺" ? "💥 必殺発動中..." : "能力を発動中..."}
                </p>
              )}
              {phase === "enemyTurn" && (
                <p className="text-[10px] text-rose-400/70 animate-pulse">敵の攻撃中...</p>
              )}
            </div>

            {/* Battle Log */}
            <div className="glass-card rounded-xl p-3 flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="flex items-center gap-1.5 mb-2 shrink-0">
                <Swords className="w-3 h-3 text-cosmic-muted" />
                <span className="text-[9px] font-bold text-cosmic-muted">バトルログ</span>
              </div>
              <div
                ref={logRef}
                className="space-y-0.5 overflow-y-auto flex-1 max-h-32 custom-scrollbar"
              >
                {log.map((msg, i) => (
                  <p
                    key={i}
                    className={`text-[9px] leading-relaxed ${
                      msg.startsWith("💥") ? "text-rose-400/80" :
                      msg.startsWith("⚔️") ? "text-red-400/70" :
                      msg.startsWith("🛡️") ? "text-blue-400/70" :
                      msg.startsWith("✨") ? "text-purple-400/70" :
                      msg.startsWith("💥") ? "text-yellow-400/80" :
                      msg.startsWith("⚠️") ? "text-red-400" :
                      msg.startsWith("🌪️") ? "text-cyan-400" :
                      msg.startsWith("💚") ? "text-emerald-400" :
                      msg.startsWith("🏆") ? "text-gold-accent" :
                      msg.startsWith("💀") ? "text-rose-400" :
                      msg.startsWith("—") ? "text-cosmic-muted/40" :
                      "text-cosmic-muted/60"
                    }`}
                  >
                    {msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Defeat with no card (all cards used) or victory/defeat */}
        {(isVictory || isDefeat) && (
          <div className="flex-1 glass-card rounded-xl p-4 flex flex-col items-center justify-center gap-4">
            {isVictory ? (
              <>
                <Crown className="w-12 h-12 text-gold-accent" />
                <h2 className="text-xl font-black text-gold-accent">勝利！</h2>
                <p className="text-sm text-cosmic-muted">{selectedEnemy.name} を撃破した！</p>
                <p className="text-xs text-gold-accent">🏆 {selectedEnemy.reward}</p>
              </>
            ) : (
              <>
                <Skull className="w-12 h-12 text-rose-400" />
                <h2 className="text-xl font-black text-rose-400">敗北...</h2>
                <p className="text-sm text-cosmic-muted">
                  {playerHp <= 0
                    ? `${selectedEnemy.name} に倒された…`
                    : "カードが全て使い果たされた…"}
                </p>
                <p className="text-xs text-cosmic-muted">
                  敵残りHP: <span className="text-rose-400 font-bold">{enemyHp}</span> /
                  <span className="text-cosmic-muted">{selectedEnemy.maxHp}</span>
                </p>
              </>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleRetry}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  isVictory
                    ? "bg-gold-accent/20 border border-gold-accent/40 text-gold-accent hover:bg-gold-accent/30"
                    : "bg-red-500/20 border border-red-400/40 text-red-400 hover:bg-red-500/30"
                }`}
              >
                もう一度挑戦
              </button>
              <button
                onClick={handleDeckChange}
                className="px-6 py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all"
              >
                デッキを変える
              </button>
            </div>
          </div>
        )}
      </div>
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
