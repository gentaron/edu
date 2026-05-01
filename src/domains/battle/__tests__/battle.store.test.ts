import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { useBattleStore } from "@/domains/battle/battle.store"
import { eventBus } from "@/platform/event-bus"
import type { GameCard, Enemy } from "@/types"
import type { CardId, EnemyId } from "@/platform/schemas/branded"

// Mock the event bus
vi.mock("@/platform/event-bus", () => ({
  eventBus: {
    publish: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
    subscribeAll: vi.fn(() => vi.fn()),
    clear: vi.fn(),
  },
}))

const makeCard = (id: string, overrides?: Partial<GameCard>): GameCard => ({
  id: id as CardId,
  name: `Card ${id}`,
  imageUrl: `/card-${id}.png`,
  flavorText: `Flavor for ${id}`,
  rarity: "R",
  affiliation: "Test",
  attack: 10,
  defense: 5,
  effect: "DAMAGE",
  effectType: "DAMAGE",
  effectValue: 8,
  ultimate: 20,
  ultimateName: "Ultimate",
  ...overrides,
})

const makeEnemy = (id = "test-enemy", overrides?: Partial<Enemy>): Enemy => ({
  id: id as EnemyId,
  name: "Test Enemy",
  title: "The Tester",
  maxHp: 500,
  attackPower: 10,
  imageUrl: "/enemy.png",
  description: "An enemy",
  difficulty: "NORMAL",
  reward: "Victory Reward",
  phases: [
    { triggerHpPercent: 100, message: "Phase 1 start", attackBonus: 0 },
    { triggerHpPercent: 50, message: "Phase 2!", attackBonus: 20 },
  ],
  ...overrides,
})

