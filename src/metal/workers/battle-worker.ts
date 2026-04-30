/* ═══════════════════════════════════════════════════════════════
   L0 METAL — Battle Web Worker
   Runs battle AI and damage calculations in a separate thread.
   Pure TypeScript fallback — mirrors the WASM engine logic
   so it works even without WASM support.
   ═══════════════════════════════════════════════════════════════ */

// ── Worker Message Types (shared with main thread) ──

/** Message types sent TO the worker */
export type BattleWorkerMessageType =
  | "CALCULATE_DAMAGE"
  | "EXECUTE_ENEMY_TURN"
  | "SIMULATE_BATTLE"
  | "CHECK_PHASE"

/** Message types sent FROM the worker */
export type BattleWorkerResponseType = "RESULT" | "ERROR"

export interface BattleWorkerMessage {
  type: BattleWorkerMessageType
  id: string
  payload: Record<string, unknown>
}

export interface BattleWorkerResponse {
  type: BattleWorkerResponseType
  id: string
  payload: Record<string, unknown>
}

// ── Inline Types (self-contained, no path alias imports) ──

type AbilityType = "攻撃" | "防御" | "効果" | "必殺"

interface WasmFieldChar {
  readonly id: string
  readonly name: string
  readonly hp: number
  readonly max_hp: number
  readonly attack: number
  readonly defense: number
  readonly is_down: boolean
  readonly rarity: string
  readonly ultimate_name: string
  readonly ultimate_damage: number
  readonly effect: string
}

interface WasmEnemyJson {
  readonly id: string
  readonly name: string
  readonly max_hp: number
  readonly attack: number
  readonly phases: readonly WasmPhaseThreshold[]
}

interface WasmPhaseThreshold {
  readonly hp_percent: number
  readonly message: string
  readonly attack_multiplier: number
  readonly self_heal_per_turn?: number
}

// ── Ability index mapping (mirrors wasm-engine.ts) ──

const INDEX_TO_ABILITY_TYPE: readonly AbilityType[] = ["攻撃", "防御", "効果", "必殺"] as const

// ── Pure Battle Calculator ──

function calculateDamage(
  fieldChar: WasmFieldChar,
  abilityIdx: number
): {
  damage: number
  heal: number
  shield: number
  attack_reduction: number
  log: string
} {
  const ability = INDEX_TO_ABILITY_TYPE[abilityIdx]
  if (ability === undefined) {
    return {
      damage: 0,
      heal: 0,
      shield: 0,
      attack_reduction: 0,
      log: `Unknown ability index: ${abilityIdx}`,
    }
  }

  switch (ability) {
    case "攻撃":
      return {
        damage: fieldChar.attack,
        heal: 0,
        shield: 0,
        attack_reduction: 0,
        log: `⚔️ ${fieldChar.name}の攻撃！ 敵に${fieldChar.attack}ダメージ！`,
      }
    case "防御":
      return {
        damage: 0,
        heal: 0,
        shield: fieldChar.defense,
        attack_reduction: 0,
        log: `🛡️ ${fieldChar.name}の防御！ シールド+${fieldChar.defense}`,
      }
    case "必殺":
      return {
        damage: fieldChar.ultimate_damage,
        heal: 0,
        shield: 0,
        attack_reduction: 0,
        log: `💥 ${fieldChar.ultimate_name}！！ ${fieldChar.ultimate_damage}ダメージ！！`,
      }
    case "効果":
      return calculateEffectDamage(fieldChar)
  }
}

function calculateEffectDamage(fieldChar: WasmFieldChar): {
  damage: number
  heal: number
  shield: number
  attack_reduction: number
  log: string
} {
  const eff = fieldChar.effect
  const val = fieldChar.attack // approximate effect value from attack

  if (eff.includes("回復") && eff.includes("シールド")) {
    const heal = val
    const shield = Math.max(1, Math.floor(val * 0.7))
    return {
      damage: 0,
      heal,
      shield,
      attack_reduction: 0,
      log: `✨ ${fieldChar.name}の${eff}！ HP${heal}回復＋シールド+${shield}`,
    }
  }
  if (eff.includes("ダメージ") && eff.includes("回復")) {
    const damage = val
    const heal = Math.max(1, Math.floor(val * 0.5))
    return {
      damage,
      heal,
      shield: 0,
      attack_reduction: 0,
      log: `✨ ${fieldChar.name}の${eff}！ 敵に${damage}ダメージ＋HP${heal}回復！`,
    }
  }
  if (eff.includes("ダメージ")) {
    return {
      damage: val,
      heal: 0,
      shield: 0,
      attack_reduction: 0,
      log: `✨ ${fieldChar.name}の${eff}！ 敵に${val}ダメージ！`,
    }
  }
  if (eff.includes("回復")) {
    return {
      damage: 0,
      heal: val,
      shield: 0,
      attack_reduction: 0,
      log: `✨ ${fieldChar.name}の${eff}！ HP${val}回復！`,
    }
  }
  if (eff.includes("シールド")) {
    return {
      damage: 0,
      heal: 0,
      shield: val,
      attack_reduction: 0,
      log: `✨ ${fieldChar.name}の${eff}！ シールド+${val}！`,
    }
  }
  if (eff.includes("低下")) {
    return {
      damage: 0,
      heal: 0,
      shield: 0,
      attack_reduction: val,
      log: `✨ ${fieldChar.name}の${eff}！ 敵の攻撃力-${val}！`,
    }
  }
  return {
    damage: 0,
    heal: val,
    shield: 0,
    attack_reduction: 0,
    log: `✨ ${fieldChar.name}の${eff}！ HP${val}回復！`,
  }
}

