import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  charMaxHp,
  appendLog,
  hitRandomChar,
  calculatePhaseTransition,
  calculateEnemySelfHeal,
  calculateEffectDamage,
  calculateEnemyDamage,
} from "@/domains/battle/battle.engine"
import { EffectType } from "@/types"
import type { GameCard, Enemy, FieldChar } from "@/types"
import type { CardId, EnemyId } from "@/platform/schemas/branded"

/* ═══════════════════════════════════════════
   1. charMaxHp — HP Calculation
   ═══════════════════════════════════════════ */
describe("charMaxHp", () => {
  const makeCard = (rarity: "SR" | "R" | "C", defense: number): GameCard =>
    ({
      id: "test" as CardId,
      name: "Test",
      imageUrl: "",
      flavorText: "",
      rarity,
      affiliation: "test",
      attack: 5,
      defense,
      effect: "test",
      effectType: EffectType.HEAL,
      effectValue: 3,
      ultimate: 10,
      ultimateName: "test",
    }) satisfies GameCard

  it("SR card gets base HP 14 + defense", () => {
    expect(charMaxHp(makeCard("SR", 4))).toBe(18)
  })

  it("R card gets base HP 10 + defense", () => {
    expect(charMaxHp(makeCard("R", 3))).toBe(13)
  })

  it("C card gets base HP 8 + defense", () => {
    expect(charMaxHp(makeCard("C", 2))).toBe(10)
  })

  it("SR base is higher than R base", () => {
    const srHp = charMaxHp(makeCard("SR", 0))
    const rHp = charMaxHp(makeCard("R", 0))
    expect(srHp).toBeGreaterThan(rHp)
  })

  it("R base is higher than C base", () => {
    const rHp = charMaxHp(makeCard("R", 0))
    const cHp = charMaxHp(makeCard("C", 0))
    expect(rHp).toBeGreaterThan(cHp)
  })

  it("always returns a positive number for any valid card", () => {
    const card = makeCard("SR", 1)
    expect(charMaxHp(card)).toBeGreaterThan(0)
  })

  it("handles defense = 0 correctly", () => {
    expect(charMaxHp(makeCard("SR", 0))).toBe(14)
    expect(charMaxHp(makeCard("R", 0))).toBe(10)
    expect(charMaxHp(makeCard("C", 0))).toBe(8)
  })

  it("handles high defense values", () => {
    expect(charMaxHp(makeCard("SR", 10))).toBe(24)
    expect(charMaxHp(makeCard("C", 10))).toBe(18)
  })

  it("returns integer value", () => {
    const result = charMaxHp(makeCard("SR", 3))
    expect(Number.isInteger(result)).toBe(true)
  })

  it("each rarity has the correct base", () => {
    expect(charMaxHp(makeCard("SR", 0))).toBe(14)
    expect(charMaxHp(makeCard("R", 0))).toBe(10)
    expect(charMaxHp(makeCard("C", 0))).toBe(8)
  })
})

/* ═══════════════════════════════════════════
   2. appendLog — Log Management
   ═══════════════════════════════════════════ */
describe("appendLog", () => {
  it("appends message to empty log", () => {
    const result = appendLog([], "first message")
    expect(result).toEqual(["first message"])
  })

  it("preserves previous entries", () => {
    const result = appendLog(["a", "b"], "c")
    expect(result).toEqual(["a", "b", "c"])
  })

  it("adds new message at the end", () => {
    const result = appendLog(["first"], "second")
    expect(result[1]).toBe("second")
  })

  it("keeps last 30 entries when at capacity", () => {
    const log30 = Array.from({ length: 30 }, (_, i) => `msg-${i}`)
    const result = appendLog(log30, "new")
    expect(result).toHaveLength(30)
    expect(result[29]).toBe("new")
  })

  it("trims old entries beyond 30", () => {
    const log31 = Array.from({ length: 31 }, (_, i) => `msg-${i}`)
    const result = appendLog(log31, "new")
    expect(result).toHaveLength(30)
    expect(result[0]).toBe("msg-2") // first entry dropped
    expect(result[29]).toBe("new")
  })

  it("returns a new array (immutability)", () => {
    const original = ["a"]
    const result = appendLog(original, "b")
    expect(result).not.toBe(original)
  })

  it("handles empty string message", () => {
    const result = appendLog(["a"], "")
    expect(result).toEqual(["a", ""])
  })

  it("handles messages with special characters", () => {
    const result = appendLog([], "✨ 攻撃！ 敵に5ダメージ！")
    expect(result).toEqual(["✨ 攻撃！ 敵に5ダメージ！"])
  })

  it("can chain multiple appends", () => {
    let log: string[] = []
    log = appendLog(log, "a")
    log = appendLog(log, "b")
    log = appendLog(log, "c")
    expect(log).toEqual(["a", "b", "c"])
  })
})

