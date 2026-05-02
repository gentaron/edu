import { describe, it, expect } from "vitest"
import {
  battleFSMReducer,
  initialBattleFSMState,
  type BattleFSMState,
} from "@/domains/battle/battle.fsm"
import { EffectType } from "@/types"
import type { GameCard, Enemy, FieldChar } from "@/types"
import type { CardId, EnemyId } from "@/platform/schemas/branded"

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const makeCard = (id: string, name: string, rarity: "SR" | "R" | "C" = "R"): GameCard =>
  ({
    id: id as CardId,
    name,
    imageUrl: "",
    flavorText: "",
    rarity,
    affiliation: "test",
    attack: 5,
    defense: 3,
    effect: "test",
    effectType: EffectType.HEAL,
    effectValue: 3,
    ultimate: 10,
    ultimateName: "test",
  }) satisfies GameCard

const makeEnemy = (): Enemy =>
  ({
    id: "test-enemy" as EnemyId,
    name: "Test Enemy",
    title: "Test",
    maxHp: 50,
    attackPower: 5,
    imageUrl: "",
    description: "test",
    difficulty: "NORMAL",
    reward: "test",
    phases: [{ triggerHpPercent: 50, message: "Phase 2!", attackBonus: 2 }],
  }) satisfies Enemy

const deck5: GameCard[] = Array.from({ length: 5 }, (_, i) => makeCard(`c${i}`, `Card ${i}`))

const makeAbilityResult = (overrides?: Partial<{ newEnemyHp: number }>) => ({
  damage: 5,
  heal: 0,
  shield: 0,
  attackReduction: 0,
  log: "test",
  newEnemyHp: 45,
  ...overrides,
})

const makeFieldChars = (): FieldChar[] =>
  deck5.map((c) => ({
    card: c,
    hp: 10,
    maxHp: 10,
    isDown: false,
  }))

/* ═══════════════════════════════════════════
   1. Initial State
   ═══════════════════════════════════════════ */
