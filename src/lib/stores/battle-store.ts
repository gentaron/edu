import { create } from "zustand"
import type { GameCard, Enemy, AbilityType, FieldChar, EffectType } from "@/types"
import { classifyEffect } from "@/types"
import { ALL_CARDS } from "@/domains/cards/cards.data"
import {
  charMaxHp,
  calculateEffectDamage,
  calculateEnemyDamage,
} from "@/domains/battle/battle.engine"

/** Merge old localStorage deck data with latest card data to fill missing fields. */
function migrateCard(card: GameCard): GameCard {
  const latest = ALL_CARDS.find((c) => c.id === card.id)
  if (!latest) {
    return card
  }
  return {
    ...card,
    effectType: card.effectType ?? latest.effectType,
    effectValue: card.effectValue ?? latest.effectValue,
    ultimateName: card.ultimateName ?? latest.ultimateName,
  }
}

/* ═══════════════════════════════════════════════════════
   Field-based Battle Store — Individual Character HP
   ═══════════════════════════════════════════════════════ */

type BattlePhase = "idle" | "playerTurn" | "resolving" | "enemyTurn" | "victory" | "defeat"
export type { BattlePhase }

interface BattleState {
  phase: BattlePhase
  shieldBuffer: number
  selectedEnemy: Enemy | null
  enemyHp: number
  enemyCurrentPhase: number
  turn: number
  fieldCharacters: FieldChar[]
  selectedCharIndex: number | null
  playerAbility: AbilityType | null
  poisonActive: boolean
  enemyAttackReduction: number
  log: string[]
  lastAbilityUsed: AbilityType | null
  lastCharIndex: number | null
  screenShake: boolean
  enemyFlash: boolean
  healFlash: boolean
  shieldFlash: boolean
  charHitIndex: number | null

  startBattle: (enemy: Enemy, deck: GameCard[]) => void
  selectCharacter: (index: number) => void
  playAbility: (ability: AbilityType) => void
  executeEnemyTurn: () => void
  checkPhaseTransition: () => void
  resetBattle: () => void
}

/* ── Timers belong to one battle ──────────────────────────────────────
   Every delayed step (enemy turn, victory, turn hand-back) is scheduled
   through `later()`, tagged with the battle it belongs to. Starting a new
   battle or resetting bumps the epoch and cancels everything pending, so a
   timer from a battle you already left can never act on the next one
   (previously: attack, leave, pick another enemy → the old enemy's turn
   fired inside the new battle, or a new battle flipped straight to victory). */
let battleEpoch = 0
const pending = new Set<ReturnType<typeof setTimeout>>()
function later(fn: () => void, ms: number) {
  const epoch = battleEpoch
  const id = setTimeout(() => {
    pending.delete(id)
    if (epoch === battleEpoch) {
      fn()
    }
  }, ms)
  pending.add(id)
}
function cancelPending() {
  battleEpoch++
  for (const id of pending) {
    clearTimeout(id)
  }
  pending.clear()
}

/** Index of a random alive character, or -1. By position, so duplicate cards can never redirect a hit. */
function randomAliveIndex(fieldChars: FieldChar[]): number {
  const alive: number[] = []
  fieldChars.forEach((fc, i) => {
    if (!fc.isDown) {
      alive.push(i)
    }
  })
  return alive.length === 0 ? -1 : alive[Math.floor(Math.random() * alive.length)]!
}

function addLog(setter: (fn: (s: BattleState) => Partial<BattleState>) => void, msg: string) {
  setter((s) => ({ log: [...s.log.slice(-29), msg] }))
}

