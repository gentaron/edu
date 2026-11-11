import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { useBattleStore } from "../stores"
import { EffectType } from "@/types"
import type { GameCard, Enemy } from "@/types"
import type { CardId, EnemyId } from "@/platform/schemas/branded"

/* Regression tests for bugs fixed in the battle store:
   1. timers from a battle you left acted on the next battle
   2. the final blow left the enemy HP bar at its old value for 0.8s
   3. hits were routed by card id, so a duplicated card always took the hit
      on its first copy — even when that copy was already down */

const card = (id: string, attack = 5): GameCard => ({
  id: id as CardId,
  name: id,
  imageUrl: "https://example.com/x.png",
  flavorText: "",
  rarity: "R",
  affiliation: "テスト",
  attack,
  defense: 3,
  effect: "HPを3回復",
  effectType: EffectType.HEAL,
  effectValue: 3,
  ultimate: 10,
  ultimateName: "必殺",
})

const enemy = (id: string, maxHp = 30, attackPower = 4): Enemy => ({
  id: id as EnemyId,
  name: id,
  title: "",
  maxHp,
  attackPower,
  imageUrl: "https://example.com/e.png",
  description: "",
  difficulty: "NORMAL",
  reward: "報酬",
  phases: [],
})

const deck = [card("a"), card("b"), card("c"), card("d"), card("e")]

describe("battle store — timers belong to one battle", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useBattleStore.getState().resetBattle()
  })
  afterEach(() => {
    useBattleStore.getState().resetBattle()
    vi.useRealTimers()
  })

  it("leaving mid-turn and starting another battle does not let the old enemy act", () => {
    const s = useBattleStore.getState()
    s.startBattle(enemy("old", 30, 9), deck)
    useBattleStore.setState({ selectedCharIndex: 0 })
    useBattleStore.getState().playAbility("攻撃") // enemy turn is now scheduled for +1.2s

    vi.advanceTimersByTime(200)
    useBattleStore.getState().resetBattle() // "← 敵選択"
    useBattleStore.getState().startBattle(enemy("new", 50, 1), deck)

    vi.advanceTimersByTime(10_000)
    const st = useBattleStore.getState()
    expect(st.selectedEnemy?.id).toBe("new")
    expect(st.turn).toBe(1)
    expect(st.phase).toBe("playerTurn")
    expect(st.fieldCharacters.every((fc) => fc.hp === fc.maxHp)).toBe(true)
  })

  it("a pending victory from the previous battle cannot end the new one", () => {
    useBattleStore.getState().startBattle(enemy("weak", 3), deck)
    useBattleStore.setState({ selectedCharIndex: 0 })
    useBattleStore.getState().playAbility("攻撃") // victory scheduled for +0.8s
    useBattleStore.getState().startBattle(enemy("strong", 100), deck)
    vi.advanceTimersByTime(5_000)
    expect(useBattleStore.getState().phase).toBe("playerTurn")
    expect(useBattleStore.getState().enemyHp).toBe(100)
  })

  it("resetBattle with nothing pending is harmless and a normal turn still completes", () => {
    useBattleStore.getState().startBattle(enemy("e"), deck)
    useBattleStore.setState({ selectedCharIndex: 0 })
    useBattleStore.getState().playAbility("攻撃")
    vi.advanceTimersByTime(1_200 + 1_000 + 50)
    const st = useBattleStore.getState()
    expect(st.turn).toBe(2)
    expect(st.phase).toBe("playerTurn")
  })
})

describe("battle store — the final blow shows at once", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useBattleStore.getState().resetBattle()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("enemy HP is 0 immediately, victory follows", () => {
    useBattleStore.getState().startBattle(enemy("e", 30), deck)
    useBattleStore.setState({ enemyHp: 3, selectedCharIndex: 0 })
    useBattleStore.getState().playAbility("攻撃")
    expect(useBattleStore.getState().enemyHp).toBe(0)
    expect(useBattleStore.getState().phase).toBe("resolving")
    vi.advanceTimersByTime(800)
    expect(useBattleStore.getState().phase).toBe("victory")
  })
})

describe("battle store — hits target a position, not a card id", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useBattleStore.getState().resetBattle()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("with duplicated cards, a downed copy is never hit again and the alive copy takes the damage", () => {
    const dup = card("same")
    useBattleStore.getState().startBattle(enemy("e", 100, 4), [dup, dup, card("x"), card("y"), card("z")])
    const fc = useBattleStore.getState().fieldCharacters.map((c, i) => (i === 0 ? { ...c, hp: 0, isDown: true } : i >= 2 ? { ...c, hp: 0, isDown: true } : c))
    useBattleStore.setState({ fieldCharacters: fc, selectedCharIndex: 1 })
    vi.spyOn(Math, "random").mockReturnValue(0) // first alive → index 1 (the second copy)
    useBattleStore.getState().playAbility("攻撃")
    vi.advanceTimersByTime(1_200 + 1_000 + 50)
    const after = useBattleStore.getState().fieldCharacters
    expect(after[0]!.hp).toBe(0) // the downed copy stays at 0
    expect(after[1]!.hp).toBeLessThan(after[1]!.maxHp) // the alive copy was hit
    expect(useBattleStore.getState().charHitIndex).toBe(1)
  })

  it("the start log reports the real party size", () => {
    useBattleStore.getState().startBattle(enemy("e"), deck.slice(0, 3))
    expect(useBattleStore.getState().log.some((l) => l.includes("3体の味方"))).toBe(true)
  })
})
