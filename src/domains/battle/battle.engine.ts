/**
 * Pure battle logic functions extracted from game-store.ts
 * These functions take inputs and return outputs without depending on Zustand state.
 */

import {
  type GameCard,
  type Enemy,
  type FieldChar,
  type EffectType,
  EffectType as ET,
} from "@/types"

/* ── HP Calculation ── */

/**
 * Calculate max HP for a card based on rarity and defense stat.
 * Base HP varies by rarity: SR=14, R=10, N=8, then defense is added.
 * This produces the effective HP pool used during battle simulation.
 *
 * @param card - The game card whose max HP should be calculated.
 *                The `rarity` and `defense` fields are used.
 * @returns The maximum HP value (base + defense).
 * @example
 * const hp = charMaxHp({ rarity: 'SR', defense: 5, ... })
 * // → 19 (14 + 5)
 */
export function charMaxHp(card: GameCard): number {
  const base = card.rarity === "SR" ? 14 : card.rarity === "R" ? 10 : 8
  return base + card.defense
}

/* ── Log Management ── */

/**
 * Create a new log array with the message appended.
 * Keeps a sliding window of the most recent 30 entries to prevent unbounded growth.
 * Returns a new array — does not mutate the input.
 *
 * @param log - The current log entries array.
 * @param message - The new log message to append.
 * @returns A new string array containing at most the last 30 log entries,
 *          with `message` as the final element.
 */
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
 * Pick a random alive character from the field and apply damage.
 * If the character's HP drops to 0 or below, they are marked as down (戦闘不能).
 * Returns updated fieldChars, the index of the hit character, and log messages.
 * Pure function — does not mutate the input array.
 *
 * @param fieldChars - Array of characters currently on the battle field.
 * @param damage - Amount of damage to apply to the selected character.
 * @param emoji - Emoji prefix for log messages (e.g. '⚔️').
 * @param msgPrefix - Text prefix for the log message before the character name.
 * @returns {HitResult} Updated field characters, index of the hit character (null if none alive),
 *          and any generated log messages in Japanese.
 * @example
 * const result = hitRandomChar(myField, 5, '⚔️', '敵の攻撃！')
 * // → { fieldChars: [...], hitIndex: 2, logMessages: ['⚔️ 敵の攻撃！リンに5ダメージ！'] }
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
 * Calculate phase transition for the given enemy based on current HP percentage.
 * Iterates enemy phases from highest to lowest to determine the active phase.
 * Only transitions forward (never backwards). Returns damage-to-apply for
 * special enemies (e.g. void-reaper applies AoE damage on phase transition).
 *
 * @param enemy - The enemy whose phases are being evaluated.
 * @param hpPercent - Current enemy HP as a percentage (0–100).
 * @param currentPhase - The enemy's current active phase number (1-based).
 * @param fieldCharacters - Characters on the field (used for void-reaper AoE).
 * @returns {PhaseTransitionResult} The new phase number, a transition message (null if no transition),
 *          and any damage entries to apply (empty for non-special enemies).
 */
