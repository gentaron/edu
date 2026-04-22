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
  User,
} from "lucide-react";
import { ENEMIES, type GameCard, type AbilityType } from "@/lib/card-data";
import { useDeckStore, useBattleStore } from "@/lib/game-store";

/* ═══════════════════════════════════════════════════════
   Particle Effect Component
   ═══════════════════════════════════════════════════════ */
function ParticleBurst({
  color,
  count = 12,
  x,
  y,
}: {
  color: string;
  count?: number;
  x: number;
  y: number;
}) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const dist = 40 + Math.random() * 60;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * dist;
    const ty = Math.sin(rad) * dist;
    const size = 3 + Math.random() * 5;
    return { tx, ty, size, delay: Math.random() * 0.2 };
  });

  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: p.tx,
            y: p.ty,
            scale: 0,
          }}
          transition={{ duration: 0.6 + Math.random() * 0.3, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Slash Effect (for attack abilities)
   ═══════════════════════════════════════════════════════ */
function SlashEffect({ type, x, y }: { type: "attack" | "ultimate"; x: number; y: number }) {
  const isUlt = type === "ultimate";
  const slashCount = isUlt ? 3 : 1;

  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: slashCount }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, rotate: -45 + i * 30, scaleX: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            rotate: -45 + i * 30 + 15,
            scaleX: [0, 1.5, 1.5, 0],
          }}
          transition={{ duration: isUlt ? 0.6 : 0.4, delay: i * 0.15, ease: "easeInOut" }}
          className={`absolute ${isUlt ? "w-32 h-1" : "w-24 h-0.5"} ${
            isUlt
              ? "bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
              : "bg-gradient-to-r from-transparent via-red-400 to-transparent"
          }`}
          style={{
            filter: `drop-shadow(0 0 ${isUlt ? 8 : 4}px ${isUlt ? "#facc15" : "#f87171"})`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Shield Dome Effect
   ═══════════════════════════════════════════════════════ */
function ShieldDomeEffect({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.15, 0.3, 0.15, 0], scale: [0.8, 1, 1.1, 1, 0.9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl pointer-events-none z-20"
          style={{
            background: "radial-gradient(ellipse at center, rgba(96,165,250,0.3) 0%, transparent 70%)",
            border: "2px solid rgba(96,165,250,0.3)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   Healing Wave Effect
   ═══════════════════════════════════════════════════════ */
function HealWaveEffect({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.5, 0.3, 0], y: [-10, -20, -30] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 rounded-xl pointer-events-none z-20 overflow-hidden"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0], y: -30, scale: [0.5, 1.2, 0.8] }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="absolute text-emerald-400 text-lg"
              style={{ left: `${10 + i * 12}%`, bottom: "30%" }}
            >
              +
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   Screen Flash Overlay
   ═══════════════════════════════════════════════════════ */
function ScreenFlash({
  color,
  active,
  intensity = 0.3,
}: {
  color: string;
  active: boolean;
  intensity?: number;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, intensity, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── Ability Button with enhanced glow effect ─── */
function AbilityButton({
  label,
  icon,
  value,
  subLabel,
  color,
  glowColor,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  subLabel?: string;
  color: string;
  glowColor: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.06, y: -3 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex-1 rounded-xl border backdrop-blur-sm p-3 transition-all duration-300 flex flex-col items-center gap-1.5 overflow-hidden ${
        disabled
          ? "opacity-25 cursor-not-allowed border-cosmic-border/20 bg-cosmic-deep/30"
          : `cursor-pointer hover:shadow-xl border-opacity-50 ${color}`
      }`}
    >
      {/* Animated glow background */}
      {!disabled && (
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${glowColor}`}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {/* Animated border shimmer */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      {icon}
      <span className="text-xs font-bold text-cosmic-text relative z-10">{label}</span>
      <span className="text-[10px] font-bold text-cosmic-muted relative z-10">{value}</span>
      {subLabel && (
        <span className="text-[8px] text-cosmic-muted/70 leading-tight text-center line-clamp-2 max-w-full relative z-10">
          {subLabel}
        </span>
      )}
    </motion.button>
  );
}

/* ─── HP Bar with enhanced gradient and animation ─── */
function HpBar({ current, max, color }: { current: number; max: number; color: "rose" | "emerald" }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const cls = color === "rose"
    ? "bg-gradient-to-r from-rose-600 via-red-400 to-rose-500"
    : "bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-500";
  const glowCls = color === "rose" ? "shadow-rose-500/40" : "shadow-emerald-500/40";

  return (
    <div className="w-full h-3 bg-cosmic-deep rounded-full overflow-hidden border border-cosmic-border/30 relative">
      {/* Animated shine overlay */}
      {pct > 0 && (
        <motion.div
          className={`h-full rounded-full ${cls} shadow-lg ${glowCls}`}
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 2s ease-in-out infinite",
          }}
        />
      )}
      {/* Critical HP pulse */}
      {pct > 0 && pct <= 25 && (
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-500/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}

/* ─── Field Character Card with enhanced effects ─── */
function FieldCharSlot({
  char,
  index,
  isSelected,
  isPlayerTurn,
  isActing,
  actingAbility,
  onSelect,
  onActionEnd,
}: {
  char: { card: GameCard; hp: number; maxHp: number; isDown: boolean };
  index: number;
  isSelected: boolean;
  isPlayerTurn: boolean;
  isActing: boolean;
  actingAbility: AbilityType | null;
  onSelect: () => void;
  onActionEnd: () => void;
}) {
  const hpPct = Math.max(0, (char.hp / char.maxHp) * 100);
  const hpColor = hpPct > 50 ? "from-emerald-500 to-green-400" : hpPct > 25 ? "from-yellow-500 to-amber-400" : "from-red-500 to-rose-400";

  // Auto-end acting animation
  useEffect(() => {
    if (isActing) {
      const timer = setTimeout(onActionEnd, 1200);
      return () => clearTimeout(timer);
    }
  }, [isActing, onActionEnd]);

  const abilityGlow: Record<string, string> = {
    "攻撃": "shadow-red-500/60 border-red-400/60",
    "防御": "shadow-blue-500/60 border-blue-400/60",
    "効果": "shadow-purple-500/60 border-purple-400/60",
    "必殺": "shadow-yellow-500/60 border-yellow-400/60",
  };

  const abilityBg: Record<string, string> = {
    "攻撃": "bg-red-500/15",
    "防御": "bg-blue-500/15",
    "効果": "bg-purple-500/15",
    "必殺": "bg-yellow-500/15",
  };

  return (
    <motion.button
      onClick={onSelect}
      disabled={!isPlayerTurn || char.isDown}
      whileHover={isPlayerTurn && !char.isDown ? { scale: 1.06, y: -5 } : {}}
      whileTap={isPlayerTurn && !char.isDown ? { scale: 0.96 } : {}}
      animate={
        isActing
          ? {
              scale: [1, 1.15, 1],
              y: [0, -8, 0],
            }
          : {}
      }
      transition={
        isActing
          ? { duration: 0.6, repeat: 1 }
          : {}
      }
      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border backdrop-blur-sm transition-all duration-300 min-w-[72px] max-w-[92px] ${
        char.isDown
          ? "opacity-30 border-cosmic-border/10 bg-cosmic-deep/20 cursor-not-allowed"
          : isActing && actingAbility
          ? `${abilityGlow[actingAbility]} ${abilityBg[actingAbility]} shadow-lg`
          : isSelected
          ? "border-yellow-400/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-400/30"
          : "border-cosmic-border/30 bg-cosmic-surface/50 hover:border-nebula-purple/50 hover:bg-nebula-purple/5"
      }`}
    >
      {/* Selected indicator */}
      {isSelected && !isActing && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-400 border-2 border-cosmic-dark flex items-center justify-center z-10"
        >
          <span className="text-[8px] font-black text-cosmic-dark">▼</span>
        </motion.div>
      )}

      {/* Acting ability badge */}
      {isActing && actingAbility && (
        <motion.div
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
            actingAbility === "攻撃" ? "bg-red-500 text-white" :
            actingAbility === "防御" ? "bg-blue-500 text-white" :
            actingAbility === "効果" ? "bg-purple-500 text-white" :
            "bg-yellow-500 text-black"
          }`}>
            {actingAbility === "必殺" ? "💥必殺！" : actingAbility}
          </span>
        </motion.div>
      )}

      {/* Down indicator */}
      {char.isDown && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-cosmic-dark/60 rounded-xl">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Skull className="w-5 h-5 text-rose-400/60" />
          </motion.div>
        </div>
      )}

      {/* Char image with enhanced border */}
      <div className={`w-12 h-12 rounded-lg overflow-hidden bg-cosmic-deep/50 border shrink-0 ${
        isActing && actingAbility === "必殺"
          ? "border-yellow-400 shadow-lg shadow-yellow-500/40"
          : isActing && actingAbility === "攻撃"
          ? "border-red-400 shadow-lg shadow-red-500/30"
          : "border-cosmic-border/20"
      }`}>
        <img
          src={char.card.imageUrl}
          alt={char.card.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <p className={`text-[8px] font-bold text-center leading-tight line-clamp-1 ${char.isDown ? "text-cosmic-muted/30" : "text-cosmic-text"}`}>
        {char.card.name}
      </p>

      {/* Rarity badge */}
      <span className={`text-[7px] font-black px-1 py-px rounded ${
        char.card.rarity === "SR" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30" :
        char.card.rarity === "R" ? "bg-blue-500/20 text-blue-400 border border-blue-400/30" :
        "bg-cosmic-deep/50 text-cosmic-muted border border-cosmic-border/30"
      }`}>
        {char.card.rarity}
      </span>

      {/* HP bar */}
      {!char.isDown && (
        <div className="w-full">
          <div className="w-full h-1.5 bg-cosmic-deep rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${hpColor} transition-all duration-500`}
              style={{ width: `${hpPct}%` }}
            />
            {/* Low HP warning */}
            {hpPct <= 25 && hpPct > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-500/20"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
          <p className={`text-[7px] text-center mt-0.5 ${
            hpPct <= 25 ? "text-rose-400 font-bold" : "text-cosmic-muted"
          }`}>
            {char.hp}/{char.maxHp}
          </p>
        </div>
      )}
    </motion.button>
  );
}

/* ─── Floating Damage Number (enhanced) ─── */
function FloatingText({
  text,
  color,
  x,
  y,
  isCrit = false,
}: {
  text: string;
  color: string;
  x: number;
  y: number;
  isCrit?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: isCrit ? 0.3 : 0.5 }}
      animate={{
        opacity: 0,
        y: isCrit ? -80 : -60,
        scale: isCrit ? [0.3, 1.5, 1.2] : [0.5, 1.2, 1],
      }}
      transition={{ duration: isCrit ? 1.4 : 1.2, ease: "easeOut" }}
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <span className={`${isCrit ? "text-2xl" : "text-xl"} font-black drop-shadow-lg ${color}`}
        style={{ textShadow: `0 0 ${isCrit ? 16 : 8}px ${color}` }}>
        {text}
      </span>
    </motion.div>
  );
}

/* ─── Battle Content ─── */
function BattleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logRef = useRef<HTMLDivElement>(null);
  const [actingCharIndex, setActingCharIndex] = React.useState<number | null>(null);
  const [showSlash, setShowSlash] = React.useState(false);

  const deck = useDeckStore((s) => s.deck);

  const phase = useBattleStore((s) => s.phase);
  const playerHp = useBattleStore((s) => s.playerHp);
  const playerMaxHp = useBattleStore((s) => s.playerMaxHp);
  const shieldBuffer = useBattleStore((s) => s.shieldBuffer);
  const selectedEnemy = useBattleStore((s) => s.selectedEnemy);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const enemyCurrentPhase = useBattleStore((s) => s.enemyCurrentPhase);
  const turn = useBattleStore((s) => s.turn);
  const fieldCharacters = useBattleStore((s) => s.fieldCharacters);
  const selectedCharIndex = useBattleStore((s) => s.selectedCharIndex);
  const playerAbility = useBattleStore((s) => s.playerAbility);
  const poisonActive = useBattleStore((s) => s.poisonActive);
  const enemyAttackReduction = useBattleStore((s) => s.enemyAttackReduction);
  const log = useBattleStore((s) => s.log);
  const screenShake = useBattleStore((s) => s.screenShake);
  const enemyFlash = useBattleStore((s) => s.enemyFlash);
  const healFlash = useBattleStore((s) => s.healFlash);
  const shieldFlash = useBattleStore((s) => s.shieldFlash);
  const lastAbilityUsed = useBattleStore((s) => s.lastAbilityUsed);
  const lastCharIndex = useBattleStore((s) => s.lastCharIndex);

  const startBattle = useBattleStore((s) => s.startBattle);
  const selectCharacter = useBattleStore((s) => s.selectCharacter);
  const playAbility = useBattleStore((s) => s.playAbility);
  const resetBattle = useBattleStore((s) => s.resetBattle);

  const selectedChar = selectedCharIndex !== null ? fieldCharacters[selectedCharIndex] : null;

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

  // Track acting character animation
  useEffect(() => {
    if (phase === "resolving" && lastCharIndex !== null) {
      setActingCharIndex(lastCharIndex);
      if (lastAbilityUsed === "攻撃" || lastAbilityUsed === "必殺") {
        setShowSlash(true);
      }
    } else {
      setActingCharIndex(null);
      setShowSlash(false);
    }
  }, [phase, lastCharIndex, lastAbilityUsed]);

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
  const aliveCount = fieldCharacters.filter((fc) => !fc.isDown).length;

  // Check if defense is blocked
  const isDefenseBlocked = selectedEnemy.id === "void-spider" && turn % 2 === 0;
  // Check if damage is blocked (void-king final phase only)
  const isDamageBlocked = selectedEnemy.id === "void-king" && enemyCurrentPhase >= 3;

  const phaseMessages = log.filter(
    (l) => l.startsWith("⚠️") || l.startsWith("🌪️") || l.startsWith("💚") || l.startsWith("🌀")
  );
  const lastPhaseMsg = phaseMessages.slice(-1);

  // Determine floating text
  let floatingText: { text: string; color: string; isCrit?: boolean } | null = null;
  if (isResolving && lastCharIndex !== null && fieldCharacters[lastCharIndex]) {
    const ability = playerAbility;
    const card = fieldCharacters[lastCharIndex].card;
    if (ability === "攻撃") floatingText = { text: `-${card.attack}`, color: "text-red-400" };
    else if (ability === "必殺") floatingText = { text: `-${card.ultimate}`, color: "text-yellow-400", isCrit: true };
    else if (ability === "防御") floatingText = { text: `+${card.defense}`, color: "text-blue-400" };
    else if (ability === "効果") floatingText = { text: "✨", color: "text-purple-400", isCrit: true };
  }
  if (phase === "enemyTurn") {
    floatingText = { text: "-💥", color: "text-rose-400", isCrit: true };
  }

  return (
    <>
      {/* Screen flash effects */}
      <ScreenFlash color="rgba(239,68,68,0.2)" active={phase === "enemyTurn"} intensity={0.2} />
      <ScreenFlash
        color={lastAbilityUsed === "必殺" ? "rgba(250,204,21,0.3)" : lastAbilityUsed === "攻撃" ? "rgba(239,68,68,0.15)" : "transparent"}
        active={isResolving}
        intensity={lastAbilityUsed === "必殺" ? 0.3 : 0.15}
      />

      <motion.div
        animate={screenShake ? { x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-cosmic-dark flex flex-col overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/10"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [`${Math.random() * 100}%`, `${-10}%`],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

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
              ターン {turn} | 味方 {aliveCount}/5
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-3 py-3 gap-3 overflow-y-auto relative z-10">

          {/* ── Enemy Area ── */}
          <motion.div
            animate={
              enemyFlash
                ? { scale: [1, 1.08, 0.95, 1.03, 1], filter: ["brightness(1)", "brightness(2.5)", "brightness(0.8)", "brightness(1.5)", "brightness(1)"] }
                : {}
            }
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl p-4 shrink-0 relative overflow-hidden"
          >
            {/* Background pulse for boss/final */}
            {selectedEnemy.difficulty === "BOSS" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/8 via-transparent to-red-500/8"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {selectedEnemy.difficulty === "FINAL" && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    "radial-gradient(ellipse at center, rgba(250,204,21,0.05) 0%, transparent 70%)",
                    "radial-gradient(ellipse at center, rgba(250,204,21,0.12) 0%, transparent 70%)",
                    "radial-gradient(ellipse at center, rgba(250,204,21,0.05) 0%, transparent 70%)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            {/* Enemy damage overlay flash */}
            {enemyFlash && (
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-red-500/20 pointer-events-none z-10 rounded-xl"
              />
            )}

            <div className="flex items-start gap-4 relative z-10">
              {/* Enemy image with enhanced frame */}
              <div className={`w-20 h-20 rounded-xl bg-cosmic-deep/50 border flex items-center justify-center shrink-0 overflow-hidden ${
                selectedEnemy.difficulty === "FINAL"
                  ? "border-yellow-400/60 shadow-lg shadow-yellow-500/20"
                  : selectedEnemy.difficulty === "BOSS"
                  ? "border-red-400/50 shadow-lg shadow-red-500/20"
                  : "border-cosmic-border/30"
              }`}>
                <motion.img
                  src={selectedEnemy.imageUrl}
                  alt={selectedEnemy.name}
                  className="w-16 h-16 object-contain"
                  animate={phase === "enemyTurn" ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, repeat: phase === "enemyTurn" ? 2 : 0 }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-bold text-cosmic-text">{selectedEnemy.name}</h3>
                  <span className="text-[10px] text-cosmic-muted">{selectedEnemy.title}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${diffColors[selectedEnemy.difficulty].badge}`}>
                    {selectedEnemy.difficulty}
                  </span>
                  {/* Phase indicator */}
                  {enemyCurrentPhase > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-400/30"
                    >
                      Phase {enemyCurrentPhase + 1}
                    </motion.span>
                  )}
                </div>

                {/* HP Bar */}
                <div className="flex items-center gap-2 mb-1.5">
                  <motion.div
                    animate={phase === "enemyTurn" ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart className="w-3 h-3 text-rose-400 shrink-0" />
                  </motion.div>
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
                        initial={{ opacity: 0, y: -5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
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

            {/* Floating damage text */}
            <AnimatePresence>
              {floatingText && phase !== "playerTurn" && (
                <FloatingText
                  text={floatingText.text}
                  color={floatingText.color}
                  isCrit={floatingText.isCrit}
                  x={140}
                  y={10}
                />
              )}
            </AnimatePresence>

            {/* Particle effects */}
            <AnimatePresence>
              {isResolving && lastAbilityUsed === "攻撃" && (
                <ParticleBurst color="#f87171" count={8} x={160} y={30} />
              )}
              {isResolving && lastAbilityUsed === "必殺" && (
                <ParticleBurst color="#facc15" count={20} x={160} y={30} />
              )}
              {isResolving && lastAbilityUsed === "効果" && (
                <ParticleBurst color="#c084fc" count={10} x={160} y={30} />
              )}
            </AnimatePresence>

            {/* Slash effect */}
            <AnimatePresence>
              {showSlash && lastAbilityUsed && (
                <SlashEffect
                  type={lastAbilityUsed === "必殺" ? "ultimate" : "attack"}
                  x={120}
                  y={10}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Player Status Bar ── */}
          <div className="glass-card rounded-xl p-3 shrink-0 relative overflow-hidden">
            {/* Shield dome effect */}
            <ShieldDomeEffect active={shieldFlash} />
            {/* Heal wave effect */}
            <HealWaveEffect active={healFlash} />

            <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <motion.div
                  animate={healFlash ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                </motion.div>
                <HpBar current={playerHp} max={playerMaxHp} color="emerald" />
                <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                  {playerHp}/{playerMaxHp}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {shieldBuffer > 0 && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded px-1.5 py-0.5 flex items-center gap-0.5"
                  >
                    <Shield className="w-3 h-3" /> {shieldBuffer}
                  </motion.span>
                )}
                {poisonActive && (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-400/20 rounded px-1.5 py-0.5"
                  >
                    ☠️ 毒
                  </motion.span>
                )}
                {enemyAttackReduction > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-400/20 rounded px-1.5 py-0.5"
                  >
                    ⬇ 敵攻撃-{enemyAttackReduction}
                  </motion.span>
                )}
                {isDefenseBlocked && (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-400/20 rounded px-1.5 py-0.5"
                  >
                    🕸️ 防御封じ
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* ── Battle Content ── */}
          {!isVictory && !isDefeat && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* Field: 5 characters */}
              <div className="shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <User className="w-3 h-3 text-cosmic-muted" />
                  <span className="text-[9px] font-bold text-cosmic-muted">味方パーティ</span>
                  <motion.span
                    className="text-[8px] text-nebula-purple ml-1"
                    animate={isPlayerTurn ? { opacity: [0.4, 1, 0.4] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isPlayerTurn ? "クリックしてキャラを選択 →" : ""}
                  </motion.span>
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <AnimatePresence>
                    {fieldCharacters.map((fc, i) => (
                      <motion.div
                        key={fc.card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <FieldCharSlot
                          char={fc}
                          index={i}
                          isSelected={selectedCharIndex === i}
                          isPlayerTurn={isPlayerTurn}
                          isActing={actingCharIndex === i}
                          actingAbility={actingCharIndex === i ? lastAbilityUsed : null}
                          onSelect={() => selectCharacter(i)}
                          onActionEnd={() => setActingCharIndex(null)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Selected Character Info + Ability Buttons */}
              {selectedChar && !selectedChar.isDown && (
                <motion.div
                  key={selectedCharIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl p-4 shrink-0"
                >
                  {/* Selected char header */}
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className="w-10 h-10 rounded-lg overflow-hidden bg-cosmic-deep/50 border border-yellow-400/30 shrink-0"
                      animate={isPlayerTurn ? { boxShadow: ["0 0 0 rgba(250,204,21,0)", "0 0 12px rgba(250,204,21,0.3)", "0 0 0 rgba(250,204,21,0)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <img src={selectedChar.card.imageUrl} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-cosmic-text">{selectedChar.card.name}</h3>
                      <p className="text-[9px] text-cosmic-muted">{selectedChar.card.affiliation}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[9px]">
                      <span className="text-red-400 font-bold">⚔ {selectedChar.card.attack}</span>
                      <span className="text-blue-400 font-bold">🛡 {selectedChar.card.defense}</span>
                      <span className="text-purple-300 font-bold">✨ {selectedChar.card.effectValue}</span>
                      <span className="text-yellow-400 font-bold">💥 {selectedChar.card.ultimate}</span>
                    </div>
                  </div>

                  {/* Ability Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <AbilityButton
                      label="攻撃"
                      icon={<Crosshair className="w-5 h-5 text-red-400" />}
                      value={`${selectedChar.card.attack}ダメージ`}
                      subLabel={isDamageBlocked ? "（無効化）" : undefined}
                      color="bg-red-500/10 border-red-400/40 hover:bg-red-500/20"
                      glowColor="from-red-500 to-orange-500"
                      onClick={() => playAbility("攻撃")}
                      disabled={!isPlayerTurn}
                    />
                    <AbilityButton
                      label="防御"
                      icon={<Shield className="w-5 h-5 text-blue-400" />}
                      value={`シールド+${selectedChar.card.defense}`}
                      subLabel={isDefenseBlocked ? "（封じられ中）" : undefined}
                      color="bg-blue-500/10 border-blue-400/40 hover:bg-blue-500/20"
                      glowColor="from-blue-500 to-cyan-500"
                      onClick={() => playAbility("防御")}
                      disabled={!isPlayerTurn || isDefenseBlocked}
                    />
                    <AbilityButton
                      label="効果"
                      icon={<Sparkles className="w-5 h-5 text-purple-400" />}
                      value={selectedChar.card.effect}
                      subLabel={isDamageBlocked && selectedChar.card.effect.includes("ダメージ") ? "（ダメージ無効）" : undefined}
                      color="bg-purple-500/10 border-purple-400/40 hover:bg-purple-500/20"
                      glowColor="from-purple-500 to-pink-500"
                      onClick={() => playAbility("効果")}
                      disabled={!isPlayerTurn}
                    />
                    <AbilityButton
                      label="必殺"
                      icon={<Zap className="w-5 h-5 text-yellow-400" />}
                      value={`${selectedChar.card.ultimateName}！`}
                      subLabel={
                        isDamageBlocked && selectedEnemy.id === "void-king" && enemyCurrentPhase >= 3
                          ? `2倍！→ ${selectedChar.card.ultimate * 2}ダメージ`
                          : `${selectedChar.card.ultimate}ダメージ`
                      }
                      color="bg-yellow-500/10 border-yellow-400/40 hover:bg-yellow-500/20"
                      glowColor="from-yellow-500 to-amber-500"
                      onClick={() => playAbility("必殺")}
                      disabled={!isPlayerTurn}
                    />
                  </div>
                </motion.div>
              )}

              {/* No char selected hint */}
              {!selectedChar && isPlayerTurn && (
                <div className="text-center shrink-0 py-4">
                  <motion.p
                    animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[11px] text-cosmic-muted"
                  >
                    ⬆ フィールドのキャラをクリックして選択
                  </motion.p>
                </div>
              )}

              {/* Status indicator with enhanced animation */}
              <div className="text-center shrink-0">
                {isResolving && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {playerAbility === "必殺" ? (
                      <motion.div className="relative">
                        <motion.span
                          animate={{ scale: [1, 1.4, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 0.3, repeat: 3 }}
                          className="text-sm font-black text-yellow-400"
                          style={{ textShadow: "0 0 20px rgba(250,204,21,0.8)" }}
                        >
                          💥 必殺発動中！！！
                        </motion.span>
                        <motion.div
                          className="absolute inset-0"
                          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          style={{
                            background: "radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)",
                            filter: "blur(10px)",
                          }}
                        />
                      </motion.div>
                    ) : playerAbility === "攻撃" ? (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1], x: [0, 3, 0] }}
                        transition={{ duration: 0.4, repeat: 2 }}
                        className="text-[10px] text-red-400 font-medium"
                        style={{ textShadow: "0 0 10px rgba(239,68,68,0.5)" }}
                      >
                        ⚔️ 攻撃中...
                      </motion.span>
                    ) : playerAbility === "防御" ? (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                        className="text-[10px] text-blue-400 font-medium"
                        style={{ textShadow: "0 0 10px rgba(59,130,246,0.5)" }}
                      >
                        🛡️ 防御展開中...
                      </motion.span>
                    ) : (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                        transition={{ duration: 0.6, repeat: 2 }}
                        className="text-[10px] text-purple-400 font-medium"
                        style={{ textShadow: "0 0 10px rgba(168,85,247,0.5)" }}
                      >
                        ✨ 効果発動中...
                      </motion.span>
                    )}
                  </motion.div>
                )}
                {phase === "enemyTurn" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div className="relative inline-block">
                      <motion.span
                        animate={{ scale: [1, 1.15, 1], x: [0, 5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-[10px] text-rose-400 font-medium"
                        style={{ textShadow: "0 0 12px rgba(244,63,94,0.6)" }}
                      >
                        💥 {selectedEnemy.name}の攻撃！！！
                      </motion.span>
                      <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        style={{
                          background: "radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)",
                          filter: "blur(8px)",
                        }}
                      />
                    </motion.div>
                  </motion.div>
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
                  className="space-y-0.5 overflow-y-auto flex-1 max-h-40 custom-scrollbar"
                >
                  {log.map((msg, i) => (
                    <motion.p
                      key={i}
                      initial={i === log.length - 1 ? { opacity: 0, x: -10, scale: 0.95 } : {}}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      className={`text-[9px] leading-relaxed ${
                        msg.startsWith("💥") ? "text-rose-400/80 font-medium" :
                        msg.startsWith("⚔️") ? "text-red-400/70" :
                        msg.startsWith("🛡️") ? "text-blue-400/70" :
                        msg.startsWith("✨") ? "text-purple-400/70" :
                        msg.startsWith("⚠️") ? "text-red-400 font-medium" :
                        msg.startsWith("🌪️") ? "text-cyan-400 font-medium" :
                        msg.startsWith("🌀") ? "text-yellow-400 font-medium" :
                        msg.startsWith("💚") ? "text-emerald-400/70" :
                        msg.startsWith("✝️") ? "text-amber-300" :
                        msg.startsWith("❄️") ? "text-blue-300" :
                        msg.startsWith("🔥") ? "text-orange-400" :
                        msg.startsWith("🕸️") ? "text-gray-400" :
                        msg.startsWith("🏆") ? "text-gold-accent font-bold" :
                        msg.startsWith("💀") ? "text-rose-400" :
                        msg.startsWith("🎭") ? "text-cosmic-muted/50" :
                        msg.startsWith("🚫") ? "text-orange-400" :
                        msg.startsWith("—") ? "text-cosmic-muted/40" :
                        "text-cosmic-muted/60"
                      }`}
                    >
                      {msg}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Victory / Defeat */}
          {(isVictory || isDefeat) && (
            <div className="flex-1 glass-card rounded-xl p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* Victory particle rain */}
              {isVictory && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: ["#facc15", "#f87171", "#34d399", "#818cf8", "#f472b6"][i % 5],
                        left: `${Math.random() * 100}%`,
                        boxShadow: `0 0 4px ${["#facc15", "#f87171", "#34d399", "#818cf8", "#f472b6"][i % 5]}`,
                      }}
                      initial={{ y: -20, opacity: 1, scale: 1 }}
                      animate={{ y: 400, opacity: 0, scale: 0, rotate: Math.random() * 360 }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeIn",
                      }}
                    />
                  ))}
                </div>
              )}

              {isVictory ? (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <Crown className="w-16 h-16 text-gold-accent"
                      style={{ filter: "drop-shadow(0 0 16px rgba(251,191,36,0.6))" }}
                    />
                  </motion.div>
                  <motion.h2
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 8, delay: 0.2 }}
                    className="text-2xl font-black text-gold-accent"
                    style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}
                  >
                    勝利！
                  </motion.h2>
                  <p className="text-sm text-cosmic-muted">{selectedEnemy.name} を撃破した！</p>
                  <p className="text-xs text-gold-accent">🏆 {selectedEnemy.reward}</p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <Skull className="w-16 h-16 text-rose-400"
                      style={{ filter: "drop-shadow(0 0 16px rgba(244,63,94,0.6))" }}
                    />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-black text-rose-400"
                    style={{ textShadow: "0 0 20px rgba(244,63,94,0.5)" }}
                  >
                    敗北...
                  </motion.h2>
                  <p className="text-sm text-cosmic-muted">
                    {fieldCharacters.every((fc) => fc.isDown)
                      ? "味方が全員戦闘不能になった…"
                      : "プレイヤーは倒された…"}
                  </p>
                  <p className="text-xs text-cosmic-muted">
                    敵残りHP: <span className="text-rose-400 font-bold">{enemyHp}</span> /
                    <span className="text-cosmic-muted">{selectedEnemy.maxHp}</span>
                  </p>
                </>
              )}

              <div className="flex gap-3 mt-2 relative z-10">
                <button
                  onClick={handleRetry}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${
                    isVictory
                      ? "bg-gold-accent/20 border border-gold-accent/40 text-gold-accent hover:bg-gold-accent/30"
                      : "bg-red-500/20 border border-red-400/40 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  もう一度挑戦
                </button>
                <button
                  onClick={handleDeckChange}
                  className="px-6 py-2 rounded-lg bg-cosmic-surface/50 border border-cosmic-border/30 text-cosmic-muted text-sm hover:bg-cosmic-surface transition-all hover:scale-105"
                >
                  デッキを変える
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Diff colors ─── */
const diffColors: Record<string, { badge: string }> = {
  NORMAL: { badge: "text-green-400 bg-green-500/10 border-green-500/40" },
  HARD: { badge: "text-orange-400 bg-orange-500/10 border-orange-500/40" },
  BOSS: { badge: "text-red-400 bg-red-500/10 border-red-500/40" },
  FINAL: { badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40" },
};

/* ─── Main Page ─── */
export default function BattlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
          <div className="text-center space-y-4">
            <motion.div
              className="w-10 h-10 border-2 border-electric-blue border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-xs text-cosmic-muted">バトルを準備中...</p>
          </div>
        </div>
      }
    >
      <BattleContent />
    </Suspense>
  );
}
