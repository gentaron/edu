/* ═══════════════════════════════════════════════════════════════
   L5 SESSION — Battle HSM
   Domain-specific battle state machine built on the generic HSM.
   The generic Hsm class is completely independent of battle logic;
   this module wires it together with battle-specific states,
   guards, actions, and context.
   ═══════════════════════════════════════════════════════════════ */

import { Hsm } from "./index"
import type { HsmConfig, HsmContext } from "./index"

// ─── Battle event types ──────────────────────────────────────

export type BattleEventType =
  | "START_BATTLE"
  | "SELECT_CHARACTER"
  | "PLAY_ABILITY"
  | "RESOLVE_ABILITY"
  | "ENEMY_TURN_START"
  | "ENEMY_TURN_END"
  | "PHASE_TRANSITION"
  | "VICTORY"
  | "DEFEAT"
  | "RESET"

// ─── Battle context shape ────────────────────────────────────
// The Hsm only stores primitive flags; it is decoupled from the
// full game-card / enemy data model which lives in L2.

export interface BattleHsmContext extends HsmContext {
  enemyHp: number
  allCharsDown: boolean
  turn: number
}

// ─── Factory ─────────────────────────────────────────────────

/**
 * Create a battle state machine.
 *
 * State hierarchy:
 * ```
 *   idle
 *   battle ⊃ { playerTurn, resolving, enemyTurn }
 *   terminal ⊃ { victory, defeat }
 * ```
 *
 * Flow:
 *   idle ──START_BATTLE──▶ playerTurn
 *   playerTurn ──PLAY_ABILITY──▶ resolving
 *   resolving ──RESOLVE_ABILITY──▶ enemyTurn  (guard: enemy alive)
 *   resolving ──VICTORY──▶ victory             (guard: enemy dead)
 *   enemyTurn ──ENEMY_TURN_END──▶ playerTurn   (guard: chars alive)
 *   enemyTurn ──DEFEAT──▶ defeat               (guard: all chars down)
 *   victory ──RESET──▶ idle
 *   defeat  ──RESET──▶ idle
 */
export function createBattleHsm(): Hsm {
  const config: HsmConfig = {
    initialState: "idle",
    context: {
      enemyHp: 0,
      allCharsDown: false,
      turn: 0,
    } satisfies BattleHsmContext,
    historyStates: {
      battle: "shallow",
    },
    states: {
      // ── Top-level states ──────────────────────────────────

      idle: {
        id: "idle",
        onEntry(ctx, event) {
          // Only reset context on explicit entry, not during init
          if (event.type !== "hsm.init") {
            ctx.turn = 0
            ctx.enemyHp = 0
            ctx.allCharsDown = false
          }
        },
        transitions: {
          START_BATTLE: {
            target: "playerTurn",
            action(ctx) {
              ctx.turn = 1
            },
          },
        },
      },

      battle: {
        id: "battle",
        transitions: {},
      },

      terminal: {
        id: "terminal",
        transitions: {},
      },

      // ── Battle sub-states ─────────────────────────────────

      playerTurn: {
        id: "playerTurn",
        parent: "battle",
        transitions: {
          PLAY_ABILITY: { target: "resolving" },
        },
      },

      resolving: {
        id: "resolving",
        parent: "battle",
        transitions: {
          RESOLVE_ABILITY: [
            {
              target: "enemyTurn",
              guard(ctx) {
                return (ctx.enemyHp as number) > 0
              },
            },
            {
              target: "victory",
              guard(ctx) {
                return (ctx.enemyHp as number) <= 0
              },
            },
          ],
          VICTORY: {
            target: "victory",
            guard(ctx) {
              return (ctx.enemyHp as number) <= 0
            },
          },
        },
      },

      enemyTurn: {
        id: "enemyTurn",
        parent: "battle",
        transitions: {
          ENEMY_TURN_END: [
            {
              target: "playerTurn",
              guard(ctx) {
                return ctx.allCharsDown !== true
              },
              action(ctx) {
                ctx.turn = (ctx.turn as number) + 1
              },
            },
            {
              target: "defeat",
              guard(ctx) {
                return ctx.allCharsDown === true
              },
            },
          ],
          DEFEAT: {
            target: "defeat",
            guard(ctx) {
              return ctx.allCharsDown === true
            },
          },
        },
      },

      // ── Terminal sub-states ────────────────────────────────

      victory: {
        id: "victory",
        parent: "terminal",
        transitions: {
          RESET: { target: "idle" },
        },
      },

      defeat: {
        id: "defeat",
        parent: "terminal",
        transitions: {
          RESET: { target: "idle" },
        },
      },
    },
  }

  return new Hsm(config)
}
