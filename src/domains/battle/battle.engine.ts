/**
 * Pure battle logic functions extracted from game-store.ts
 * These functions take inputs and return outputs without depending on Zustand state.
 */

import { type GameCard, type Enemy, type AbilityType, type FieldChar } from "@/types"

/* ── HP Calculation ── */

/** Calculate max HP for a card based on rarity and defense */
export function charMaxHp(card: GameCard): number {
  const base = card.rarity === "SR" ? 14 : (card.rarity === "R" ? 10 : 8)
  return base + card.defense
}

/* ── Log Management ── */

/** Create a new log array with the message appended (keeps last 30 entries) */
export function appendLog(log: string[], message: string): string[] {
  return [...log.slice(-29), message]
}

/* ── Random Character Hit ── */

export interface HitResult {
  fieldChars: FieldChar[]
  hitIndex: number | null
  logMessages: string[]
}

/**
 * Pick a random alive character and apply damage.
 * Returns updated fieldChars, hitIndex, and any log messages.
 */
export function hitRandomChar(
  fieldChars: FieldChar[],
  damage: number,
  emoji: string,
  msgPrefix: string
): HitResult {
  const alive = fieldChars.filter((fc) => !fc.isDown)
  if (alive.length === 0) {
    return { fieldChars, hitIndex: null, logMessages: [] }
  }

  const target = alive[Math.floor(Math.random() * alive.length)]!
  const idx = fieldChars.findIndex((fc) => fc.card.id === target.card.id)
  const newHp = Math.max(0, target.hp - damage)
  const updated = fieldChars.map((fc, i) =>
    i === idx ? { ...target, hp: newHp, isDown: newHp <= 0 } : fc
  )

  const logMessages: string[] = []
  if (newHp <= 0) {
    logMessages.push(
      `${emoji} ${msgPrefix}${target.card.name}を撃破！ ${target.card.name}は戦闘不能！`
    )
  } else {
    logMessages.push(`${emoji} ${msgPrefix}${target.card.name}に${damage}ダメージ！`)
  }

  return { fieldChars: updated, hitIndex: idx, logMessages }
}

/* ── Phase Transition Calculation ── */

export interface PhaseTransitionResult {
  newPhase: number
  transitionMessage: string | null
  damageToApply: { charName: string; damage: number; charIdx: number; isDown: boolean }[]
}

/**
 * Calculate phase transition for the given enemy HP percentage.
 * Returns the new phase number, transition message, and any damage to apply.
 */
export function calculatePhaseTransition(
  enemy: Enemy,
  hpPercent: number,
  currentPhase: number,
  fieldCharacters: FieldChar[]
): PhaseTransitionResult {
  let newPhase = 0
  for (let i = enemy.phases.length - 1; i >= 0; i--) {
    if (hpPercent <= enemy.phases[i]!.triggerHpPercent && i >= newPhase) {newPhase = i + 1}
  }

  if (newPhase <= currentPhase) {
    return { newPhase: currentPhase, transitionMessage: null, damageToApply: [] }
  }

  const phaseData = enemy.phases[newPhase - 1]!
  const damageToApply: { charName: string; damage: number; charIdx: number; isDown: boolean }[] = []

  // Special handling for void-reaper phase transition damage
  if (enemy.id === "void-reaper") {
    const aliveChars = fieldCharacters
      .map((fc, idx) => ({ fc, idx }))
      .filter(({ fc }) => !fc.isDown)

    if (aliveChars.length > 0) {
      const target1 = aliveChars[Math.floor(Math.random() * aliveChars.length)]!
      const hp1 = Math.max(0, target1.fc.hp - 4)
      damageToApply.push({
        charName: target1.fc.card.name,
        damage: 4,
        charIdx: target1.idx,
        isDown: hp1 <= 0,
      })

      const remainingAlive = fieldCharacters
        .map((fc, idx) => ({ fc, idx }))
        .filter(({ fc, idx }) => !fc.isDown && !(hp1 <= 0 && idx === target1.idx))

      if (remainingAlive.length > 0) {
        const target2 = remainingAlive[Math.floor(Math.random() * remainingAlive.length)]!
        const hp2 = Math.max(0, target2.fc.hp - 3)
        damageToApply.push({
          charName: target2.fc.card.name,
          damage: 3,
          charIdx: target2.idx,
          isDown: hp2 <= 0,
        })
      }
    }
  }

  return {
    newPhase,
    transitionMessage: phaseData.message,
    damageToApply,
  }
}

/* ── Enemy Self-Heal Calculation ── */

/**
 * Calculate enemy self-heal for the current turn based on phase triggers.
 */
