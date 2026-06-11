import { describe, it, expect } from "vitest"
import fc from "fast-check"
import {
  charMaxHp,
  appendLog,
  hitRandomChar,
  calculatePhaseTransition,
  calculateEnemySelfHeal,
  calculateEffectDamage,
  calculateEnemyDamage,
} from "@/domains/battle/battle.engine"
import { EffectType, classifyEffect } from "@/types"
import type { GameCard, Enemy, FieldChar } from "@/types"
import type { CardId, EnemyId } from "@/platform/schemas/branded"

/* ═══════════════════════════════════════════
   Property-Based Tests — Battle Engine
   ═══════════════════════════════════════════ */

describe("PBT: battle.engine", () => {
  /* ── charMaxHp always positive ── */
  it("charMaxHp always returns positive HP for any valid card", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("SR" as const, "R" as const, "C" as const),
        fc.integer({ min: 0, max: 6 }),
        (rarity, defense) => {
          const card: GameCard = {
            id: "pbt-card" as CardId,
            name: "PBT",
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
          }
          const hp = charMaxHp(card)
          expect(hp).toBeGreaterThan(0)
          expect(Number.isFinite(hp)).toBe(true)
          expect(Number.isInteger(hp)).toBe(true)
        }
      )
    )
  })

  /* ── SR > R > C ordering ── */
  it("SR cards always have higher base HP than R and C (same defense)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10 }), (defense) => {
        const srCard: GameCard = {
          id: "a" as CardId,
          name: "A",
          imageUrl: "",
          flavorText: "",
          rarity: "SR",
          affiliation: "t",
          attack: 5,
          defense,
          effect: "t",
          effectType: EffectType.HEAL,
          effectValue: 3,
          ultimate: 10,
          ultimateName: "t",
        }
        const rCard: GameCard = {
          id: "b" as CardId,
          name: "B",
          imageUrl: "",
          flavorText: "",
          rarity: "R",
          affiliation: "t",
          attack: 5,
          defense,
          effect: "t",
          effectType: EffectType.HEAL,
          effectValue: 3,
          ultimate: 10,
          ultimateName: "t",
        }
        const cCard: GameCard = {
          id: "c" as CardId,
          name: "C",
          imageUrl: "",
          flavorText: "",
          rarity: "C",
          affiliation: "t",
          attack: 5,
          defense,
          effect: "t",
          effectType: EffectType.HEAL,
          effectValue: 3,
          ultimate: 10,
          ultimateName: "t",
        }
        expect(charMaxHp(srCard)).toBeGreaterThan(charMaxHp(rCard))
        expect(charMaxHp(rCard)).toBeGreaterThan(charMaxHp(cCard))
      })
    )
  })

  /* ── appendLog increases length by 1 ── */
  it("appendLog increases log length by exactly 1", () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.string(), (log, msg) => {
        const originalLen = Math.min(log.length, 30)
        const result = appendLog(log, msg)
        expect(result).toHaveLength(Math.min(originalLen + 1, 30))
      })
    )
  })

  /* ── appendLog last element is new message ── */
  it("appendLog always puts new message at end", () => {
    fc.assert(
      fc.property(fc.array(fc.string(), { minLength: 1 }), fc.string(), (log, msg) => {
        const result = appendLog(log, msg)
        expect(result[result.length - 1]).toBe(msg)
      })
    )
  })

  /* ── hitRandomChar valid index ── */
  it("hitRandomChar returns valid index for any set of alive characters", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 20 }),
        (numAlive, damage) => {
          const fieldChars: FieldChar[] = Array.from({ length: 5 }, (_, i) => ({
            card: {
              id: `c${i}` as CardId,
              name: `Char${i}`,
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
            hp: 20,
            maxHp: 20,
            isDown: i >= numAlive,
          }))
          const result = hitRandomChar(fieldChars, damage, "⚔️", "")
          if (numAlive === 0) {
            expect(result.hitIndex).toBeNull()
          } else {
            expect(result.hitIndex).toBeGreaterThanOrEqual(0)
            expect(result.hitIndex).toBeLessThan(5)
            expect(result.fieldChars[result.hitIndex!]!.hp).toBeLessThan(20)
          }
        }
      )
    )
  })

  /* ── calculateEffectDamage non-negative ── */
  it("calculateEffectDamage always returns non-negative values", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.integer({ min: 0, max: 20 }),
        fc.boolean(),
        (effect, value, voidKing) => {
          const result = calculateEffectDamage(
            classifyEffect(effect),
            effect,
            value,
            "TestCard",
            "test",
            voidKing
          )
          expect(result.damage).toBeGreaterThanOrEqual(0)
          expect(result.heal).toBeGreaterThanOrEqual(0)
          expect(result.shield).toBeGreaterThanOrEqual(0)
          expect(result.attackReduction).toBeGreaterThanOrEqual(0)
        }
      )
    )
  })

  /* ── all EffectType values produce non-negative results ── */
  it("all EffectType values produce non-negative results", () => {
    const allTypes: readonly EffectType[] = [
      "HEAL",
      "DAMAGE",
      "SHIELD",
      "HEAL_DAMAGE",
      "DAMAGE_HEAL",
      "DAMAGE_SHIELD",
      "HEAL_SHIELD",
      "HEAL_DAMAGE_SHIELD",
      "ATTACK_REDUCTION",
      "SPECIAL_PANDICT",
    ]
    for (const et of allTypes) {
      const result = calculateEffectDamage(et, "テスト効果", 10, "テストカード", "void-king", false)
      expect(result.damage).toBeGreaterThanOrEqual(0)
      expect(result.heal).toBeGreaterThanOrEqual(0)
      expect(result.shield).toBeGreaterThanOrEqual(0)
      expect(result.attackReduction).toBeGreaterThanOrEqual(0)
    }
  })

  /* ── calculateEnemyDamage non-negative ── */
  it("calculateEnemyDamage always returns non-negative damage", () => {
    const enemy: Enemy = {
      id: "pbt" as EnemyId,
      name: "PBT",
      title: "PBT",
      maxHp: 100,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases: [{ triggerHpPercent: 50, message: "!", attackBonus: 2 }],
    }
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 20 }),
        fc.integer({ min: 0, max: 10 }),
        (hp, shield, reduction) => {
          const result = calculateEnemyDamage(enemy, hp, shield, reduction)
          expect(result.damage).toBeGreaterThanOrEqual(0)
          expect(result.phaseBonus).toBeGreaterThanOrEqual(0)
        }
      )
    )
  })

  /* ── calculateEnemySelfHeal non-negative ── */
  it("calculateEnemySelfHeal always returns non-negative and <= maxHp", () => {
    const enemy: Enemy = {
      id: "pbt" as EnemyId,
      name: "PBT",
      title: "PBT",
      maxHp: 100,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases: [{ triggerHpPercent: 50, message: "!", attackBonus: 1, selfHealPerTurn: 5 }],
    }
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (hpPercent, currentHp) => {
          const result = calculateEnemySelfHeal(enemy, hpPercent, currentHp)
          expect(result).toBeGreaterThanOrEqual(0)
          expect(result).toBeLessThanOrEqual(enemy.maxHp)
        }
      )
    )
  })

  /* ── calculatePhaseTransition valid structure ── */
  it("calculatePhaseTransition always returns valid structure", () => {
    const enemy: Enemy = {
      id: "pbt" as EnemyId,
      name: "PBT",
      title: "PBT",
      maxHp: 100,
      attackPower: 5,
      imageUrl: "",
      description: "test",
      difficulty: "NORMAL",
      reward: "test",
      phases: [{ triggerHpPercent: 50, message: "Phase!", attackBonus: 2 }],
    }
    const fieldChars: FieldChar[] = Array.from({ length: 5 }, (_, i) => ({
      card: {
        id: `c${i}` as CardId,
        name: `C${i}`,
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
    }))
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 3 }),
        (hpPercent, currentPhase) => {
          const result = calculatePhaseTransition(enemy, hpPercent, currentPhase, fieldChars)
          expect(result.newPhase).toBeGreaterThanOrEqual(0)
          expect(
            result.transitionMessage == null || typeof result.transitionMessage === "string"
          ).toBe(true)
          expect(Array.isArray(result.damageToApply)).toBe(true)
        }
      )
    )
  })
})