export function calculatePhaseTransition(
  enemy: Enemy,
  hpPercent: number,
  currentPhase: number,
  fieldCharacters: FieldChar[]
): PhaseTransitionResult {
  let newPhase = 0
  for (let i = enemy.phases.length - 1; i >= 0; i--) {
    if (hpPercent <= enemy.phases[i]!.triggerHpPercent && i >= newPhase) {
      newPhase = i + 1
    }
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
 * Iterates all enemy phases; any phase whose trigger threshold is met
 * and that defines `selfHealPerTurn` contributes healing.
 * The healed HP is clamped to the enemy's `maxHp`.
 *
 * @param enemy - The enemy whose self-heal is being calculated.
 * @param hpPercent - Current enemy HP as a percentage (0–100).
 * @param currentEnemyHp - The enemy's current HP before healing.
 * @returns The enemy's HP after applying all eligible self-heals, capped at maxHp.
 * @example
 * const newHp = calculateEnemySelfHeal(enemy, 50, 20)
 * // → 25 (if phase at 50% HP heals 5 per turn and maxHp > 25)
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
 * Uses O(1) enum switch dispatch instead of string.includes() chains.
 * Pure function — no state mutation.
 *
 * @param effectType - Pre-classified effect type (EffectType enum)
 * @param effect - Original Japanese effect string (used for log messages)
 * @param effectValue - Numeric effect value (≥0)
 * @param cardName - Display name of the card playing this effect
 * @param enemyId - Enemy identifier (used for void-king phase 3 detection)
 * @param isVoidKingPhase3 - Whether void-king is in phase 3+ (absorbs damage)
 * @returns {EffectResult} Damage, heal, shield, attack reduction, and log message
 * @example
 * resolveEffect(ET.DAMAGE, "敵に5ダメージ", 5, "Char", "enemy", false)
 * // → { damage: 5, heal: 0, shield: 0, attackReduction: 0, log: "✨ Charの..." }
 */
export function calculateEffectDamage(
  effectType: EffectType,
  effect: string,
  effectValue: number,
  cardName: string,
  enemyId: string,
  isVoidKingPhase3: boolean
): EffectResult {
  const canDamage = !isVoidKingPhase3
  const val = effectValue
  const eff = effect

  switch (effectType) {
    case ET.HEAL_DAMAGE_SHIELD: {
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
    case ET.DAMAGE_HEAL: {
      const damage = canDamage ? val : 0
      const heal = Math.max(1, Math.floor(val * 0.5))
      const log = canDamage
        ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ＋${cardName}のHP${heal}回復！`
        : `✨ ${cardName}の効果！ ${cardName}のHP${heal}回復！（ダメージは吸収）`
      return { damage, heal, shield: 0, attackReduction: 0, log }
    }
    case ET.DAMAGE_SHIELD: {
      const damage = canDamage ? val : 0
      const shield = Math.max(1, Math.floor(val * 0.7))
      const log = canDamage
        ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ＋シールド+${shield}！`
        : `✨ ${cardName}の効果！ シールド+${shield}！（ダメージは吸収）`
      return { damage, heal: 0, shield, attackReduction: 0, log }
    }
    case ET.HEAL: {
      return {
        damage: 0,
        heal: val,
        shield: 0,
        attackReduction: 0,
        log: `✨ ${cardName}の${eff}！ ${cardName}のHP${val}回復！`,
      }
    }
    case ET.DAMAGE: {
      const damage = canDamage ? val : 0
      const log = canDamage
        ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ！`
        : `✨ ${cardName}の効果…虚無に吸収された！`
      return { damage, heal: 0, shield: 0, attackReduction: 0, log }
    }
    case ET.SHIELD: {
      return {
        damage: 0,
        heal: 0,
        shield: val,
        attackReduction: 0,
        log: `✨ ${cardName}の${eff}！ シールド+${val}！`,
      }
    }
    case ET.ATTACK_REDUCTION: {
      return {
        damage: 0,
        heal: 0,
        shield: 0,
        attackReduction: val,
        log: `✨ ${cardName}の${eff}！ 敵の攻撃力-${val}！`,
      }
    }
    case ET.SPECIAL_PANDICT: {
      const damage = canDamage ? 5 : 0
      const heal = 3
      const log = canDamage
        ? `✨ 次元階梯パンディクト展開！ 敵に5ダメージ＋${cardName}のHP3回復！`
        : `✨ 次元階梯パンディクト展開！ ${cardName}のHP3回復！（ダメージは吸収）`
      return { damage, heal, shield: 0, attackReduction: 0, log }
    }
    case ET.HEAL_DAMAGE: // Same as DAMAGE_HEAL but heal is primary (used by jun card)
    {
      const heal = Math.max(1, Math.floor(val * 0.5))
      const damage = canDamage ? Math.max(1, Math.floor(val * 0.4)) : 0
      const log = canDamage
        ? `✨ ${cardName}の${eff}！ 敵に${damage}ダメージ＋${cardName}のHP${heal}回復！`
        : `✨ ${cardName}の効果！ ${cardName}のHP${heal}回復！（ダメージは吸収）`
      return { damage, heal, shield: 0, attackReduction: 0, log }
    }
    case ET.HEAL_SHIELD: {
      return {
        damage: 0,
        heal: val,
        shield: Math.max(1, Math.floor(val * 0.7)),
        attackReduction: 0,
        log: `✨ ${cardName}の${eff}！ ${cardName}のHP${val}回復＋シールド+${Math.max(1, Math.floor(val * 0.7))}！`,
      }
    }
    default: {
      return exhaustiveCheck(effectType)
    }
  }
}

/** Runtime exhaustive check — should never be reached if all enum values are handled. */
function exhaustiveCheck(_type: never): never {
  throw new Error(`Unhandled EffectType: ${String(_type)}`)
}

/* ── Enemy Damage Calculation ── */

export interface EnemyDamageResult {
  damage: number
  phaseBonus: number
}

/**
 * Calculate the enemy's base attack damage per turn.
 * Accounts for phase-based attack bonuses, player attack reduction debuffs,
 * and shield buffer absorption. Damage is never negative.
 * Pure function — no state mutation.
 *
 * @param enemy - The enemy whose attack damage is being calculated.
 * @param enemyHp - The enemy's current HP (used to compute HP percentage for phase bonuses).
 * @param shieldBuffer - The player's current shield value that absorbs incoming damage.
 * @param enemyAttackReduction - Cumulative attack reduction debuff on the enemy.
 * @returns {EnemyDamageResult} The final damage to apply and the phase bonus component.
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
