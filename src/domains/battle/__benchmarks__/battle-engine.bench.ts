import { describe, bench } from "vitest"
import {
  calculateEffectDamage,
  calculateEnemyDamage,
  calculatePhaseTransition,
  charMaxHp,
  appendLog,
} from "@/domains/battle/battle.engine"
import { EffectType } from "@/types"
import type { CardId } from "@/platform/schemas/branded"
import { ENEMIES } from "@/domains/battle/battle.data"

const sampleEnemy = ENEMIES.find((e) => e.id === "void-king") ?? ENEMIES[0]

describe("Battle Engine — pure function benchmarks", () => {
  bench("calculateEffectDamage — ダメージ+回復 pattern", () => {
    for (let i = 0; i < 1000; i++) {
      calculateEffectDamage(EffectType.DAMAGE_HEAL, "ダメージ回復", 8, "テスト", "void-king", false)
    }
  })

  bench("calculateEffectDamage — シールド pattern (void king phase 3)", () => {
    for (let i = 0; i < 1000; i++) {
      calculateEffectDamage(EffectType.SHIELD, "シールド", 10, "テスト", "void-king", true)
    }
  })

  bench("calculateEnemyDamage — 1000 iterations", () => {
    let total = 0
    for (let i = 0; i < 1000; i++) {
      const result = calculateEnemyDamage(sampleEnemy, 50, 0, 0)
      total += result.damage
    }
    void total
  })

  bench("calculatePhaseTransition — across all HP percentages", () => {
    let transitions = 0
    for (let hp = 100; hp >= 0; hp -= 5) {
      const pct = (hp / sampleEnemy.maxHp) * 100
      const result = calculatePhaseTransition(sampleEnemy, pct, 0, [])
      if (result.transitionMessage) {
        transitions++
      }
    }
    void transitions
  })

  bench("charMaxHp — 1000 iterations", () => {
    for (let i = 0; i < 1000; i++) {
      void charMaxHp({
        id: "c1" as CardId,
        name: "Test",
        rarity: "SR" as const,
        defense: 15,
        attack: 10,
        effect: "",
        effectType: EffectType.HEAL,
        effectValue: 0,
        ultimateName: "",
        ultimate: 0,
        imageUrl: "",
        flavorText: "",
        affiliation: "",
      })
    }
  })

  bench("appendLog — 30 entries (simulates full battle log)", () => {
    let log: string[] = []
    for (let i = 0; i < 30; i++) {
      log = appendLog(log, `ターン${i}: アクション実行結果メッセージ`)
    }
    void log.length
  })
})