/** Pick a random alive character and apply damage. Returns updated fieldChars + hitIndex. */
function hitRandomChar(
  fieldChars: FieldChar[],
  damage: number,
  setter: (fn: (s: BattleState) => Partial<BattleState>) => void,
  emoji: string,
  msgPrefix: string
): { fieldChars: FieldChar[]; hitIndex: number | null } {
  const idx = randomAliveIndex(fieldChars)
  if (idx === -1) {
    return { fieldChars, hitIndex: null }
  }
  const target = fieldChars[idx]!
  const newHp = Math.max(0, target.hp - damage)
  const updated = [...fieldChars]
  updated[idx] = { ...target, hp: newHp, isDown: newHp <= 0 }
  if (newHp <= 0) {
    addLog(
      setter,
      `${emoji} ${msgPrefix}${target.card.name}を撃破！ ${target.card.name}は戦闘不能！`
    )
  } else {
    addLog(setter, `${emoji} ${msgPrefix}${target.card.name}に${damage}ダメージ！`)
  }
  return { fieldChars: updated, hitIndex: idx }
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "idle",
  shieldBuffer: 0,
  selectedEnemy: null,
  enemyHp: 0,
  enemyCurrentPhase: 0,
  turn: 0,
  fieldCharacters: [],
  selectedCharIndex: null,
  playerAbility: null,
  poisonActive: false,
  enemyAttackReduction: 0,
  log: [],
  lastAbilityUsed: null,
  lastCharIndex: null,
  screenShake: false,
  enemyFlash: false,
  healFlash: false,
  shieldFlash: false,
  charHitIndex: null,

  startBattle: (enemy, deck) => {
    cancelPending()
    // Migrate old localStorage cards to fill missing effectType/effectValue
    const migratedDeck = deck.map(migrateCard)
    const field: FieldChar[] = migratedDeck.map((c) => {
      let hp = charMaxHp(c)
      // Frost guardian: reduce each character by 1 HP at start
      if (enemy.id === "frost-guardian") {
        hp = Math.max(1, hp - 1)
      }
      return { card: c, hp, maxHp: charMaxHp(c), isDown: false }
    })
    set({
      phase: "playerTurn",
      shieldBuffer: 0,
      selectedEnemy: enemy,
      enemyHp: enemy.maxHp,
      enemyCurrentPhase: 0,
      turn: 1,
      fieldCharacters: field,
      selectedCharIndex: null,
      playerAbility: null,
      poisonActive: enemy.id === "venom-hydra",
      enemyAttackReduction: 0,
      log: [
        `⚔️ ${enemy.name} との戦闘開始！`,
        `— ${field.length}体の味方がフィールドに出撃！ —`,
        enemy.id === "frost-guardian" ? "❄️ 絶対零度の冷気が味方全体を襲う！全員に1ダメージ！" : "",
      ].filter(Boolean),
      lastAbilityUsed: null,
      lastCharIndex: null,
      screenShake: false,
      enemyFlash: false,
      healFlash: false,
      shieldFlash: false,
      charHitIndex: null,
    })
  },

  selectCharacter: (index) => {
    const s = get()
    if (s.phase !== "playerTurn") {
      return
    }
    const fc = s.fieldCharacters[index]
    if (!fc || fc.isDown) {
      return
    }
    set({ selectedCharIndex: index })
  },

  playAbility: (ability) => {
    const s = get()
    if (s.phase !== "playerTurn") {
      return
    }
    if (s.selectedCharIndex == null) {
      return
    }
    const fc = s.fieldCharacters[s.selectedCharIndex]
    if (!fc || fc.isDown) {
      return
    }
    const card = fc.card
    const enemy = s.selectedEnemy
    if (!enemy) {
      return
    }

    // Working copy of field characters (for healing)
    const newFieldChars = s.fieldCharacters.map((c) => ({ ...c }))
    const selIdx = s.selectedCharIndex

    set({
      phase: "resolving",
      playerAbility: ability,
      lastAbilityUsed: ability,
      lastCharIndex: s.selectedCharIndex,
      screenShake: ability === "必殺",
      enemyFlash: ability === "攻撃" || ability === "必殺",
      healFlash: ability === "効果" && card.effect.includes("回復"),
      shieldFlash: ability === "防御" || (ability === "効果" && card.effect.includes("シールド")),
      charHitIndex: null,
    })

    let newEnemyHp = s.enemyHp
    let newShield = s.shieldBuffer
    let newEnemyAttackReduction = s.enemyAttackReduction
    let logMsg = ""
    const enemyId = enemy.id
    const isVoidKingPhase3 = enemyId === "void-king" && s.enemyCurrentPhase >= 3

    switch (ability) {
      case "攻撃": {
        if (isVoidKingPhase3) {
          logMsg = `🎭 ${card.name}の攻撃…しかし虚無に吸収された！`
        } else {
          newEnemyHp = Math.max(0, newEnemyHp - card.attack)
          logMsg = `⚔️ ${card.name}の攻撃！ 敵に${card.attack}ダメージ！`
        }
        break
      }
      case "防御": {
        if (enemyId === "void-spider" && s.turn % 2 === 0) {
          logMsg = `🚫 深淵の大蜘蛛の干渉で防御が封じられた！`
        } else {
          let defValue = card.defense
          if (enemyId === "iron-golem") {
            defValue = Math.floor(defValue / 2)
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}（半減！）`
          } else {
            logMsg = `🛡️ ${card.name}の防御！ シールド+${defValue}`
          }
          newShield += defValue
          if (enemyId === "flame-spirit") {
            // Self-damage goes to selected character
            const selChar = newFieldChars[selIdx]!
            const newHp = Math.max(0, selChar.hp - 1)
            newFieldChars[selIdx] = { ...selChar, hp: newHp, isDown: newHp <= 0 }
            logMsg += ` 🔥熱で${card.name}に1ダメージ！`
          }
        }
        break
      }
      case "効果": {
        // Fallback for old localStorage data missing effectType/effectValue
        const resolvedEffectType: EffectType = card.effectType ?? classifyEffect(card.effect)
        const resolvedEffectValue: number = card.effectValue ?? 0
        const result = calculateEffectDamage(
          resolvedEffectType,
          card.effect,
          resolvedEffectValue,
          card.name,
          enemyId,
          isVoidKingPhase3
        )
        newEnemyHp = Math.max(0, newEnemyHp - result.damage)
        newShield += result.shield
        newEnemyAttackReduction = Math.min(newEnemyAttackReduction + result.attackReduction, 10)
        logMsg = result.log

        // Apply healing to selected character
        if (result.heal > 0) {
          const selChar = newFieldChars[selIdx]!
          const newHp = Math.min(selChar.maxHp, selChar.hp + result.heal)
          newFieldChars[selIdx] = { ...selChar, hp: newHp, isDown: false }
        }
        break
      }
      case "必殺": {
        let dmg = card.ultimate
        if (isVoidKingPhase3) {
          dmg *= 2
          logMsg = `💥 ${card.ultimateName}！！ 必殺ダメージ2倍で${dmg}ダメージ！！`
        } else {
          logMsg = `💥 ${card.ultimateName}！！ ${dmg}ダメージ！！`
        }
        newEnemyHp = Math.max(0, newEnemyHp - dmg)
        break
      }
    }

    addLog(set, logMsg)

    if (newEnemyHp <= 0) {
      // Show the final blow at once (the bar used to sit at the old HP for 0.8s)
      set({ enemyHp: 0, fieldCharacters: newFieldChars })
      later(() => {
        set((prev) => ({
          phase: "victory",
          enemyHp: 0,
          fieldCharacters: newFieldChars,
          screenShake: false,
          enemyFlash: false,
          healFlash: false,
          shieldFlash: false,
          charHitIndex: null,
          log: [...prev.log, `🏆 ${prev.selectedEnemy!.name} を撃破！`, prev.selectedEnemy!.reward],
        }))
      }, 800)
      return
    }

    set({
      enemyHp: newEnemyHp,
      shieldBuffer: newShield,
      enemyAttackReduction: newEnemyAttackReduction,
      fieldCharacters: newFieldChars,
    })
    get().checkPhaseTransition()

    later(() => {
      set({ screenShake: false, enemyFlash: false, healFlash: false, shieldFlash: false })
      get().executeEnemyTurn()
    }, 1200)
  },

  executeEnemyTurn: () => {
    const s = get()
    if (!s.selectedEnemy) {
      return
    }
    if (s.phase === "victory" || s.phase === "defeat") {
      return
    }

    const enemy = s.selectedEnemy
    const hpPercent = (s.enemyHp / enemy.maxHp) * 100

    set({
      phase: "enemyTurn",
      screenShake: true,
      selectedCharIndex: null,
      playerAbility: null,
      charHitIndex: null,
    })

    // Calculate enemy base damage using pure function
    const { damage: effectiveDamage } = calculateEnemyDamage(
      enemy,
      s.enemyHp,
      s.shieldBuffer,
      s.enemyAttackReduction
    )
    addLog(set, `💥 ${enemy.name}の攻撃！ ${effectiveDamage}ダメージ！`)

    // Main attack → random alive character
    let newFieldChars = [...s.fieldCharacters]
    let hitCharIdx: number | null = null
    if (effectiveDamage > 0) {
      const idx = randomAliveIndex(newFieldChars)
      if (idx !== -1) {
        const target = newFieldChars[idx]!
        {
          const newHp = Math.max(0, target.hp - effectiveDamage)
          newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 }
          hitCharIdx = idx
          if (newHp <= 0) {
            addLog(set, `💀 ${target.card.name}は戦闘不能になった！`)
          } else {
            addLog(set, `💥 ${target.card.name}に${effectiveDamage}ダメージ！`)
          }
        }
      }
    }

    // Poison damage → random alive character
    if (s.poisonActive) {
      const idx = randomAliveIndex(newFieldChars)
      if (idx !== -1) {
        const target = newFieldChars[idx]!
        {
          const newHp = Math.max(0, target.hp - 1)
          newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 }
          hitCharIdx = idx
          if (newHp <= 0) {
            addLog(set, `☠️ 毒により${target.card.name}が戦闘不能！`)
          } else {
            addLog(set, `☠️ 毒により${target.card.name}に1ダメージ！`)
          }
        }
      }
    }

    // Enemy-specific special abilities targeting characters
    function randomCharDamage(
      fieldChars: FieldChar[],
      dmg: number,
      emoji: string,
      msgPrefix: string
    ) {
      const result = hitRandomChar(fieldChars, dmg, set, emoji, msgPrefix)
      if (result.hitIndex != null) {
        hitCharIdx = result.hitIndex
      }
      return result.fieldChars
    }

    const enemyHpPct = (s.enemyHp / enemy.maxHp) * 100
    if (enemy.id === "frost-guardian" && enemyHpPct <= 50 && s.turn % 2 === 0) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "❄️", "絶対零度の冷気が")
    }
    if (enemy.id === "flame-spirit" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🔥", "業火が")
    }
    if (enemy.id === "void-spider" && enemyHpPct <= 40 && s.turn % 2 === 1) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🕸️", "捕縛糸が")
    }
    if (enemy.id === "fallen-angel" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "✝️", "裁きの光が")
    }
    if (enemy.id === "void-reaper" && s.enemyCurrentPhase >= 2) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "🌪️", "時空の刃が")
    }
    if (enemy.id === "void-reaper" && enemyHpPct <= 50) {
      newFieldChars = randomCharDamage(newFieldChars, 2, "🌪️", "虚無の刃が")
    }
    if (enemy.id === "void-king" && s.enemyCurrentPhase >= 1) {
      const alive = newFieldChars.filter((fc) => !fc.isDown)
      const targets = Math.min(alive.length, s.enemyCurrentPhase)
      for (let i = 0; i < targets; i++) {
        const idx = randomAliveIndex(newFieldChars)
        if (idx === -1) {
          break
        }
        const target = newFieldChars[idx]!
        const dmg = 2 + s.enemyCurrentPhase
        const newHp = Math.max(0, target.hp - dmg)
        newFieldChars[idx] = { ...target, hp: newHp, isDown: newHp <= 0 }
        hitCharIdx = idx
        if (newHp <= 0) {
          addLog(
            set,
            `🌀 虚無の波が${target.card.name}を飲み込んだ！ ${target.card.name}は戦闘不能！`
          )
        } else {
          addLog(set, `🌀 虚無の波が${target.card.name}に${dmg}ダメージ！`)
        }
      }
    }
    if (enemy.id === "void-king" && enemyHpPct <= 45) {
      newFieldChars = randomCharDamage(newFieldChars, 3, "🌀", "存在の侵食が")
    }

    // Enemy self-heal
    let newEnemyHp = s.enemyHp
    for (const p of enemy.phases) {
      if (p.selfHealPerTurn && hpPercent <= p.triggerHpPercent) {
        newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + p.selfHealPerTurn)
        addLog(set, `💚 ${enemy.name}が${p.selfHealPerTurn}HP回復！`)
      }
    }

    const newTurn = s.turn + 1

    later(() => {
      set({
        enemyHp: newEnemyHp,
        shieldBuffer: 0,
        enemyAttackReduction: 0,
        fieldCharacters: newFieldChars,
        turn: newTurn,
        screenShake: false,
        charHitIndex: hitCharIdx,
      })

      // Defeat condition: all characters down
      const allDown = newFieldChars.every((fc) => fc.isDown)
      if (allDown) {
        set((prev) => ({
          phase: "defeat",
          log: [...prev.log, `💀 味方が全員戦闘不能になった…`],
        }))
        return
      }

      set({ phase: "playerTurn" })
      addLog(set, `— ターン${newTurn} —`)
    }, 1000)
  },

  checkPhaseTransition: () => {
    const s = get()
    if (!s.selectedEnemy) {
      return
    }
    const hpPercent = (s.enemyHp / s.selectedEnemy.maxHp) * 100
    let newPhase = 0
    for (let i = s.selectedEnemy.phases.length - 1; i >= 0; i--) {
      if (hpPercent <= s.selectedEnemy.phases[i]!.triggerHpPercent && i >= newPhase) {
        newPhase = i + 1
      }
    }
    if (newPhase > s.enemyCurrentPhase) {
      addLog(set, `⚠️ ${s.selectedEnemy.phases[newPhase - 1]!.message}`)
      set({ enemyCurrentPhase: newPhase })
      if (s.selectedEnemy.id === "void-reaper") {
        // Phase transition damage → random character (previously was playerHp)
        const updatedChars = [...get().fieldCharacters]
        const idx = randomAliveIndex(updatedChars)
        if (idx !== -1) {
          const target = updatedChars[idx]!
          const charHp = Math.max(0, target.hp - 4)
          updatedChars[idx] = { ...target, hp: charHp, isDown: charHp <= 0 }
          addLog(set, `🌪️ 次元断絶の衝撃で${target.card.name}に4ダメージ！`)
          if (charHp <= 0) {
            addLog(set, `🌪️ ${target.card.name}は次元断絶に飲み込まれた！`)
          }
          // Additional 3 damage to another character
          const idx2 = randomAliveIndex(updatedChars)
          if (idx2 !== -1) {
            const target2 = updatedChars[idx2]!
            const charHp2 = Math.max(0, target2.hp - 3)
            updatedChars[idx2] = { ...target2, hp: charHp2, isDown: charHp2 <= 0 }
            if (charHp2 <= 0) {
              addLog(
                set,
                `🌪️ 次元断絶が${target2.card.name}を巻き込んだ！ ${target2.card.name}は戦闘不能！`
              )
            } else {
              addLog(set, `🌪️ 次元断絶が${target2.card.name}に3ダメージ！`)
            }
          }
          set({ fieldCharacters: updatedChars })
        }
      }
    }
  },

  resetBattle: () => {
    cancelPending()
    set({
      phase: "idle",
      shieldBuffer: 0,
      selectedEnemy: null,
      enemyHp: 0,
      enemyCurrentPhase: 0,
      turn: 0,
      fieldCharacters: [],
      selectedCharIndex: null,
      playerAbility: null,
      poisonActive: false,
      enemyAttackReduction: 0,
      log: [],
      lastAbilityUsed: null,
      lastCharIndex: null,
      screenShake: false,
      enemyFlash: false,
      healFlash: false,
      shieldFlash: false,
      charHitIndex: null,
    })
  },
}))
