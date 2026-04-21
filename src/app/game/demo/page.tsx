"use client";

import React, { Suspense } from "react";
import Link from "next/link";

function Loading() {
  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-nebula-purple border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-cosmic-muted">マッチを準備中...</p>
      </div>
    </div>
  );
}

export default function DemoMatchWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <DemoMatchPageInner />
    </Suspense>
  );
}

import { useSearchParams } from "next/navigation";
import { useMachine } from "@xstate/react";
import { Swords, ArrowLeft, SkipForward, Target } from "lucide-react";
import { gameMachine } from "../_machines/gameMachine";
import { canPlayCard, MAX_BOARD_SIZE } from "../_lib/rules";
import Board from "../_components/Board";
import Hand from "../_components/Hand";
import type { CardDef } from "../_lib/rules";

const ALL_DEMO_CARDS: CardDef[] = [
  { id: "c1", name: "アイリス", type: "character", cost: 5, power: 7, description: "IRIS現代ランキング1位。" },
  { id: "c2", name: "ジェン", type: "character", cost: 6, power: 8, description: "Valoria連合圏を主導する現役最強格。" },
  { id: "c3", name: "レイラ", type: "character", cost: 4, power: 6, description: "Pink Voltage。AURALIS第二世代。" },
  { id: "c4", name: "ケイト", type: "character", cost: 3, power: 4, description: "AURALIS Collective創設者。" },
  { id: "c5", name: "アルファ・ケイン", type: "character", cost: 5, power: 7, description: "シャドウ・リベリオンのリーダー。" },
  { id: "c6", name: "アヤカ・リン", type: "character", cost: 4, power: 5, description: "搾取生物専門ハンター。" },
  { id: "c7", name: "フィオナ", type: "character", cost: 3, power: 5, description: "ブルーローズ統率者。" },
  { id: "c8", name: "ディアナ", type: "character", cost: 3, power: 4, description: "初代Wonder Woman。" },
  { id: "c9", name: "弦太郎", type: "character", cost: 3, power: 3, description: "AURALIS Collectiveに関わる人物。" },
  { id: "c10", name: "ガロ", type: "character", cost: 2, power: 3, description: "シャドウ・ユニオン指導者。" },
  { id: "e1", name: "スライム危機", type: "event", cost: 3, power: 4, description: "大災害。4ダメージ。" },
  { id: "e2", name: "セリア黄金期", type: "event", cost: 4, power: 3, description: "最盛期。3ダメージ。" },
  { id: "e3", name: "エルトナ戦争", type: "event", cost: 2, power: 3, description: "軍事衝突。3ダメージ。" },
  { id: "e4", name: "テリアン反乱", type: "event", cost: 1, power: 2, description: "武装抵抗。2ダメージ。" },
  { id: "e5", name: "テクノ文化ルネサンス", type: "event", cost: 2, power: 2, description: "文化融合。2ダメージ。" },
  { id: "t1", name: "ブルーワイヤ", type: "tech", cost: 2, power: 3, description: "青い光のワイヤー。" },
  { id: "t2", name: "ウォーター・オーブ", type: "tech", cost: 3, power: 4, description: "水属性のオーブ。4ダメージ。" },
  { id: "t3", name: "ビキニバリア", type: "tech", cost: 1, power: 0, description: "防壁。" },
  { id: "t4", name: "プラズマカノン", type: "tech", cost: 4, power: 5, description: "重火器。5ダメージ。" },
  { id: "t5", name: "カウパー波", type: "tech", cost: 2, power: 3, description: "ビキニバリアと併用。3ダメージ。" },
  { id: "l1", name: "ギガポリス", type: "location", cost: 3, power: 0, description: "味方+1。" },
  { id: "l2", name: "Selinopolis", type: "location", cost: 2, power: 0, description: "味方+1。" },
  { id: "l3", name: "Eros-7", type: "location", cost: 2, power: 0, description: "味方+1。" },
  { id: "l4", name: "ヴァーミリオン", type: "location", cost: 3, power: 0, description: "味方+1。" },
];