/* ═══════════════════════════════════════════
   3. hitRandomChar — Random Character Hit
   ═══════════════════════════════════════════ */
describe("hitRandomChar", () => {
  const makeCard = (id: string, name: string): GameCard =>
    ({
      id: id as CardId,
      name,
      imageUrl: "",
      flavorText: "",
      rarity: "R",
      affiliation: "test",
      attack: 5,
      defense: 3,
      effect: "test",
      effectType: EffectType.HEAL,
      effectValue: 3,
      ultimate: 10,
      ultimateName: "test",
    }) satisfies GameCard

  const makeFieldChar = (id: string, name: string, hp: number, isDown = false): FieldChar => ({
    card: makeCard(id, name),
    hp,
    maxHp: hp,
    isDown,
  })

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns a valid hit index when 5 chars are alive", () => {
    const fieldChars = [
      makeFieldChar("a", "A", 10),
      makeFieldChar("b", "B", 10),
      makeFieldChar("c", "C", 10),
      makeFieldChar("d", "D", 10),
      makeFieldChar("e", "E", 10),
    ]
    // Run many times to check bounds
    for (let i = 0; i < 100; i++) {
      const result = hitRandomChar(fieldChars, 3, "⚔️", "")
      expect(result.hitIndex).toBeGreaterThanOrEqual(0)
      expect(result.hitIndex).toBeLessThan(5)
    }
  })

  it("handles single alive character", () => {
    const fieldChars = [makeFieldChar("a", "A", 10)]
    const result = hitRandomChar(fieldChars, 5, "⚔️", "")
    expect(result.hitIndex).toBe(0)
  })

  it("returns null hitIndex when all chars are downed", () => {
    const fieldChars = [makeFieldChar("a", "A", 0, true), makeFieldChar("b", "B", 0, true)]
    const result = hitRandomChar(fieldChars, 5, "⚔️", "")
    expect(result.hitIndex).toBeNull()
    expect(result.logMessages).toEqual([])
  })

  it("skips downed characters", () => {
    const fieldChars = [
      makeFieldChar("a", "A", 0, true),
      makeFieldChar("b", "B", 10),
      makeFieldChar("c", "C", 0, true),
    ]
    const result = hitRandomChar(fieldChars, 3, "⚔️", "")
    expect(result.hitIndex).toBe(1)
  })

  it("applies damage to the target", () => {
    const fieldChars = [makeFieldChar("a", "A", 10)]
    const result = hitRandomChar(fieldChars, 3, "⚔️", "敵の")
    expect(result.fieldChars[0]!.hp).toBe(7)
  })

  it("clamps HP to 0 minimum", () => {
    const fieldChars = [makeFieldChar("a", "A", 2)]
    const result = hitRandomChar(fieldChars, 10, "⚔️", "")
    expect(result.fieldChars[0]!.hp).toBe(0)
    expect(result.fieldChars[0]!.isDown).toBe(true)
  })

  it("sets isDown when HP reaches 0", () => {
    const fieldChars = [makeFieldChar("a", "A", 5)]
    const result = hitRandomChar(fieldChars, 5, "⚔️", "")
    expect(result.fieldChars[0]!.hp).toBe(0)
    expect(result.fieldChars[0]!.isDown).toBe(true)
  })

  it("generates defeat log message when character is downed", () => {
    const fieldChars = [makeFieldChar("a", "TestChar", 1)]
    const result = hitRandomChar(fieldChars, 10, "💀", "")
    expect(result.logMessages[0]).toContain("撃破")
    expect(result.logMessages[0]).toContain("TestChar")
  })

  it("generates damage log message when character survives", () => {
    const fieldChars = [makeFieldChar("a", "TestChar", 20)]
    const result = hitRandomChar(fieldChars, 3, "⚔️", "敵の")
    expect(result.logMessages[0]).toContain("3ダメージ")
  })

  it("does not modify original fieldChars array", () => {
    const fieldChars = [makeFieldChar("a", "A", 10)]
    const original = [...fieldChars]
    hitRandomChar(fieldChars, 3, "⚔️", "")
    // The function returns a new array, so original should be unchanged
    expect(original[0]!.hp).toBe(10)
  })

  it("includes emoji in log message", () => {
    const fieldChars = [makeFieldChar("a", "A", 20)]
    const result = hitRandomChar(fieldChars, 3, "🔥", "")
    expect(result.logMessages[0]).toContain("🔥")
  })

  it("includes msgPrefix in log message", () => {
    const fieldChars = [makeFieldChar("a", "A", 20)]
    const result = hitRandomChar(fieldChars, 3, "⚔️", "ボスの")
    expect(result.logMessages[0]).toContain("ボスの")
  })

  it("zero damage does not down character", () => {
    const fieldChars = [makeFieldChar("a", "A", 10)]
    const result = hitRandomChar(fieldChars, 0, "⚔️", "")
    expect(result.fieldChars[0]!.hp).toBe(10)
    expect(result.fieldChars[0]!.isDown).toBe(false)
  })

  it("returns correct fieldChars structure", () => {
    const fieldChars = [makeFieldChar("a", "A", 10)]
    const result = hitRandomChar(fieldChars, 3, "⚔️", "")
    expect(result.fieldChars).toHaveLength(1)
    expect(result.fieldChars[0]!.card.id).toBe("a")
  })
})

