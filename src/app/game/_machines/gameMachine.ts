import { setup, assign, fromPromise } from "xstate";
import {
  CardDef,
  PlayerState,
  MAX_HP,
  STARTING_HAND,
  shuffle,
  type BoardSlot,
  playCard,
  startTurn,
  cleanupBoard,
  resolveAttack,
  applyDamage,
  checkWinner,
  boardPower,
} from "../_lib/rules";
import { makeSeed } from "../_lib/shuffle";

/* ── Context ─────────────────────────────────────────── */

export interface GameContext {
  seed: string;
  currentPlayer: "p1" | "p2";
  phase: "draw" | "main" | "attack" | "end";
  turnNumber: number;
  p1: PlayerState;
  p2: PlayerState;
  log: string[];
  selectedAttacker: number | null; // index in current player's board
  winner: string | null;
}

/* ── Events ──────────────────────────────────────────── */

export type GameEvent =
  | { type: "START"; deckP1: CardDef[]; deckP2: CardDef[]; seed?: string }
  | { type: "DRAW" }
  | { type: "PLAY_CARD"; handIndex: number }
  | { type: "SELECT_ATTACKER"; boardIndex: number }
  | { type: "ATTACK_PLAYER" }
  | { type: "ATTACK_SLOT"; defenderIndex: number }
  | { type: "END_TURN" }
  | { type: "DESELECT" };

/* ── Helpers ─────────────────────────────────────────── */

function cur(ctx: GameContext): PlayerState {
  return ctx.currentPlayer === "p1" ? ctx.p1 : ctx.p2;
}
function opp(ctx: GameContext): PlayerState {
  return ctx.currentPlayer === "p1" ? ctx.p2 : ctx.p1;
}
function setCur(ctx: GameContext, p: PlayerState, side: "p1" | "p2"): GameContext {
  return side === "p1" ? { ...ctx, p1: p } : { ...ctx, p2: p };
}