describe("initialBattleFSMState", () => {
  it("state is idle", () => {
    expect(initialBattleFSMState.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   2. SELECT_DECK
   ═══════════════════════════════════════════ */
describe("SELECT_DECK action", () => {
  it("transitions idle → deck-building with 5 cards", () => {
    const state = battleFSMReducer(initialBattleFSMState, { type: "SELECT_DECK", deck: deck5 })
    expect(state.state).toBe("deck-building")
    if (state.state === "deck-building") {
      expect(state.deck).toHaveLength(5)
    }
  })

  it("rejects deck with < 5 cards", () => {
    const shortDeck = [makeCard("c1", "A")]
    const state = battleFSMReducer(initialBattleFSMState, { type: "SELECT_DECK", deck: shortDeck })
    expect(state.state).toBe("idle")
  })

  it("rejects deck with > 5 cards", () => {
    const longDeck = Array.from({ length: 6 }, (_, i) => makeCard(`c${i}`, `C${i}`))
    const state = battleFSMReducer(initialBattleFSMState, { type: "SELECT_DECK", deck: longDeck })
    expect(state.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   3. START_BATTLE
   ═══════════════════════════════════════════ */
describe("START_BATTLE action", () => {
  it("transitions deck-building → battle-init", () => {
    const deckState: BattleFSMState = { state: "deck-building", deck: deck5 }
    const enemy = makeEnemy()
    const state = battleFSMReducer(deckState, { type: "START_BATTLE", enemy, deck: deck5 })
    expect(state.state).toBe("battle-init")
    if (state.state === "battle-init") {
      expect(state.enemy.id).toBe("test-enemy")
    }
  })

  it("can start from idle state", () => {
    const enemy = makeEnemy()
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "START_BATTLE",
      enemy,
      deck: deck5,
    })
    expect(state.state).toBe("battle-init")
  })

  it("stores enemy in state", () => {
    const enemy = makeEnemy()
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "START_BATTLE",
      enemy,
      deck: deck5,
    })
    if (state.state === "battle-init") {
      expect(state.enemy.name).toBe("Test Enemy")
      expect(state.enemy.maxHp).toBe(50)
    }
  })
})

/* ═══════════════════════════════════════════
   4. SELECT_CHARACTER
   ═══════════════════════════════════════════ */
describe("SELECT_CHARACTER action", () => {
  it("rejects from idle state", () => {
    const state = battleFSMReducer(initialBattleFSMState, { type: "SELECT_CHARACTER", index: 0 })
    expect(state.state).toBe("idle")
  })

  it("transitions turn-start → ability-select", () => {
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, { type: "SELECT_CHARACTER", index: 0 })
    expect(state.state).toBe("ability-select")
    if (state.state === "ability-select") {
      expect(state.selectedCharIndex).toBe(0)
    }
  })

  it("rejects downed character selection", () => {
    const chars = makeFieldChars()
    chars[0] = { card: chars[0]!.card, hp: chars[0]!.hp, maxHp: chars[0]!.maxHp, isDown: true }
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: chars,
      enemy: makeEnemy(),
      enemyHp: 50,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, { type: "SELECT_CHARACTER", index: 0 })
    expect(state.state).toBe("turn-start")
  })

  it("rejects out-of-bounds index", () => {
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, { type: "SELECT_CHARACTER", index: 99 })
    expect(state.state).toBe("turn-start")
  })
})

/* ═══════════════════════════════════════════
   5. PLAY_ABILITY
   ═══════════════════════════════════════════ */
describe("PLAY_ABILITY action", () => {
  it("transitions ability-select → turn-resolve", () => {
    const abilityState: BattleFSMState = {
      state: "ability-select",
      selectedCharIndex: 0,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      turn: 1,
    }
    const result = makeAbilityResult()
    const state = battleFSMReducer(abilityState, { type: "PLAY_ABILITY", ability: "効果", result })
    expect(state.state).toBe("turn-resolve")
    if (state.state === "turn-resolve") {
      expect(state.result.damage).toBe(5)
      expect(state.enemyHp).toBe(45)
    }
  })

  it("rejects from non-ability-select state", () => {
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "PLAY_ABILITY",
      ability: "効果",
      result: makeAbilityResult(),
    })
    expect(state.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   6. END_ENEMY_TURN
   ═══════════════════════════════════════════ */
describe("END_ENEMY_TURN action", () => {
  it("transitions enemy-turn → turn-start (not all down)", () => {
    const enemyTurnState: BattleFSMState = {
      state: "enemy-turn",
      enemy: makeEnemy(),
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      turn: 1,
    }
    const state = battleFSMReducer(enemyTurnState, {
      type: "END_ENEMY_TURN",
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      allDown: false,
    })
    expect(state.state).toBe("turn-start")
    if (state.state === "turn-start") {
      expect(state.turn).toBe(2)
    }
  })

  it("transitions enemy-turn → battle-end when all down (defeat)", () => {
    const enemyTurnState: BattleFSMState = {
      state: "enemy-turn",
      enemy: makeEnemy(),
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      turn: 1,
    }
    const downedChars = makeFieldChars().map((fc) => ({ ...fc, isDown: true }))
    const state = battleFSMReducer(enemyTurnState, {
      type: "END_ENEMY_TURN",
      fieldCharacters: downedChars,
      enemyHp: 45,
      allDown: true,
    })
    expect(state.state).toBe("battle-end")
    if (state.state === "battle-end") {
      expect(state.outcome).toBe("defeat")
    }
  })

  it("increments turn on normal transition", () => {
    const enemyTurnState: BattleFSMState = {
      state: "enemy-turn",
      enemy: makeEnemy(),
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      turn: 5,
    }
    const state = battleFSMReducer(enemyTurnState, {
      type: "END_ENEMY_TURN",
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      allDown: false,
    })
    if (state.state === "turn-start") {
      expect(state.turn).toBe(6)
    }
  })

  it("rejects from non-enemy-turn state", () => {
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "END_ENEMY_TURN",
      fieldCharacters: makeFieldChars(),
      enemyHp: 45,
      allDown: false,
    })
    expect(state.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   7. PHASE_TRANSITION
   ═══════════════════════════════════════════ */
describe("PHASE_TRANSITION action", () => {
  it("transitions from turn-start to phase-transition", () => {
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 25,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, {
      type: "PHASE_TRANSITION",
      message: "Phase 2!",
      newPhase: 2,
      fieldCharacters: makeFieldChars(),
    })
    expect(state.state).toBe("phase-transition")
    if (state.state === "phase-transition") {
      expect(state.message).toBe("Phase 2!")
      expect(state.newPhase).toBe(2)
    }
  })

  it("rejects from idle (no enemy)", () => {
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "PHASE_TRANSITION",
      message: "test",
      newPhase: 1,
      fieldCharacters: makeFieldChars(),
    })
    expect(state.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   8. END_BATTLE
   ═══════════════════════════════════════════ */
describe("END_BATTLE action", () => {
  it("transitions turn-resolve → battle-end (victory)", () => {
    const turnResolveState: BattleFSMState = {
      state: "turn-resolve",
      ability: "必殺",
      result: makeAbilityResult({ newEnemyHp: 0 }),
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 0,
      turn: 1,
    }
    const state = battleFSMReducer(turnResolveState, { type: "END_BATTLE", outcome: "victory" })
    expect(state.state).toBe("battle-end")
    if (state.state === "battle-end") {
      expect(state.outcome).toBe("victory")
    }
  })

  it("transitions phase-transition → battle-end (defeat)", () => {
    const phaseState: BattleFSMState = {
      state: "phase-transition",
      message: "!",
      newPhase: 2,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      turn: 1,
    }
    const state = battleFSMReducer(phaseState, { type: "END_BATTLE", outcome: "defeat" })
    expect(state.state).toBe("battle-end")
    if (state.state === "battle-end") {
      expect(state.outcome).toBe("defeat")
    }
  })

  it("rejects from non-valid states", () => {
    const state = battleFSMReducer(initialBattleFSMState, {
      type: "END_BATTLE",
      outcome: "victory",
    })
    expect(state.state).toBe("idle")
  })

  it("stores correct turnsUsed", () => {
    const turnResolveState: BattleFSMState = {
      state: "turn-resolve",
      ability: "必殺",
      result: makeAbilityResult(),
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 45,
      turn: 7,
    }
    const state = battleFSMReducer(turnResolveState, { type: "END_BATTLE", outcome: "victory" })
    if (state.state === "battle-end") {
      expect(state.turnsUsed).toBe(7)
    }
  })
})

/* ═══════════════════════════════════════════
   9. RESET
   ═══════════════════════════════════════════ */
describe("RESET action", () => {
  it("resets from idle → idle", () => {
    const state = battleFSMReducer(initialBattleFSMState, { type: "RESET" })
    expect(state.state).toBe("idle")
  })

  it("resets from deck-building → idle", () => {
    const deckState: BattleFSMState = { state: "deck-building", deck: deck5 }
    const state = battleFSMReducer(deckState, { type: "RESET" })
    expect(state.state).toBe("idle")
  })

  it("resets from battle-end → idle", () => {
    const endState: BattleFSMState = {
      state: "battle-end",
      outcome: "victory",
      enemy: makeEnemy(),
      turnsUsed: 5,
      fieldCharacters: makeFieldChars(),
    }
    const state = battleFSMReducer(endState, { type: "RESET" })
    expect(state.state).toBe("idle")
  })

  it("resets from turn-resolve → idle", () => {
    const resolveState: BattleFSMState = {
      state: "turn-resolve",
      ability: "効果",
      result: makeAbilityResult(),
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 45,
      turn: 1,
    }
    const state = battleFSMReducer(resolveState, { type: "RESET" })
    expect(state.state).toBe("idle")
  })

  it("resets from phase-transition → idle", () => {
    const phaseState: BattleFSMState = {
      state: "phase-transition",
      message: "!",
      newPhase: 2,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      turn: 1,
    }
    const state = battleFSMReducer(phaseState, { type: "RESET" })
    expect(state.state).toBe("idle")
  })
})

/* ═══════════════════════════════════════════
   10. Invalid Transitions
   ═══════════════════════════════════════════ */
describe("Invalid transitions", () => {
  it("SELECT_CHARACTER from battle-init does nothing", () => {
    const initState: BattleFSMState = { state: "battle-init", enemy: makeEnemy(), deck: deck5 }
    const state = battleFSMReducer(initState, { type: "SELECT_CHARACTER", index: 0 })
    expect(state.state).toBe("battle-init")
  })

  it("PLAY_ABILITY from turn-start does nothing", () => {
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, {
      type: "PLAY_ABILITY",
      ability: "効果",
      result: makeAbilityResult(),
    })
    expect(state.state).toBe("turn-start")
  })

  it("END_ENEMY_TURN from ability-select does nothing", () => {
    const abilityState: BattleFSMState = {
      state: "ability-select",
      selectedCharIndex: 0,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      turn: 1,
    }
    const state = battleFSMReducer(abilityState, {
      type: "END_ENEMY_TURN",
      fieldCharacters: makeFieldChars(),
      enemyHp: 50,
      allDown: false,
    })
    expect(state.state).toBe("ability-select")
  })

  it("END_BATTLE from turn-start does nothing", () => {
    const turnStartState: BattleFSMState = {
      state: "turn-start",
      turn: 1,
      fieldCharacters: makeFieldChars(),
      enemy: makeEnemy(),
      enemyHp: 50,
      enemyCurrentPhase: 0,
      shieldBuffer: 0,
    }
    const state = battleFSMReducer(turnStartState, { type: "END_BATTLE", outcome: "victory" })
    expect(state.state).toBe("turn-start")
  })
})
