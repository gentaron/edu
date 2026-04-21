"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { useGameStore, type CardData } from "@/lib/game-engine";
import EnemyPanel from "@/components/card-game/EnemyPanel";
import PlayerStatus from "@/components/card-game/PlayerStatus";
import PlayerCard from "@/components/card-game/PlayerCard";
import FieldZone from "@/components/card-game/FieldZone";
import BattleLog from "@/components/card-game/BattleLog";
import ResultModal from "@/components/card-game/ResultModal";

/* ── Draggable wrapper for hand cards ── */
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableCard({ card, onPlay }: { card: CardData; onPlay: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <PlayerCard card={card} onClick={() => onPlay(card.id)} isDraggable variant="hand" />
    </div>
  );
}

/* ── BattleField main component ── */
export default function BattleField() {
  const router = useRouter();
  const [isShaking, setIsShaking] = useState(false);

  const {
    phase,
    playerHp,
    playerMaxHp,
    playerMana,
    playerMaxMana,
    hand,
    deck,
    discard,
    field,
    enemy,
    enemyHp,
    enemyPhase,
    log,
    turn,
    result,
    startBattle,
    playCard,
    endPlayerTurn,
    drawCard,
  } = useGameStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over?.id === "field-zone" && active.id) {
        playCard(String(active.id));
      }
    },
    [playCard]
  );

  const handlePlayCard = useCallback(
    (cardId: string) => {
      playCard(cardId);
    },
    [playCard]
  );

  const handleEndTurn = useCallback(() => {
    endPlayerTurn();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  }, [endPlayerTurn]);

  const handleRestart = useCallback(() => {
    if (enemy) {
      startBattle(enemy);
    }
  }, [enemy, startBattle]);

  const handleBack = useCallback(() => {
    router.push("/card-game");
  }, [router]);

  if (!enemy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-dark">
        <div className="text-center space-y-4">
          <p className="text-cosmic-muted">エネミー情報を読み込み中...</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm text-electric-blue border border-electric-blue/30 rounded-lg hover:bg-electric-blue/10 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-cosmic-dark flex flex-col">
        {/* Main battle area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-3 sm:p-4 gap-3">
          {/* Top: Enemy */}
          <EnemyPanel
            enemy={enemy}
            enemyHp={enemyHp}
            enemyPhase={enemyPhase}
            isShaking={isShaking}
          />

          {/* Middle: Field + Log */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <FieldZone field={field} />
            </div>
            <BattleLog log={log} />
          </div>

          {/* Bottom: Player */}
          <div className="space-y-3">
            <PlayerStatus
              hp={playerHp}
              maxHp={playerMaxHp}
              mana={playerMana}
              maxMana={playerMaxMana}
              turn={turn}
              phase={phase}
            />

            {/* Hand */}
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-cosmic-muted tracking-wider uppercase">
                  手札 ({hand.length}/5)
                </span>
                <div className="flex gap-2 text-[10px] text-cosmic-muted">
                  <span>山札: {deck.length}</span>
                  <span>墓地: {discard.length}</span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hand.map((card) => (
                  <DraggableCard
                    key={card.id}
                    card={card}
                    onPlay={handlePlayCard}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {phase === "main" && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={drawCard}
                  disabled={hand.length >= 5}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  カードを引く (1MP)
                </button>
                <button
                  onClick={handleEndTurn}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors animate-pulse"
                >
                  ターン終了
                </button>
              </div>
            )}
            {phase === "enemy" && (
              <div className="text-center">
                <motion.p
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-sm text-rose-400 font-bold"
                >
                  ⚠️ 敵の攻撃中...
                </motion.p>
              </div>
            )}
          </div>
        </div>

        {/* Result Modal */}
        <ResultModal
          result={result}
          enemyName={enemy.name}
          reward={enemy.reward || undefined}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      </div>
    </DndContext>
  );
}
