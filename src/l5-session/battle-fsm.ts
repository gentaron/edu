/* ═══════════════════════════════════════════
   L5 SESSION — Battle Finite State Machine
   FSM for battle flow control using useReducer pattern.
   ═══════════════════════════════════════════ */

import type { GameCard, Enemy, AbilityType, FieldChar } from "@/l2-datalink"
import { charMaxHp } from "@/lib/battle-logic"

// ── States (discriminated union) ──

export type BattleFSMState =
  | { state: "idle" }
  | { state: "deck-building"; deck: GameCard[] }
  | { state: "battle-init"; enemy: Enemy; deck: GameCard[] }
  | {
      state: "turn-start"
      turn: number
      fieldCharacters: FieldChar[]
      enemy: Enemy
      enemyHp: number
      enemyCurrentPhase: number
      shieldBuffer: number
    }
  | {
      state: "ability-select"
      selectedCharIndex: number
      fieldCharacters: FieldChar[]
      enemy: Enemy
      enemyHp: number
      turn: number
    }
  | {
      state: "turn-resolve"
      ability: AbilityType
      result: AbilityResult
      fieldCharacters: FieldChar[]
      enemy: Enemy
      enemyHp: number
      turn: number
    }
  | {
      state: "enemy-turn"
      enemy: Enemy
      fieldCharacters: FieldChar[]
      enemyHp: number
      turn: number
    }
  | {
      state: "phase-transition"
      message: string
      newPhase: number
      fieldCharacters: FieldChar[]
      enemy: Enemy
      turn: number
    }
  | {
      state: "battle-end"
      outcome: "victory" | "defeat"
      enemy: Enemy
      turnsUsed: number
      fieldCharacters: FieldChar[]
    }

// ── Actions ──

export type BattleFSMAction =
  | { type: "SELECT_DECK"; deck: GameCard[] }
  | { type: "START_BATTLE"; enemy: Enemy; deck: GameCard[] }
  | { type: "SELECT_CHARACTER"; index: number }
  | { type: "PLAY_ABILITY"; ability: AbilityType; result: AbilityResult }
  | { type: "END_ENEMY_TURN"; fieldCharacters: FieldChar[]; enemyHp: number; allDown: boolean }
  | { type: "PHASE_TRANSITION"; message: string; newPhase: number; fieldCharacters: FieldChar[] }
  | { type: "END_BATTLE"; outcome: "victory" | "defeat" }
  | { type: "RESET" }

export interface AbilityResult {
  damage: number
  heal: number
  shield: number
  attackReduction: number
  log: string
  newEnemyHp: number
}

// ── Helper to extract enemy from any state that has one ──

function getEnemy(state: BattleFSMState): Enemy | null {
  switch (state.state) {
    case "battle-init":
    case "turn-start":
    case "ability-select":
    case "turn-resolve":
    case "enemy-turn":
    case "phase-transition":
    case "battle-end":
      return state.enemy
    default:
      return null
  }
}

// ── Reducer ──

export function battleFSMReducer(state: BattleFSMState, action: BattleFSMAction): BattleFSMState {
  switch (action.type) {
    case "SELECT_DECK":
      if (action.deck.length !== 5) return state
      return { state: "deck-building", deck: action.deck }

    case "START_BATTLE": {
      const field: FieldChar[] = action.deck.map((c) => ({
        card: c,
        hp: charMaxHp(c),
        maxHp: charMaxHp(c),
        isDown: false,
      }))
      return {
        state: "battle-init",
        enemy: action.enemy,
        deck: action.deck,
      }
    }

    case "SELECT_CHARACTER": {
      if (state.state !== "turn-start") return state
      const fc = state.fieldCharacters[action.index]
      if (!fc || fc.isDown) return state
      return {
        state: "ability-select",
        selectedCharIndex: action.index,
        fieldCharacters: state.fieldCharacters,
        enemy: state.enemy,
        enemyHp: state.enemyHp,
        turn: state.turn,
      }
    }

    case "PLAY_ABILITY": {
      if (state.state !== "ability-select") return state
      return {
        state: "turn-resolve",
        ability: action.ability,
        result: action.result,
        fieldCharacters: state.fieldCharacters,
        enemy: state.enemy,
        enemyHp: action.result.newEnemyHp,
        turn: state.turn,
      }
    }

    case "END_ENEMY_TURN": {
      if (state.state !== "enemy-turn") return state
      if (action.allDown) {
        return {
          state: "battle-end",
          outcome: "defeat",
          enemy: state.enemy,
          turnsUsed: state.turn,
          fieldCharacters: action.fieldCharacters,
        }
      }
      const newTurn = state.turn + 1
      return {
        state: "turn-start",
        turn: newTurn,
        fieldCharacters: action.fieldCharacters,
        enemy: state.enemy,
        enemyHp: action.enemyHp,
        enemyCurrentPhase: 0,
        shieldBuffer: 0,
      }
    }

    case "PHASE_TRANSITION": {
      const enemy = getEnemy(state)
      if (!enemy) return state
      const turn =
        state.state === "turn-start"
          ? state.turn
          : state.state === "ability-select"
            ? state.turn
            : state.state === "turn-resolve"
              ? state.turn
              : state.state === "enemy-turn"
                ? state.turn
                : state.state === "phase-transition"
                  ? state.turn
                  : 0
      return {
        state: "phase-transition",
        message: action.message,
        newPhase: action.newPhase,
        fieldCharacters: action.fieldCharacters,
        enemy,
        turn,
      }
    }

    case "END_BATTLE": {
      if (state.state !== "turn-resolve" && state.state !== "phase-transition") return state
      const enemy = getEnemy(state)!
      const turn =
        state.state === "turn-resolve"
          ? state.turn
          : state.state === "phase-transition"
            ? state.turn
            : 0
      return {
        state: "battle-end",
        outcome: action.outcome,
        enemy,
        turnsUsed: turn,
        fieldCharacters: state.fieldCharacters,
      }
    }

    case "RESET":
      return { state: "idle" }

    default:
      return state
  }
}

/** Initial state */
export const initialBattleFSMState: BattleFSMState = { state: "idle" }
