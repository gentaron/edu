import { describe, it, expect, beforeEach } from "vitest"
import { useBattleStore } from "../game-store"
import type { GameCard, Enemy } from "../card-data"

/* Minimal test fixtures */
const mockCard: GameCard = {
  id: "test-card-1",
  name: "テスト戦士",
  imageUrl: "https://example.com/test.png",
  flavorText: "テスト用のカード",
  rarity: "R",
  affiliation: "テスト陣営",
  attack: 5,
  defense: 3,
  effect: "HPを3回復",
  effectValue: 3,
  ultimate: 10,
  ultimateName: "テスト必殺技",
}

const mockCard2: GameCard = {
  id: "test-card-2",
  name: "テスト防御者",
  imageUrl: "https://example.com/test2.png",
  flavorText: "テスト用防御カード",
  rarity: "C",
  affiliation: "テスト陣営",
  attack: 3,
  defense: 5,
  effect: "シールド+4",
  effectValue: 4,
  ultimate: 7,
  ultimateName: "テスト防御技",
}

const mockEnemy: Enemy = {
  id: "test-enemy",
  name: "テスト敵",
  title: "テストの試練",
  maxHp: 30,
  attackPower: 4,
  imageUrl: "https://example.com/enemy.png",
  description: "テスト用の敵キャラ",
  difficulty: "NORMAL",
  reward: "テスト報酬",
  phases: [],
}

describe("game-store", () => {
  beforeEach(() => {
    useBattleStore.getState().resetBattle()
  })

  it("startBattle should set phase to playerTurn and place 5 characters on field", () => {
    const store = useBattleStore.getState()
    const deck = [mockCard, mockCard2, mockCard, mockCard2, mockCard]

    store.startBattle(mockEnemy, deck)

    const state = useBattleStore.getState()
    expect(state.phase).toBe("playerTurn")
    expect(state.fieldCharacters.length).toBe(5)
    expect(state.fieldCharacters[0].hp).toBeGreaterThan(0)
    expect(state.fieldCharacters[0].maxHp).toBeGreaterThan(0)
    expect(state.enemyHp).toBe(30)
    expect(state.turn).toBe(1)
  })

  it("selectCharacter should select a valid character", () => {
    const store = useBattleStore.getState()
    store.startBattle(mockEnemy, [mockCard, mockCard2, mockCard, mockCard2, mockCard])

    useBattleStore.getState().selectCharacter(2)

    expect(useBattleStore.getState().selectedCharIndex).toBe(2)
  })

  it("selectCharacter should not select a downed character", () => {
    const store = useBattleStore.getState()
    store.startBattle(mockEnemy, [mockCard, mockCard2, mockCard, mockCard2, mockCard])

    // Manually mark character 1 as down
    useBattleStore.setState((s) => ({
      fieldCharacters: s.fieldCharacters.map((fc, i) =>
        i === 1 ? { ...fc, hp: 0, isDown: true } : fc
      ),
    }))

    useBattleStore.getState().selectCharacter(1)
    expect(useBattleStore.getState().selectedCharIndex).toBeNull()
  })

  it("playAbility attack should reduce enemy HP", () => {
    const store = useBattleStore.getState()
    store.startBattle(mockEnemy, [mockCard, mockCard2, mockCard, mockCard2, mockCard])
    useBattleStore.getState().selectCharacter(0)

    useBattleStore.getState().playAbility("攻撃")

    // After attack with card.attack=5, enemy HP should be 30-5=25
    expect(useBattleStore.getState().enemyHp).toBe(25)
  })

  it("enemyHp reaching 0 should set phase to victory", async () => {
    const store = useBattleStore.getState()
    store.startBattle(mockEnemy, [mockCard, mockCard2, mockCard, mockCard2, mockCard])
    // Set enemy HP very low so next attack kills it
    useBattleStore.setState({ enemyHp: 3, selectedCharIndex: 0 })

    useBattleStore.getState().playAbility("攻撃")

    // Victory is set via setTimeout(800), wait for it
    await new Promise((r) => setTimeout(r, 1000))
    expect(useBattleStore.getState().phase).toBe("victory")
  })

  it("resetBattle should clear all state", () => {
    const store = useBattleStore.getState()
    store.startBattle(mockEnemy, [mockCard, mockCard2, mockCard, mockCard2, mockCard])

    useBattleStore.getState().resetBattle()

    const state = useBattleStore.getState()
    expect(state.phase).toBe("idle")
    expect(state.fieldCharacters.length).toBe(0)
    expect(state.shieldBuffer).toBe(0)
    expect(state.enemyHp).toBe(0)
    expect(state.log.length).toBe(0)
  })
})