function executeEnemyTurn(params: {
  turn: number
  enemy_hp: number
  enemy_max_hp: number
  enemy_phase: number
  shield_buffer: number
  field_json: string
  enemy_json: string
  poison_active: boolean
  enemy_attack_reduction: number
}): {
  updated_field: WasmFieldChar[]
  new_enemy_hp: number
  logs: string[]
} {
  const field = JSON.parse(params.field_json) as WasmFieldChar[]
  const enemy = JSON.parse(params.enemy_json) as WasmEnemyJson
  const logs: string[] = []

  const hpPercent = (params.enemy_hp / params.enemy_max_hp) * 100

  // Calculate phase bonus
  let phaseBonus = 0
  for (const phase of enemy.phases) {
    if (hpPercent <= phase.hp_percent) {
      phaseBonus += Math.round((phase.attack_multiplier - 1) * 100)
    }
  }

  const baseAttack = Math.max(0, enemy.attack + phaseBonus - params.enemy_attack_reduction)
  const damage = Math.max(0, baseAttack - params.shield_buffer)

  logs.push(`💥 ${enemy.name}の攻撃！ ${damage}ダメージ！`)

  // Deep copy field to mutate
  const updatedField: WasmFieldChar[] = field.map((fc) => ({ ...fc }))

  // Apply main attack to random alive character
  if (damage > 0) {
    const alive = updatedField.filter((fc) => !fc.is_down)
    if (alive.length > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)]!
      const idx = updatedField.findIndex((fc) => fc.id === target.id)
      if (idx !== -1) {
        const newHp = Math.max(0, target.hp - damage)
        updatedField[idx] = { ...target, hp: newHp, is_down: newHp <= 0 }
        if (newHp <= 0) {
          logs.push(`💀 ${target.name}は戦闘不能になった！`)
        } else {
          logs.push(`💥 ${target.name}に${damage}ダメージ！`)
        }
      }
    }
  }

  // Poison damage
  if (params.poison_active) {
    const alive = updatedField.filter((fc) => !fc.is_down)
    if (alive.length > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)]!
      const idx = updatedField.findIndex((fc) => fc.id === target.id)
      if (idx !== -1) {
        const newHp = Math.max(0, target.hp - 1)
        updatedField[idx] = { ...target, hp: newHp, is_down: newHp <= 0 }
        if (newHp <= 0) {
          logs.push(`☠️ 毒により${target.name}が戦闘不能！`)
        } else {
          logs.push(`☠️ 毒により${target.name}に1ダメージ！`)
        }
      }
    }
  }

  // Enemy self-heal
  let newEnemyHp = params.enemy_hp
  for (const phase of enemy.phases) {
    if (phase.self_heal_per_turn && hpPercent <= phase.hp_percent) {
      newEnemyHp = Math.min(params.enemy_max_hp, newEnemyHp + phase.self_heal_per_turn)
      logs.push(`💚 ${enemy.name}が${phase.self_heal_per_turn}HP回復！`)
    }
  }

  return {
    updated_field: updatedField,
    new_enemy_hp: newEnemyHp,
    logs,
  }
}

function checkPhaseTransition(params: {
  enemy_hp: number
  enemy_max_hp: number
  enemy_phase: number
  enemy_json: string
}): string | null {
  const enemy = JSON.parse(params.enemy_json) as WasmEnemyJson
  const hpPercent = (params.enemy_hp / params.enemy_max_hp) * 100

  let newPhase = 0
  for (let i = enemy.phases.length - 1; i >= 0; i--) {
    if (hpPercent <= enemy.phases[i]!.hp_percent) {
      if (i >= newPhase) newPhase = i + 1
    }
  }

  if (newPhase <= params.enemy_phase) {
    return null
  }

  return enemy.phases[newPhase - 1]!.message
}