/* ═══════════════════════════════════════════
   4. calculatePhaseTransition — Phase Transition
   ═══════════════════════════════════════════ */
describe("calculatePhaseTransition", () => {
  const makeEnemy = (phases: Enemy["phases"]): Enemy =>
    ({
      id: "test" as EnemyId,
      name: "Test",
      title: "Test Enemy",
      maxHp: 50,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases,
    }) satisfies Enemy

  const aliveFieldChars: FieldChar[] = [
    {
      card: {
        id: "c1" as CardId,
        name: "Char1",
        imageUrl: "",
        flavorText: "",
        rarity: "R",
        affiliation: "t",
        attack: 5,
        defense: 3,
        effect: "t",
        effectType: EffectType.HEAL,
        effectValue: 3,
        ultimate: 10,
        ultimateName: "t",
      },
      hp: 10,
      maxHp: 10,
      isDown: false,
    },
    {
      card: {
        id: "c2" as CardId,
        name: "Char2",
        imageUrl: "",
        flavorText: "",
        rarity: "R",
        affiliation: "t",
        attack: 5,
        defense: 3,
        effect: "t",
        effectType: EffectType.HEAL,
        effectValue: 3,
        ultimate: 10,
        ultimateName: "t",
      },
      hp: 10,
      maxHp: 10,
      isDown: false,
    },
  ]

  it("returns current phase when no transition needed (above threshold)", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "Phase 2!", attackBonus: 2 }])
    const result = calculatePhaseTransition(enemy, 80, 1, aliveFieldChars)
    expect(result.newPhase).toBe(1)
    expect(result.transitionMessage).toBeNull()
    expect(result.damageToApply).toEqual([])
  })

  it("transitions when HP drops below threshold", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "Phase 2!", attackBonus: 2 }])
    const result = calculatePhaseTransition(enemy, 40, 0, aliveFieldChars)
    expect(result.newPhase).toBe(1)
    expect(result.transitionMessage).toBe("Phase 2!")
  })

  it("does not re-transition if already at or above current phase", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "Phase 2!", attackBonus: 2 }])
    const result = calculatePhaseTransition(enemy, 40, 1, aliveFieldChars)
    expect(result.newPhase).toBe(1)
    expect(result.transitionMessage).toBeNull()
  })

  it("selects highest applicable phase", () => {
    const enemy = makeEnemy([
      { triggerHpPercent: 66, message: "Phase 1!", attackBonus: 1 },
      { triggerHpPercent: 33, message: "Phase 2!", attackBonus: 2 },
    ])
    const result = calculatePhaseTransition(enemy, 20, 0, aliveFieldChars)
    expect(result.newPhase).toBe(2)
    expect(result.transitionMessage).toBe("Phase 2!")
  })

  it("returns correct structure", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "msg", attackBonus: 1 }])
    const result = calculatePhaseTransition(enemy, 30, 0, aliveFieldChars)
    expect(result).toHaveProperty("newPhase")
    expect(result).toHaveProperty("transitionMessage")
    expect(result).toHaveProperty("damageToApply")
    expect(Array.isArray(result.damageToApply)).toBe(true)
  })

  it("transitions incrementally: phase 0→1 then 1→2", () => {
    const enemy = makeEnemy([
      { triggerHpPercent: 66, message: "P1", attackBonus: 1 },
      { triggerHpPercent: 33, message: "P2", attackBonus: 2 },
    ])
    // At 50%: should trigger phase 1 (trigger 66% not met, so...)
    // Actually 50% <= 66%, so phase 1 triggers
    const r1 = calculatePhaseTransition(enemy, 50, 0, aliveFieldChars)
    expect(r1.newPhase).toBe(1)

    // Now at currentPhase=1, hpPercent=20: 20 <= 33, so phase 2
    const r2 = calculatePhaseTransition(enemy, 20, 1, aliveFieldChars)
    expect(r2.newPhase).toBe(2)
  })

  it("no damage for non-void-reaper enemies", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "Phase!", attackBonus: 2 }])
    const result = calculatePhaseTransition(enemy, 30, 0, aliveFieldChars)
    expect(result.damageToApply).toEqual([])
  })

  it("void-reaper applies transition damage", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "次元切断！", attackBonus: 3 }])
    enemy.id = "void-reaper" as EnemyId
    const result = calculatePhaseTransition(enemy, 40, 0, aliveFieldChars)
    expect(result.damageToApply.length).toBeGreaterThanOrEqual(1)
  })

  it("void-reaper damage has correct structure", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "Phase!", attackBonus: 3 }])
    enemy.id = "void-reaper" as EnemyId
    const result = calculatePhaseTransition(enemy, 40, 0, aliveFieldChars)
    for (const dmg of result.damageToApply) {
      expect(dmg).toHaveProperty("charName")
      expect(dmg).toHaveProperty("damage")
      expect(dmg).toHaveProperty("charIdx")
      expect(dmg).toHaveProperty("isDown")
      expect(typeof dmg.damage).toBe("number")
      expect(typeof dmg.charIdx).toBe("number")
    }
  })

  it("handles 0 hpPercent (enemy at 0 HP)", () => {
    const enemy = makeEnemy([
      { triggerHpPercent: 50, message: "P1", attackBonus: 1 },
      { triggerHpPercent: 25, message: "P2", attackBonus: 2 },
    ])
    const result = calculatePhaseTransition(enemy, 0, 0, aliveFieldChars)
    expect(result.newPhase).toBe(2)
  })

  it("handles 100 hpPercent (full HP, no transition)", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "P1", attackBonus: 1 }])
    const result = calculatePhaseTransition(enemy, 100, 0, aliveFieldChars)
    expect(result.newPhase).toBe(0)
    expect(result.transitionMessage).toBeNull()
  })

  it("handles empty phases array", () => {
    const enemy = makeEnemy([])
    const result = calculatePhaseTransition(enemy, 50, 0, aliveFieldChars)
    expect(result.newPhase).toBe(0)
    expect(result.transitionMessage).toBeNull()
  })
})