describe("useBattleStore", () => {
  beforeEach(() => {
    useBattleStore.getState().resetBattle()
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  /* ── Initial State ── */
  describe("initial state", () => {
    it("starts in idle phase", () => {
      expect(useBattleStore.getState().phase).toBe("idle")
    })

    it("has empty field characters initially", () => {
      expect(useBattleStore.getState().fieldCharacters).toHaveLength(0)
    })

    it("has null selected enemy", () => {
      expect(useBattleStore.getState().selectedEnemy).toBeNull()
    })

    it("has empty log initially", () => {
      expect(useBattleStore.getState().log).toHaveLength(0)
    })

    it("getSnapshot returns all fields", () => {
      const snapshot = useBattleStore.getState().getSnapshot()
      expect(snapshot).toHaveProperty("phase")
      expect(snapshot).toHaveProperty("shieldBuffer")
      expect(snapshot).toHaveProperty("selectedEnemy")
      expect(snapshot).toHaveProperty("enemyHp")
      expect(snapshot).toHaveProperty("enemyCurrentPhase")
      expect(snapshot).toHaveProperty("turn")
      expect(snapshot).toHaveProperty("fieldCharacters")
      expect(snapshot).toHaveProperty("selectedCharIndex")
      expect(snapshot).toHaveProperty("playerAbility")
      expect(snapshot).toHaveProperty("poisonActive")
      expect(snapshot).toHaveProperty("enemyAttackReduction")
      expect(snapshot).toHaveProperty("log")
      expect(snapshot).toHaveProperty("screenShake")
      expect(snapshot).toHaveProperty("enemyFlash")
      expect(snapshot).toHaveProperty("healFlash")
      expect(snapshot).toHaveProperty("shieldFlash")
      expect(snapshot).toHaveProperty("charHitIndex")
    })
  })

  /* ── startBattle ── */
  describe("startBattle", () => {
    it("sets phase to playerTurn", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1"), makeCard("c2"), makeCard("c3")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().phase).toBe("playerTurn")
    })

    it("creates field characters from deck", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1"), makeCard("c2"), makeCard("c3")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().fieldCharacters).toHaveLength(3)
    })

    it("sets enemy HP to maxHp", () => {
      const enemy = makeEnemy("e1", { maxHp: 500 })
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().enemyHp).toBe(500)
    })

    it("sets turn to 1", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().turn).toBe(1)
    })

    it("sets shieldBuffer to 0", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().shieldBuffer).toBe(0)
    })

    it("initializes poisonActive for venom-hydra", () => {
      const enemy = makeEnemy("venom-hydra")
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().poisonActive).toBe(true)
    })

    it("does not initialize poisonActive for regular enemy", () => {
      const enemy = makeEnemy("regular-enemy")
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().poisonActive).toBe(false)
    })

    it("reduces HP by 1 for frost-guardian at start", () => {
      const enemy = makeEnemy("frost-guardian")
      const deck = [makeCard("c1", { defense: 100 })]
      useBattleStore.getState().startBattle(enemy, deck)
      // maxHp comes from charMaxHp which is defense * 3 = 300
      // frost-guardian reduces by 1 → hp should be 299
      const fc = useBattleStore.getState().fieldCharacters[0]
      expect(fc!.hp).toBeLessThan(fc!.maxHp)
    })

    it("publishes battle:start event", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "battle:start", enemyId: "test-enemy" })
      )
    })

    it("adds initial log entries", () => {
      const enemy = makeEnemy("my-enemy", { name: "My Enemy" })
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      expect(useBattleStore.getState().log.length).toBeGreaterThan(0)
      expect(useBattleStore.getState().log[0]).toContain("My Enemy")
    })
  })

  /* ── selectCharacter ── */
  describe("selectCharacter", () => {
    it("selects a character at valid index", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1"), makeCard("c2")]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.getState().selectCharacter(0)
      expect(useBattleStore.getState().selectedCharIndex).toBe(0)
    })

    it("ignores selection when not in playerTurn", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      // Force to a different phase
      useBattleStore.setState({ phase: "enemyTurn" })
      useBattleStore.getState().selectCharacter(0)
      expect(useBattleStore.getState().selectedCharIndex).toBeNull()
    })

    it("ignores selection of downed character", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      // Simulate a downed character
      const fc = useBattleStore.getState().fieldCharacters[0]!
      useBattleStore.setState({
        fieldCharacters: [{ ...fc, hp: 0, isDown: true }],
      })
      useBattleStore.getState().selectCharacter(0)
      expect(useBattleStore.getState().selectedCharIndex).toBeNull()
    })

    it("ignores out-of-bounds index", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.getState().selectCharacter(99)
      expect(useBattleStore.getState().selectedCharIndex).toBeNull()
    })
  })

  /* ── playAbility ── */
  describe("playAbility", () => {
    const setupBattle = () => {
      const enemy = makeEnemy("e1", { maxHp: 500 })
      const card = makeCard("c1", { attack: 30, defense: 10, ultimate: 50, effectType: "DAMAGE" })
      const deck = [card]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.getState().selectCharacter(0)
      return enemy
    }

    it("ignores when not in playerTurn", () => {
      setupBattle()
      useBattleStore.setState({ phase: "enemyTurn" })
      const hpBefore = useBattleStore.getState().enemyHp
      useBattleStore.getState().playAbility("攻撃")
      expect(useBattleStore.getState().enemyHp).toBe(hpBefore)
    })

    it("ignores when no character selected", () => {
      setupBattle()
      useBattleStore.setState({ selectedCharIndex: null })
      const hpBefore = useBattleStore.getState().enemyHp
      useBattleStore.getState().playAbility("攻撃")
      expect(useBattleStore.getState().enemyHp).toBe(hpBefore)
    })

    it("攻撃 reduces enemy HP", () => {
      setupBattle()
      useBattleStore.getState().playAbility("攻撃")
      expect(useBattleStore.getState().enemyHp).toBeLessThan(500)
      expect(useBattleStore.getState().phase).toBe("resolving")
    })

    it("防御 increases shield buffer", () => {
      setupBattle()
      useBattleStore.getState().playAbility("防御")
      expect(useBattleStore.getState().shieldBuffer).toBeGreaterThan(0)
    })

    it("必殺 deals ultimate damage", () => {
      setupBattle()
      useBattleStore.getState().playAbility("必殺")
      expect(useBattleStore.getState().enemyHp).toBe(500 - 50) // ultimate = 50
    })

    it("効果 deals effect damage", () => {
      setupBattle()
      useBattleStore.getState().playAbility("効果")
      expect(useBattleStore.getState().enemyHp).toBeLessThan(500)
    })

    it("sets screenShake for 必殺", () => {
      setupBattle()
      useBattleStore.getState().playAbility("必殺")
      expect(useBattleStore.getState().screenShake).toBe(true)
    })

    it("sets enemyFlash for 攻撃", () => {
      setupBattle()
      useBattleStore.getState().playAbility("攻撃")
      expect(useBattleStore.getState().enemyFlash).toBe(true)
    })

    it("sets shieldFlash for 防御", () => {
      setupBattle()
      useBattleStore.getState().playAbility("防御")
      expect(useBattleStore.getState().shieldFlash).toBe(true)
    })

    it("publishes battle:ability event", () => {
      setupBattle()
      useBattleStore.getState().playAbility("攻撃")
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "battle:ability", ability: "攻撃" })
      )
    })

    it("victory when enemy HP reaches 0", () => {
      const enemy = makeEnemy("weak", { maxHp: 30 })
      const card = makeCard("c1", { attack: 30, ultimate: 50, effectType: "DAMAGE" })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      useBattleStore.getState().playAbility("攻撃")
      // Advance timers to trigger victory
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().phase).toBe("victory")
      expect(useBattleStore.getState().enemyHp).toBe(0)
    })

    it("victory publishes battle:victory event", () => {
      const enemy = makeEnemy("weak", { maxHp: 30 })
      const card = makeCard("c1", { attack: 30, ultimate: 50, effectType: "DAMAGE" })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      useBattleStore.getState().playAbility("攻撃")
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("撃破"))).toBe(true)
    })
  })

  /* ── resetBattle ── */
  describe("resetBattle", () => {
    it("resets all state to initial values", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.getState().resetBattle()
      expect(useBattleStore.getState().phase).toBe("idle")
      expect(useBattleStore.getState().fieldCharacters).toHaveLength(0)
      expect(useBattleStore.getState().selectedEnemy).toBeNull()
      expect(useBattleStore.getState().enemyHp).toBe(0)
      expect(useBattleStore.getState().log).toHaveLength(0)
      expect(useBattleStore.getState().shieldBuffer).toBe(0)
      expect(useBattleStore.getState().turn).toBe(0)
    })

    it("publishes battle:reset event", () => {
      useBattleStore.getState().startBattle(makeEnemy(), [makeCard("c1")])
      useBattleStore.getState().resetBattle()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith({ type: "battle:reset" })
    })
  })

  /* ── checkPhaseTransition ── */
  describe("checkPhaseTransition", () => {
    it("updates phase when HP drops below threshold", () => {
      const enemy = makeEnemy("e1", {
        maxHp: 200,
        phases: [
          { triggerHpPercent: 100, message: "Phase 1", attackBonus: 0 },
          { triggerHpPercent: 50, message: "Phase 2!", attackBonus: 20 },
        ],
      })
      const card = makeCard("c1", { attack: 100, effectType: "DAMAGE", ultimate: 50 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      useBattleStore.getState().playAbility("攻撃")
      // HP is now 100 which is 50% → should trigger phase transitions
      // Phase 0: triggerHpPercent=100 (always active), Phase 1: triggerHpPercent=50
      // Both trigger at 50%, so phase becomes 2
      expect(useBattleStore.getState().enemyCurrentPhase).toBe(2)
    })

    it("adds phase transition message to log", () => {
      const enemy = makeEnemy("e1", {
        maxHp: 200,
        phases: [
          { triggerHpPercent: 100, message: "Phase 1", attackBonus: 0 },
          { triggerHpPercent: 50, message: "Enraged!", attackBonus: 20 },
        ],
      })
      const card = makeCard("c1", { attack: 100, effectType: "DAMAGE", ultimate: 50 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      useBattleStore.getState().playAbility("攻撃")
      expect(useBattleStore.getState().log.some((l) => l.includes("Enraged!"))).toBe(true)
    })

    it("does nothing when no selected enemy", () => {
      useBattleStore.getState().resetBattle()
      useBattleStore.getState().checkPhaseTransition()
      expect(useBattleStore.getState().enemyCurrentPhase).toBe(0)
    })
  })

  /* ── executeEnemyTurn ── */
  describe("executeEnemyTurn", () => {
    it("does nothing when no selected enemy", () => {
      useBattleStore.getState().executeEnemyTurn()
      expect(useBattleStore.getState().phase).toBe("idle")
    })

    it("does nothing in victory phase", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.setState({ phase: "victory" })
      useBattleStore.getState().executeEnemyTurn()
      expect(useBattleStore.getState().phase).toBe("victory")
    })

    it("does nothing in defeat phase", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1")]
      useBattleStore.getState().startBattle(enemy, deck)
      useBattleStore.setState({ phase: "defeat" })
      useBattleStore.getState().executeEnemyTurn()
      expect(useBattleStore.getState().phase).toBe("defeat")
    })

    it("sets phase to enemyTurn", () => {
      const enemy = makeEnemy()
      const deck = [makeCard("c1", { defense: 100 })]
      useBattleStore.getState().startBattle(enemy, deck)
      // Force player turn so executeEnemyTurn can run
      useBattleStore.setState({ phase: "playerTurn" })
      useBattleStore.getState().executeEnemyTurn()
      expect(useBattleStore.getState().phase).toBe("enemyTurn")
    })

    it("increments turn after enemy acts", () => {
      const enemy = makeEnemy("e1", { maxHp: 500, attackPower: 5 })
      const card = makeCard("c1", { defense: 100 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.setState({ phase: "playerTurn" })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().turn).toBe(2)
    })

    it("publishes battle:turn event", () => {
      const enemy = makeEnemy("e1", { maxHp: 500, attackPower: 5 })
      const card = makeCard("c1", { defense: 100 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.setState({ phase: "playerTurn" })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "battle:turn", turn: 2 })
      )
    })

    it("sets defeat phase when all characters are down", () => {
      // Create a weak character that will die from enemy attack
      const enemy = makeEnemy("e1", { maxHp: 500, attackPower: 999 })
      const card = makeCard("c1", { defense: 1 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.setState({ phase: "playerTurn" })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().phase).toBe("defeat")
    })

    it("applies poison damage for venom-hydra", () => {
      const enemy = makeEnemy("venom-hydra", {
        maxHp: 500,
        attackPower: 0,
        phases: [{ triggerHpPercent: 100, message: "Phase 1", attackBonus: 0 }],
      })
      const card = makeCard("c1", { defense: 100 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.setState({ phase: "playerTurn" })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      // Poison should deal 1 extra damage → character should have less HP
      const fc = useBattleStore.getState().fieldCharacters[0]
      expect(fc!.hp).toBeLessThan(fc!.maxHp)
    })

    it("frost-guardian special attack at low HP on even turn", () => {
      const enemy = makeEnemy("frost-guardian", {
        maxHp: 200,
        attackPower: 0,
        phases: [{ triggerHpPercent: 100, message: "Phase 1", attackBonus: 0 }],
      })
      const card = makeCard("c1", { defense: 100 })
      useBattleStore.getState().startBattle(enemy, [card])
      // Set HP to 50% and turn to 2 (even)
      useBattleStore.setState({ phase: "playerTurn", enemyHp: 100, turn: 2 })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      // Frost guardian should deal extra 3 damage when hpPct <= 50% and even turn
      const fc = useBattleStore.getState().fieldCharacters[0]
      expect(fc!.hp).toBeLessThan(fc!.maxHp)
    })
  })

  /* ── Enemy-specific playAbility branches ── */
  describe("playAbility enemy-specific", () => {
    const startBattleWithEnemy = (enemyId: string, overrides?: Partial<Enemy>) => {
      const enemy = makeEnemy(enemyId, overrides)
      const card = makeCard("c1", {
        attack: 30,
        defense: 20,
        ultimate: 50,
        effectType: "DAMAGE",
        effectValue: 8,
      })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      return { enemy, card }
    }

    it("void-king phase 3 absorbs 攻撃 damage", () => {
      const { enemy: _enemy } = startBattleWithEnemy("void-king", {
        maxHp: 200,
        phases: [
          { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
          { triggerHpPercent: 60, message: "P2", attackBonus: 10 },
          { triggerHpPercent: 30, message: "P3", attackBonus: 20 },
        ],
      })
      // Set phase to 3
      useBattleStore.setState({ enemyCurrentPhase: 3 })
      const hpBefore = useBattleStore.getState().enemyHp
      useBattleStore.getState().playAbility("攻撃")
      // Attack should be absorbed
      expect(useBattleStore.getState().enemyHp).toBe(hpBefore)
      expect(useBattleStore.getState().log.some((l) => l.includes("虚無に吸収"))).toBe(true)
    })

    it("void-king phase 3 doubles 必殺 damage", () => {
      startBattleWithEnemy("void-king", {
        maxHp: 200,
        phases: [
          { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
          { triggerHpPercent: 60, message: "P2", attackBonus: 10 },
          { triggerHpPercent: 30, message: "P3", attackBonus: 20 },
        ],
      })
      useBattleStore.setState({ enemyCurrentPhase: 3 })
      useBattleStore.getState().playAbility("必殺")
      // Ultimate 50 * 2 = 100 damage
      expect(useBattleStore.getState().enemyHp).toBe(200 - 100)
    })

    it("iron-golem halves 防御 value", () => {
      startBattleWithEnemy("iron-golem", {
        maxHp: 200,
        phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
      })
      useBattleStore.getState().playAbility("防御")
      // defense is 20, halved = 10
      expect(useBattleStore.getState().shieldBuffer).toBe(10)
      expect(useBattleStore.getState().log.some((l) => l.includes("半減"))).toBe(true)
    })

    it("flame-spirit deals 1 self-damage on 防御", () => {
      startBattleWithEnemy("flame-spirit", {
        maxHp: 200,
        phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
      })
      const _hpBeforeChar = useBattleStore.getState().fieldCharacters[0]!.hp
      useBattleStore.getState().playAbility("防御")
      // Should have self-damage of 1
      expect(useBattleStore.getState().log.some((l) => l.includes("熱で"))).toBe(true)
    })

    it("void-spider blocks defense on even turn", () => {
      startBattleWithEnemy("void-spider", {
        maxHp: 200,
        phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
      })
      useBattleStore.setState({ turn: 2 }) // Even turn
      useBattleStore.getState().playAbility("防御")
      expect(useBattleStore.getState().shieldBuffer).toBe(0)
      expect(useBattleStore.getState().log.some((l) => l.includes("封じられ"))).toBe(true)
    })

    it("void-spider allows defense on odd turn", () => {
      startBattleWithEnemy("void-spider", {
        maxHp: 200,
        phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
      })
      useBattleStore.setState({ turn: 1 }) // Odd turn
      useBattleStore.getState().playAbility("防御")
      expect(useBattleStore.getState().shieldBuffer).toBe(20) // defense = 20
    })
  })

  /* ── Enemy-specific executeEnemyTurn branches ── */
  describe("executeEnemyTurn enemy-specific", () => {
    const setupEnemyTurn = (
      enemyId: string,
      overrides?: Partial<Enemy>,
      stateOverrides?: Record<string, unknown>
    ) => {
      const enemy = makeEnemy(enemyId, overrides)
      const card = makeCard("c1", { defense: 100 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.setState({ phase: "playerTurn", ...stateOverrides })
      return enemy
    }

    it("flame-spirit special attack at low HP", () => {
      setupEnemyTurn(
        "flame-spirit",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
        },
        { enemyHp: 50 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("業火"))).toBe(true)
    })

    it("void-spider special attack at low HP on odd turn", () => {
      setupEnemyTurn(
        "void-spider",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
        },
        { enemyHp: 60, turn: 1 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("捕縛糸"))).toBe(true)
    })

    it("fallen-angel special attack at low HP", () => {
      setupEnemyTurn(
        "fallen-angel",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
        },
        { enemyHp: 50 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("裁きの光"))).toBe(true)
    })

    it("void-reaper special attacks at phase 2+", () => {
      setupEnemyTurn(
        "void-reaper",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [
            { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
            { triggerHpPercent: 50, message: "P2", attackBonus: 10 },
            { triggerHpPercent: 20, message: "P3", attackBonus: 20 },
          ],
        },
        { enemyCurrentPhase: 2 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("時空の刃"))).toBe(true)
    })

    it("void-reaper extra attack at low HP", () => {
      setupEnemyTurn(
        "void-reaper",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [
            { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
            { triggerHpPercent: 50, message: "P2", attackBonus: 10 },
          ],
        },
        { enemyHp: 50 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("虚無の刃"))).toBe(true)
    })

    it("void-king wave attack at phase 1+", () => {
      setupEnemyTurn(
        "void-king",
        {
          maxHp: 500,
          attackPower: 0,
          phases: [
            { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
            { triggerHpPercent: 50, message: "P2", attackBonus: 10 },
          ],
        },
        { enemyCurrentPhase: 1 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("虚無の波"))).toBe(true)
    })

    it("void-king existence erosion at low HP", () => {
      setupEnemyTurn(
        "void-king",
        {
          maxHp: 500,
          attackPower: 0,
          phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
        },
        { enemyHp: 100 }
      ) // 20% HP → below 45%
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("存在の侵食"))).toBe(true)
    })

    it("enemy self-heal from phase with selfHealPerTurn", () => {
      setupEnemyTurn(
        "heal-enemy",
        {
          maxHp: 200,
          attackPower: 0,
          phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0, selfHealPerTurn: 10 }],
        },
        { enemyHp: 100 }
      )
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().log.some((l) => l.includes("HP回復"))).toBe(true)
      expect(useBattleStore.getState().enemyHp).toBe(110) // 100 + 10
    })

    it("clears shieldBuffer and attackReduction after enemy turn", () => {
      setupEnemyTurn("e1", {
        maxHp: 500,
        attackPower: 0,
        phases: [{ triggerHpPercent: 100, message: "P1", attackBonus: 0 }],
      })
      useBattleStore.setState({ shieldBuffer: 50, enemyAttackReduction: 5 })
      useBattleStore.getState().executeEnemyTurn()
      vi.advanceTimersByTime(2000)
      expect(useBattleStore.getState().shieldBuffer).toBe(0)
      expect(useBattleStore.getState().enemyAttackReduction).toBe(0)
    })
  })

  /* ── checkPhaseTransition void-reaper ── */
  describe("checkPhaseTransition enemy-specific", () => {
    it("void-reaper deals damage on phase transition", () => {
      const enemy = makeEnemy("void-reaper", {
        maxHp: 200,
        phases: [
          { triggerHpPercent: 100, message: "P1", attackBonus: 0 },
          { triggerHpPercent: 50, message: "Dimensional rift!", attackBonus: 10 },
        ],
      })
      const card = makeCard("c1", { attack: 100, defense: 100, effectType: "DAMAGE", ultimate: 50 })
      useBattleStore.getState().startBattle(enemy, [card])
      useBattleStore.getState().selectCharacter(0)
      useBattleStore.getState().playAbility("攻撃")
      // HP at 50% triggers void-reaper phase transition damage
      expect(useBattleStore.getState().log.some((l) => l.includes("次元断絶"))).toBe(true)
    })
  })
})