function simulateBattle(params: { field_json: string; enemy_json: string }): {
  victory: boolean
  turns: number
  final_enemy_hp: number
  survivors: number
} {
  const field = JSON.parse(params.field_json) as WasmFieldChar[]
  const enemy = JSON.parse(params.enemy_json) as WasmEnemyJson

  let enemyHp = enemy.max_hp
  const fieldChars = field.map((fc) => ({ ...fc }))
  let turns = 0
  const maxTurns = 100

  for (turns = 1; turns <= maxTurns; turns++) {
    // Player turn: all alive characters attack
    for (const fc of fieldChars) {
      if (fc.is_down || enemyHp <= 0) continue
      const result = calculateDamage(fc, 0) // attack
      enemyHp = Math.max(0, enemyHp - result.damage)
    }

    if (enemyHp <= 0) {
      const survivors = fieldChars.filter((fc) => !fc.is_down).length
      return { victory: true, turns, final_enemy_hp: 0, survivors }
    }

    // Enemy turn: attack random alive character
    const alive = fieldChars.filter((fc) => !fc.is_down)
    if (alive.length === 0) break

    const hpPercent = (enemyHp / enemy.max_hp) * 100
    let phaseBonus = 0
    for (const phase of enemy.phases) {
      if (hpPercent <= phase.hp_percent) {
        phaseBonus += Math.round((phase.attack_multiplier - 1) * 100)
      }
    }

    const enemyDamage = Math.max(0, enemy.attack + phaseBonus)
    const target = alive[Math.floor(Math.random() * alive.length)]!
    const idx = fieldChars.findIndex((fc) => fc.id === target.id)
    if (idx !== -1) {
      const newHp = Math.max(0, target.hp - enemyDamage)
      fieldChars[idx] = { ...target, hp: newHp, is_down: newHp <= 0 }
    }
  }

  const survivors = fieldChars.filter((fc) => !fc.is_down).length
  return { victory: false, turns, final_enemy_hp: enemyHp, survivors }
}

// ── Message Handler ──

self.onmessage = (event: MessageEvent<BattleWorkerMessage>) => {
  const { type, id, payload } = event.data

  try {
    let result: Record<string, unknown>

    switch (type) {
      case "CALCULATE_DAMAGE": {
        const fieldChar = payload as unknown as WasmFieldChar
        const abilityIdx = payload.ability_idx as number
        const damageResult = calculateDamage(fieldChar, abilityIdx)
        result = {
          damage: damageResult.damage,
          heal: damageResult.heal,
          shield: damageResult.shield,
          attack_reduction: damageResult.attack_reduction,
          log: damageResult.log,
        }
        break
      }

      case "EXECUTE_ENEMY_TURN": {
        const turnResult = executeEnemyTurn({
          turn: payload.turn as number,
          enemy_hp: payload.enemy_hp as number,
          enemy_max_hp: payload.enemy_max_hp as number,
          enemy_phase: payload.enemy_phase as number,
          shield_buffer: payload.shield_buffer as number,
          field_json: payload.field_json as string,
          enemy_json: payload.enemy_json as string,
          poison_active: payload.poison_active as boolean,
          enemy_attack_reduction: payload.enemy_attack_reduction as number,
        })
        result = {
          updated_field: turnResult.updated_field,
          new_enemy_hp: turnResult.new_enemy_hp,
          logs: turnResult.logs,
        }
        break
      }

      case "CHECK_PHASE": {
        const message = checkPhaseTransition({
          enemy_hp: payload.enemy_hp as number,
          enemy_max_hp: payload.enemy_max_hp as number,
          enemy_phase: payload.enemy_phase as number,
          enemy_json: payload.enemy_json as string,
        })
        result = { transition_message: message }
        break
      }

      case "SIMULATE_BATTLE": {
        const simResult = simulateBattle({
          field_json: payload.field_json as string,
          enemy_json: payload.enemy_json as string,
        })
        result = {
          victory: simResult.victory,
          turns: simResult.turns,
          final_enemy_hp: simResult.final_enemy_hp,
          survivors: simResult.survivors,
        }
        break
      }

      default: {
        const response: BattleWorkerResponse = {
          type: "ERROR",
          id,
          payload: { error: `Unknown message type: ${type as string}` },
        }
        self.postMessage(response)
        return
      }
    }

    const response: BattleWorkerResponse = { type: "RESULT", id, payload: result }
    self.postMessage(response)
  } catch (err) {
    const response: BattleWorkerResponse = {
      type: "ERROR",
      id,
      payload: {
        error: err instanceof Error ? err.message : String(err),
      },
    }
    self.postMessage(response)
  }
}