/* ═══════════════════════════════════════════
   5. calculateEnemySelfHeal — Enemy Self-Heal
   ═══════════════════════════════════════════ */
describe("calculateEnemySelfHeal", () => {
  const makeEnemy = (selfHealPerTurn?: number, triggerHpPercent = 50): Enemy =>
    ({
      id: "test" as EnemyId,
      name: "Test",
      title: "Test",
      maxHp: 50,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases: [
        {
          triggerHpPercent,
          attackBonus: 1,
          message: "test",
          ...(selfHealPerTurn ? { selfHealPerTurn } : {}),
        },
      ],
    }) satisfies Enemy

  it("returns current HP when no self-heal phase", () => {
    const enemy = makeEnemy()
    const result = calculateEnemySelfHeal(enemy, 30, 20)
    expect(result).toBe(20)
  })

  it("applies self-heal when below trigger threshold", () => {
    const enemy = makeEnemy(3, 50)
    const result = calculateEnemySelfHeal(enemy, 40, 20)
    expect(result).toBe(23)
  })

  it("does not heal when above trigger threshold", () => {
    const enemy = makeEnemy(3, 50)
    const result = calculateEnemySelfHeal(enemy, 60, 20)
    expect(result).toBe(20)
  })

  it("clamps to maxHp", () => {
    const enemy = makeEnemy(100, 50)
    const result = calculateEnemySelfHeal(enemy, 40, 45)
    expect(result).toBe(50) // maxHp
  })

  it("returns non-negative value", () => {
    const enemy = makeEnemy(5, 50)
    const result = calculateEnemySelfHeal(enemy, 40, 0)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it("handles multiple phases with self-heal", () => {
    const enemy: Enemy = {
      id: "test" as EnemyId,
      name: "Test",
      title: "Test",
      maxHp: 100,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases: [
        { triggerHpPercent: 50, attackBonus: 1, selfHealPerTurn: 3, message: "test" },
        { triggerHpPercent: 25, attackBonus: 2, selfHealPerTurn: 5, message: "test" },
      ],
    }
    const result = calculateEnemySelfHeal(enemy, 20, 30)
    // Both phases trigger: 30 + 3 + 5 = 38
    expect(result).toBe(38)
  })

  it("returns currentEnemyHp when no phases trigger", () => {
    const enemy = makeEnemy(5, 30)
    const result = calculateEnemySelfHeal(enemy, 50, 40)
    expect(result).toBe(40)
  })
})

/* ═══════════════════════════════════════════
   6. calculateEffectDamage — Effect Damage
   ═══════════════════════════════════════════ */
describe("calculateEffectDamage", () => {
  it("heal-only effect returns correct heal", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "HPを5回復", 5, "Char", "enemy", false)
    expect(result.heal).toBe(5)
    expect(result.damage).toBe(0)
    expect(result.shield).toBe(0)
  })

  it("damage-only effect returns correct damage", () => {
    const result = calculateEffectDamage(
      EffectType.DAMAGE,
      "敵に5ダメージ",
      5,
      "Char",
      "enemy",
      false
    )
    expect(result.damage).toBe(5)
    expect(result.heal).toBe(0)
    expect(result.shield).toBe(0)
  })

  it("shield-only effect returns correct shield", () => {
    const result = calculateEffectDamage(EffectType.SHIELD, "シールド+5", 5, "Char", "enemy", false)
    expect(result.shield).toBe(5)
    expect(result.damage).toBe(0)
    expect(result.heal).toBe(0)
  })

  it("attack-reduction effect returns correct reduction", () => {
    const result = calculateEffectDamage(
      EffectType.ATTACK_REDUCTION,
      "敵の攻撃力低下",
      3,
      "Char",
      "enemy",
      false
    )
    expect(result.attackReduction).toBe(3)
    expect(result.damage).toBe(0)
  })

  it("damage+heal effect returns both values", () => {
    const result = calculateEffectDamage(
      EffectType.DAMAGE_HEAL,
      "敵に5ダメージ＋HPを2回復",
      5,
      "Char",
      "enemy",
      false
    )
    expect(result.damage).toBe(5)
    expect(result.heal).toBeGreaterThan(0)
  })

  it("damage+shield effect returns both values", () => {
    const result = calculateEffectDamage(
      EffectType.DAMAGE_SHIELD,
      "敵に5ダメージ＋シールド+3",
      5,
      "Char",
      "enemy",
      false
    )
    expect(result.damage).toBe(5)
    expect(result.shield).toBeGreaterThan(0)
  })

  it("heal+damage+shield effect returns all three", () => {
    const result = calculateEffectDamage(
      EffectType.HEAL_DAMAGE_SHIELD,
      "回復＋ダメージ＋シールド",
      5,
      "Char",
      "enemy",
      false
    )
    expect(result.heal).toBeGreaterThan(0)
    expect(result.shield).toBeGreaterThan(0)
    expect(result.damage).toBe(0) // This specific combo heals + shields
  })

  it("damage is 0 when isVoidKingPhase3 is true", () => {
    const result = calculateEffectDamage(
      EffectType.DAMAGE,
      "敵に5ダメージ",
      5,
      "Char",
      "void-king",
      true
    )
    expect(result.damage).toBe(0)
  })

  it("damage+heal still heals when isVoidKingPhase3 is true", () => {
    const result = calculateEffectDamage(
      EffectType.DAMAGE_HEAL,
      "敵に5ダメージ＋HPを2回復",
      5,
      "Char",
      "void-king",
      true
    )
    expect(result.heal).toBeGreaterThan(0)
    expect(result.damage).toBe(0)
  })

  it("次元階梯パンディクト special effect", () => {
    const result = calculateEffectDamage(
      EffectType.SPECIAL_PANDICT,
      "次元階梯パンディクト",
      5,
      "Char",
      "enemy",
      false
    )
    expect(result.damage).toBe(5)
    expect(result.heal).toBe(3)
  })

  it("次元階梯パンディクト damage absorbed in void king phase 3", () => {
    const result = calculateEffectDamage(
      EffectType.SPECIAL_PANDICT,
      "次元階梯パンディクト",
      5,
      "Char",
      "void-king",
      true
    )
    expect(result.damage).toBe(0)
    expect(result.heal).toBe(3)
  })

  it("returns non-negative damage", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "test", 5, "Char", "enemy", true)
    expect(result.damage).toBeGreaterThanOrEqual(0)
  })

  it("returns non-negative heal", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "test", 5, "Char", "enemy", true)
    expect(result.heal).toBeGreaterThanOrEqual(0)
  })

  it("returns non-negative shield", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "test", 5, "Char", "enemy", true)
    expect(result.shield).toBeGreaterThanOrEqual(0)
  })

  it("log includes card name", () => {
    const result = calculateEffectDamage(
      EffectType.HEAL,
      "HPを5回復",
      5,
      "テストキャラ",
      "enemy",
      false
    )
    expect(result.log).toContain("テストキャラ")
  })

  it("default effect treats unknown as heal", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "未知の効果", 7, "Char", "enemy", false)
    expect(result.heal).toBe(7)
    expect(result.damage).toBe(0)
  })

  it("returns valid EffectResult structure", () => {
    const result = calculateEffectDamage(EffectType.HEAL, "test", 5, "Char", "enemy", false)
    expect(result).toHaveProperty("damage")
    expect(result).toHaveProperty("heal")
    expect(result).toHaveProperty("shield")
    expect(result).toHaveProperty("attackReduction")
    expect(result).toHaveProperty("log")
    expect(typeof result.log).toBe("string")
  })
})