function buildDeck(cardIds: string[]): CardDef[] {
  const selected = ALL_DEMO_CARDS.filter((c) => cardIds.includes(c.id));
  const deck: CardDef[] = [];
  while (deck.length < 30) deck.push(...selected);
  return deck.slice(0, 30);
}

function DemoMatchPageInner() {
  const searchParams = useSearchParams();
  const cardIds = searchParams.get("cards")?.split(",").filter(Boolean) ?? [];

  const aiCardIds = React.useMemo(
    () => ALL_DEMO_CARDS.filter((c) => !cardIds.includes(c.id)).map((c) => c.id),
    [cardIds]
  );

  const [state, send] = useMachine(gameMachine);

  const ctx = state.context;
  const gameStarted = state.matches("draw") || state.matches("main") || state.matches("attack");
  const isFinished = state.matches("finished");
  const isPlayerTurn = ctx.currentPlayer === "p1";
  const isAttackPhase = ctx.phase === "attack";

  // Start game
  React.useEffect(() => {
    if (cardIds.length >= 3 && state.matches("idle")) {
      const deckP1 = buildDeck(cardIds);
      const deckP2 = buildDeck(aiCardIds.length >= 3 ? aiCardIds : cardIds);
      send({ type: "START", deckP1, deckP2 });
    }
  }, [cardIds, aiCardIds]);

  // Auto-draw on draw phase
  React.useEffect(() => {
    if (state.matches("draw") && isPlayerTurn) {
      const timer = setTimeout(() => send({ type: "DRAW" }), 300);
      return () => clearTimeout(timer);
    }
  }, [state.value, isPlayerTurn]);

  // Simple AI
  React.useEffect(() => {
    if (!isPlayerTurn && gameStarted && !isFinished) {
      const timer = setTimeout(() => {
        const p2 = ctx.p2;
        const playable = p2.hand
          .map((c, i) => ({ card: c, index: i }))
          .filter(({ card }) => card.cost <= p2.mana);

        if (playable.length > 0 && p2.board.length < MAX_BOARD_SIZE) {
          const pick = playable[Math.floor(Math.random() * playable.length)];
          send({ type: "PLAY_CARD", handIndex: pick.index });
        } else {
          send({ type: "END_TURN" });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameStarted, isFinished, ctx.p2]);

  const playableIndices = React.useMemo(() => {
    if (!isPlayerTurn || ctx.phase !== "main") return new Set<number>();
    const indices = new Set<number>();
    ctx.p1.hand.forEach((card, i) => {
      if (canPlayCard(ctx.p1, card)) indices.add(i);
    });
    return indices;
  }, [isPlayerTurn, ctx.phase, ctx.p1]);

  const handleCardClick = React.useCallback(
    (index: number) => {
      if (!isPlayerTurn || ctx.phase !== "main") return;
      send({ type: "PLAY_CARD", handIndex: index });
    },
    [isPlayerTurn, ctx.phase, send]
  );

  const handleCardDrop = React.useCallback(
    (card: CardDef, index: number) => {
      if (!isPlayerTurn || ctx.phase !== "main") return;
      send({ type: "PLAY_CARD", handIndex: index });
    },
    [isPlayerTurn, ctx.phase, send]
  );

  const handleSlotClick = React.useCallback(
    (boardIndex: number) => {
      if (!isPlayerTurn) return;
      if (isAttackPhase && ctx.selectedAttacker !== null) {
        send({ type: "ATTACK_SLOT", defenderIndex: boardIndex });
      } else if (ctx.phase === "main") {
        send({ type: "SELECT_ATTACKER", boardIndex });
      }
    },
    [isPlayerTurn, isAttackPhase, ctx.selectedAttacker, ctx.phase, send]
  );

  if (cardIds.length < 3) {
    return (
      <div className="min-h-screen bg-cosmic-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-cosmic-muted mb-4">カードを3枚以上選択してください</p>
          <Link href="/game" className="text-sm text-electric-blue hover:underline">← デッキ選択に戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cosmic-dark flex flex-col">
      {/* Top nav */}
      <nav className="shrink-0 glass-card border-b border-cosmic-border/50 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 h-12">
          <Link href="/game" className="text-xs text-cosmic-muted hover:text-electric-blue transition-colors">
            <ArrowLeft className="w-3 h-3 inline mr-1" />
            デッキ選択
          </Link>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-nebula-purple" />
            <span className="text-xs font-bold text-cosmic-gradient">
              ターン{ctx.turnNumber} — {isFinished ? "終了" : isPlayerTurn ? "あなたのターン" : "相手のターン"}
            </span>
          </div>
          <span className="text-[10px] text-cosmic-muted ml-auto">
            {ctx.phase === "main" ? "メインフェーズ" : ctx.phase === "attack" ? "攻撃フェーズ" : ctx.phase}
          </span>
        </div>
      </nav>

      {/* Game area */}
      <div className="flex-1 flex flex-col gap-3 p-3 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* Opponent board */}
        <Board player={ctx.p2} isOpponent label="相手の場" selectedAttacker={null} onSlotClick={isAttackPhase ? handleSlotClick : undefined} />

        {/* Opponent hand */}
        <div className="flex gap-1.5 justify-center">
          {ctx.p2.hand.map((_, i) => (
            <div key={i} className="w-14 h-20 rounded-lg border border-cosmic-border/40 bg-cosmic-surface/50" />
          ))}
        </div>

        {/* Center controls */}
        <div className="flex items-center justify-center gap-3 shrink-0 py-2">
          {isAttackPhase && (
            <>
              <button onClick={() => send({ type: "ATTACK_PLAYER" })} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1">
                <Target className="w-3 h-3" /> 直接攻撃
              </button>
              <button onClick={() => send({ type: "DESELECT" })} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cosmic-surface border border-cosmic-border text-cosmic-muted hover:text-cosmic-text transition-all">
                解除
              </button>
            </>
          )}
          {isPlayerTurn && ctx.phase === "main" && (
            <button onClick={() => send({ type: "END_TURN" })} className="px-4 py-2 text-xs font-bold rounded-lg bg-nebula-purple/20 border border-nebula-purple/40 text-nebula-purple hover:bg-nebula-purple/30 transition-all flex items-center gap-1">
              <SkipForward className="w-3 h-3" /> ターン終了
            </button>
          )}
          {isFinished && (
            <div className="text-center">
              <p className="text-lg font-bold text-gold-accent mb-2">
                {ctx.winner === "p1" ? "🏆 あなたの勝ち！" : "💀 あなたの負け..."}
              </p>
              <Link href="/game" className="text-xs text-electric-blue hover:underline">← 再戦する</Link>
            </div>
          )}
        </div>

        {/* Player board */}
        <Board player={ctx.p1} label="あなたの場" selectedAttacker={ctx.selectedAttacker ?? null} onSlotClick={handleSlotClick} />

        {/* Player hand */}
        <Hand cards={ctx.p1.hand} playableIndices={playableIndices} onCardClick={handleCardClick} onCardDrop={handleCardDrop} label="手札" />
      </div>

      {/* Battle log */}
      <div className="shrink-0 glass-card border-t border-cosmic-border/50">
        <div className="max-w-6xl mx-auto px-4 py-2 max-h-24 overflow-y-auto">
          <div className="flex gap-1.5 flex-wrap">
            {ctx.log.slice(-20).map((entry, i) => (
              <span key={i} className="text-[10px] text-cosmic-muted bg-cosmic-dark/50 px-2 py-0.5 rounded">{entry}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