/* ── Machine ─────────────────────────────────────────── */

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        START: {
          target: "draw",
          actions: assign(({ event }) => {
            const e = event as { type: "START"; deckP1: CardDef[]; deckP2: CardDef[]; seed?: string };
            const seed = e.seed ?? makeSeed();
            const sh1 = shuffle(e.deckP1, seed + "_p1");
            const sh2 = shuffle(e.deckP2, seed + "_p2");
            const mkPlayer = (deck: CardDef[], id: string): PlayerState => ({
              id,
              hp: MAX_HP,
              hand: deck.slice(0, STARTING_HAND),
              deck: deck.slice(STARTING_HAND),
              board: [],
              graveyard: [],
              mana: 1,
              maxMana: 1,
            });
            return {
              seed,
              currentPlayer: "p1" as const,
              phase: "draw" as const,
              turnNumber: 1,
              p1: mkPlayer(sh1, "p1"),
              p2: mkPlayer(sh2, "p2"),
              log: ["ゲーム開始"],
              selectedAttacker: null,
              winner: null,
            };
          }),
        },
      },
    },

    draw: {
      entry: assign(({ context }) => {
        const cp = context.currentPlayer;
        const updated = startTurn(cur(context));
        const newCtx = setCur(context, updated, cp);
        return {
          ...newCtx,
          phase: "main" as const,
          log: [...context.log, `ターン${context.turnNumber}: ${cp === "p1" ? "先攻" : "後攻"}ドロー`],
        };
      }),
      always: "main",
    },

    main: {
      on: {
        PLAY_CARD: {
          actions: assign(({ context, event }) => {
            const e = event as { type: "PLAY_CARD"; handIndex: number };
            const cp = context.currentPlayer;
            const result = playCard(cur(context), e.handIndex);

            let newCtx = setCur(context, result.player, cp);
            let logMsg = `${cp}「${result.player.hand.length + 1 > context[cp].hand.length ? result.slot?.card.name : context[cp].hand[e.handIndex].name}」をプレイ`;

            // If character was played, add to board
            // (already handled by playCard for characters)

            // Direct damage from events/tech
            if (result.directDamage && result.directDamage > 0) {
              const opSide = cp === "p1" ? "p2" : "p1";
              const op = opp(context);
              const newOpp = { ...op, hp: applyDamage(op.hp, result.directDamage) };
              newCtx = setCur(newCtx, newOpp, opSide as "p1" | "p2");
              logMsg += ` → ${result.directDamage}ダメージ`;
            }

            const w = checkWinner(newCtx.p1, newCtx.p2);
            return { ...newCtx, log: [...context.log, logMsg], winner: w };
          }),
        },
        SELECT_ATTACKER: {
          actions: assign(({ context, event }) => {
            const e = event as { type: "SELECT_ATTACKER"; boardIndex: number };
            return {
              ...context,
              phase: "attack" as const,
              selectedAttacker: e.boardIndex,
            };
          }),
        },
        END_TURN: {
          target: "draw",
          actions: assign(({ context }) => {
            const cp = context.currentPlayer;
            const next: "p1" | "p2" = cp === "p1" ? "p2" : "p1";
            const newTurn = cp === "p2" ? context.turnNumber + 1 : context.turnNumber;
            return {
              ...context,
              currentPlayer: next,
              turnNumber: newTurn,
              phase: "draw" as const,
              selectedAttacker: null,
              log: [...context.log, `${cp}ターン終了`],
            };
          }),
        },
      },
    },

    attack: {
      on: {
        ATTACK_PLAYER: {
          actions: assign(({ context }) => {
            const cp = context.currentPlayer;
            const atkIdx = context.selectedAttacker;
            if (atkIdx === null) return context;
            const attacker = cur(context).board[atkIdx];
            if (!attacker || !attacker.canAttack) return context;

            const opSide = cp === "p1" ? "p2" : "p1";
            const op = opp(context);
            const newOpp = { ...op, hp: applyDamage(op.hp, attacker.card.power) };
            let newCtx = setCur(context, newOpp, opSide as "p1" | "p2");

            // Attacker becomes exhausted
            const newBoard = cur(newCtx).board.map((s, i) =>
              i === atkIdx ? { ...s, canAttack: false } : s
            );
            newCtx = setCur(newCtx, { ...cur(newCtx), board: newBoard }, cp);

            const w = checkWinner(newCtx.p1, newCtx.p2);
            return {
              ...newCtx,
              phase: "main" as const,
              selectedAttacker: null,
              log: [...context.log, `${cp}直接攻撃 → ${attacker.card.power}ダメージ`],
              winner: w,
            };
          }),
        },
        ATTACK_SLOT: {
          actions: assign(({ context, event }) => {
            const e = event as { type: "ATTACK_SLOT"; defenderIndex: number };
            const cp = context.currentPlayer;
            const atkIdx = context.selectedAttacker;
            if (atkIdx === null) return context;

            const attacker = cur(context).board[atkIdx];
            const defender = opp(context).board[e.defenderIndex];
            if (!attacker || !defender || !attacker.canAttack) return context;

            const result = resolveAttack(attacker, defender);

            // Update attacker
            const newBoard = cur(context).board.map((s, i) =>
              i === atkIdx ? { ...result.atkSlot, canAttack: false } : s
            );

            // Update defender
            const opSide = cp === "p1" ? "p2" : "p1";
            const opBoard = opp(context).board.map((s, i) =>
              i === e.defenderIndex ? result.defSlot : s
            );
            let newCtx = setCur(context, { ...cur(context), board: newBoard }, cp);
            newCtx = setCur(newCtx, { ...opp(newCtx), board: opBoard }, opSide as "p1" | "p2");

            // Cleanup dead
            newCtx = setCur(newCtx, cleanupBoard(newCtx.p1), "p1");
            newCtx = setCur(newCtx, cleanupBoard(newCtx.p2), "p2");

            const w = checkWinner(newCtx.p1, newCtx.p2);
            return {
              ...newCtx,
              phase: "main" as const,
              selectedAttacker: null,
              log: [
                ...context.log,
                `${attacker.card.name} → ${defender.card.name} 戦闘`,
              ],
              winner: w,
            };
          }),
        },
        DESELECT: {
          actions: assign(({ context }) => ({
            ...context,
            phase: "main" as const,
            selectedAttacker: null,
          })),
        },
      },
    },

    finished: {
      type: "final",
      entry: assign(({ context }) => ({
        ...context,
        log: [...context.log, `勝者: ${context.winner}`],
      })),
    },
  },

  on: {
    "*": [
      {
        guard: ({ context }) => context.winner !== null,
        target: "finished",
      },
    ],
  },
}).createMachine();