/* ═══════════════════════════════════════════
   7. calculateEnemyDamage — Enemy Damage
   ═══════════════════════════════════════════ */
describe("calculateEnemyDamage", () => {
  const makeEnemy = (phases: Enemy["phases"], attackPower: number): Enemy =>
    ({
      id: "test" as EnemyId,
      name: "Test",
      title: "Test",
      maxHp: 100,
      attackPower,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases,
    }) satisfies Enemy

  it("returns base attack when no phase bonuses", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 0, 0)
    expect(result.damage).toBe(5)
    expect(result.phaseBonus).toBe(0)
  })

  it("applies phase bonus when below threshold", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "!", attackBonus: 3 }], 5)
    const result = calculateEnemyDamage(enemy, 40, 0, 0)
    expect(result.phaseBonus).toBe(3)
    expect(result.damage).toBe(8) // 5 + 3
  })

  it("no phase bonus when above threshold", () => {
    const enemy = makeEnemy([{ triggerHpPercent: 50, message: "!", attackBonus: 3 }], 5)
    const result = calculateEnemyDamage(enemy, 60, 0, 0)
    expect(result.phaseBonus).toBe(0)
    expect(result.damage).toBe(5)
  })

  it("reduces damage by shield buffer", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 3, 0)
    expect(result.damage).toBe(2)
  })

  it("shield can reduce damage to 0", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 10, 0)
    expect(result.damage).toBe(0)
  })

  it("reduces damage by attack reduction", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 0, 3)
    expect(result.damage).toBe(2)
  })

  it("damage never goes below 0", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 0, 100)
    expect(result.damage).toBe(0)
  })

  it("phase bonus is 0 when above all thresholds", () => {
    const enemy = makeEnemy(
      [
        { triggerHpPercent: 50, message: "!", attackBonus: 2 },
        { triggerHpPercent: 25, message: "!", attackBonus: 3 },
      ],
      5
    )
    const result = calculateEnemyDamage(enemy, 80, 0, 0)
    expect(result.phaseBonus).toBe(0)
  })

  it("returns valid EnemyDamageResult structure", () => {
    const enemy = makeEnemy([], 5)
    const result = calculateEnemyDamage(enemy, 100, 0, 0)
    expect(result).toHaveProperty("damage")
    expect(result).toHaveProperty("phaseBonus")
    expect(typeof result.damage).toBe("number")
    expect(typeof result.phaseBonus).toBe("number")
  })

  it("accumulates multiple phase bonuses", () => {
    const enemy = makeEnemy(
      [
        { triggerHpPercent: 66, message: "!", attackBonus: 1 },
        { triggerHpPercent: 33, message: "!", attackBonus: 2 },
      ],
      5
    )
    // At 20% HP: both phases trigger
    const result = calculateEnemyDamage(enemy, 20, 0, 0)
    expect(result.phaseBonus).toBe(3)
    expect(result.damage).toBe(8)
  })
})