export function calculateEnemySelfHeal(
  enemy: Enemy,
  hpPercent: number,
  currentEnemyHp: number
): number {
  let healedHp = currentEnemyHp
  for (const p of enemy.phases) {
    if (p.selfHealPerTurn && hpPercent <= p.triggerHpPercent) {
      healedHp = Math.min(enemy.maxHp, healedHp + p.selfHealPerTurn)
    }
  }
  return healedHp
}

/* ── Effect Damage Calculation ── */

export interface EffectResult {
  damage: number
  heal: number
  shield: number
  attackReduction: number
  log: string
}

/**
 * Calculate the result of playing an "効果" (Effect) ability.
 * Pure function — no state mutation.
 */
export function calculateEffectDamage(
  effect: string,
  effectValue: number,
  cardName: string,
  enemyId: string,
  isVoidKingPhase3: boolean
): EffectResult {
  const canDamage = !isVoidKingPhase3
  const eff = effect
  const val = effectValue

  if (eff.includes("回復") && eff.includes("ダメージ") && eff.includes("シールド")) {
    const heal = val
    const shield = Math.max(1, Math.floor(val * 0.7))
    return {
      damage: 0,
      heal,
      shield,
      attackReduction: 0,
      log: `✨ ${cardName}の${eff}！ ${cardName}のHP${heal}回復＋シールド+${shield}`,
    }
  }

  if (eff.includes("ダメージ") && eff.includes("回復")) {
    const damage = canDamage ? val : 0
    const heal = Math.max(1, Math.floor(val * 0.5))
    const log = canDamage
      ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ＋${cardName}のHP${heal}回復！`
      : `✨ ${cardName}の効果！ ${cardName}のHP${heal}回復！（ダメージは吸収）`
    return { damage, heal, shield: 0, attackReduction: 0, log }
  }

  if (eff.includes("ダメージ") && eff.includes("シールド")) {
    const damage = canDamage ? val : 0
    const shield = Math.max(1, Math.floor(val * 0.7))
    const log = canDamage
      ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ＋シールド+${shield}！`
      : `✨ ${cardName}の効果！ シールド+${shield}！（ダメージは吸収）`
    return { damage, heal: 0, shield, attackReduction: 0, log }
  }

  if (eff.includes("回復")) {
    return {
      damage: 0,
      heal: val,
      shield: 0,
      attackReduction: 0,
      log: `✨ ${cardName}の${eff}！ ${cardName}のHP${val}回復！`,
    }
  }

  if (eff.includes("ダメージ")) {
    const damage = canDamage ? val : 0
    const log = canDamage
      ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ！`
      : `✨ ${cardName}の効果…虚無に吸収された！`
    return { damage, heal: 0, shield: 0, attackReduction: 0, log }
  }

  if (eff.includes("シールド")) {
    return {
      damage: 0,
      heal: 0,
      shield: val,
      attackReduction: 0,
      log: `✨ ${cardName}の${eff}！ シールド+${val}！`,
    }
  }

  if (eff.includes("低下")) {
    return {
      damage: 0,
      heal: 0,
      shield: 0,
      attackReduction: val,
      log: `✨ ${cardName}の${eff}！ 敵の攻撃力-${val}！`,
    }
  }

  if (eff.includes("次元階梯パンディクト")) {
    const damage = canDamage ? 5 : 0
    const heal = 3
    const log = canDamage
      ? `✨ 次元階梯パンディクト展開！ 敵に5ダメージ＋${cardName}のHP3回復！`
      : `✨ 次元階梯パンディクト展開！ ${cardName}のHP3回復！（ダメージは吸収）`
    return { damage, heal, shield: 0, attackReduction: 0, log }
  }

  // Default: treat as heal
  return {
    damage: 0,
    heal: val,
    shield: 0,
    attackReduction: 0,
    log: `✨ ${cardName}の${eff}！ ${cardName}のHP${val}回復！`,
  }
}

/* ── Enemy Damage Calculation ── */

export interface EnemyDamageResult {
  damage: number
  phaseBonus: number
}

/**
 * Calculate the enemy's base attack damage per turn.
 * Pure function — no state mutation.
 */
export function calculateEnemyDamage(
  enemy: Enemy,
  enemyHp: number,
  shieldBuffer: number,
  enemyAttackReduction: number
): EnemyDamageResult {
  const hpPercent = (enemyHp / enemy.maxHp) * 100
  let phaseBonus = 0
  for (const p of enemy.phases) {
    if (hpPercent <= p.triggerHpPercent) {
      phaseBonus += p.attackBonus
    }
  }
  const baseAttack = Math.max(0, enemy.attackPower + phaseBonus - enemyAttackReduction)
  const damage = Math.max(0, baseAttack - shieldBuffer)
  return { damage, phaseBonus }
}
