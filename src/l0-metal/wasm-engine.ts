/* ═══════════════════════════════════════════
   L0 METAL — WASM Battle Engine Bridge
   Hardware-closest layer. Loads and wraps the
   Rust/WASM battle engine for use by L1+ layers.
   ═══════════════════════════════════════════ */

import type { FieldChar, Enemy, AbilityType } from "@/l2-datalink"

// ── WASM Module Interface ──
// Matches the exported Rust #[wasm_bindgen] signatures.
// Each function returns a JsValue (serde_wasm_bindgen serialized).

export interface WasmBattleModule {
  calculate_damage_wasm(
    id: string,
    name: string,
    hp: number,
    max_hp: number,
    attack: number,
    defense: number,
    is_down: boolean,
    rarity: string,
    ultimate_name: string,
    ultimate_damage: number,
    effect: string,
    ability_idx: number
  ): WasmBattleResult

  execute_enemy_turn_wasm(
    turn: number,
    enemy_hp: number,
    enemy_max_hp: number,
    enemy_phase: number,
    shield_buffer: number,
    field_json: string,
    enemy_json: string,
    poison_active: boolean,
    enemy_attack_reduction: number
  ): WasmEnemyTurnResult

  check_phase_transition_wasm(
    enemy_hp: number,
    enemy_max_hp: number,
    enemy_phase: number,
    enemy_json: string
  ): string | null

  simulate_battle_wasm(field_json: string, enemy_json: string): WasmSimResult
}

// ── WASM Return Types (mirror Rust structs) ──

/** Mirror of Rust `BattleResult` */
export interface WasmBattleResult {
  readonly damage: number
  readonly heal: number
  readonly shield: number
  readonly attack_reduction: number
  readonly log: string
}

/** Mirror of Rust `EnemyTurnResult` */
export interface WasmEnemyTurnResult {
  readonly updated_field: readonly WasmFieldChar[]
  readonly new_enemy_hp: number
  readonly logs: readonly string[]
}

/** Mirror of Rust `FieldChar` as returned by WASM */
export interface WasmFieldChar {
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

/** Mirror of Rust `SimResult` */
export interface WasmSimResult {
  readonly victory: boolean
  readonly turns: number
  readonly final_enemy_hp: number
  readonly survivors: number
}

// ── WASM Enemy format (differs from L2 Enemy) ──

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
}

// ── Ability Type Mapping ──
// L2 uses Japanese strings; WASM uses u8 indices.

const ABILITY_TYPE_TO_INDEX: Readonly<Record<AbilityType, number>> = {
  攻撃: 0,
  防御: 1,
  効果: 2,
  必殺: 3,
} as const

const INDEX_TO_ABILITY_TYPE: readonly AbilityType[] = ["攻撃", "防御", "効果", "必殺"] as const

/** Map L2 Japanese ability type → WASM u8 index */
export function abilityTypeToIndex(ability: AbilityType): number {
  return ABILITY_TYPE_TO_INDEX[ability]
}

/** Map WASM u8 index → L2 Japanese ability type */
export function indexToAbilityType(idx: number): AbilityType | null {
  return INDEX_TO_ABILITY_TYPE[idx] ?? null
}

// ── Module State ──

let wasmModule: WasmBattleModule | null = null
let initPromise: Promise<WasmBattleModule | null> | null = null

// ── Public API ──

/**
 * Load and initialize the WASM battle engine.
 * Safe to call multiple times; subsequent calls return the same promise.
 * Never throws — returns null if WASM cannot be loaded.
 */
export async function initWasmEngine(): Promise<WasmBattleModule | null> {
  if (wasmModule !== null) return wasmModule
  if (initPromise !== null) return initPromise

  initPromise = (async () => {
    try {
      // Use indirect dynamic import to bypass Vite/Rollup static analysis.
      // The WASM glue module lives in /public and is loaded at runtime,
      // not bundled. The Function constructor prevents the import() from
      // being analyzed as a dependency by the build tool.
      const dynamicImport = new Function("url", "return import(url)") as (
        url: string
      ) => Promise<WasmBattleModule>
      const mod = await dynamicImport("/wasm/edu_battle_engine.js")
      wasmModule = mod
      return mod
    } catch (err) {
      console.warn(
        "[L0 METAL] WASM battle engine could not be loaded.",
        err instanceof Error ? err.message : String(err)
      )
      return null
    }
  })()

  return initPromise
}

/** Check whether the WASM engine has been successfully loaded. */
export function isWasmReady(): boolean {
  return wasmModule !== null
}

// ── Conversion Helpers ──
// L2 FieldChar → flat WASM params for calculate_damage_wasm

function fieldCharToFlatParams(fc: FieldChar): {
  id: string
  name: string
  hp: number
  max_hp: number
  attack: number
  defense: number
  is_down: boolean
  rarity: string
  ultimate_name: string
  ultimate_damage: number
  effect: string
} {
  const card = fc.card
  return {
    id: card.id,
    name: card.name,
    hp: fc.hp,
    max_hp: fc.maxHp,
    attack: card.attack,
    defense: card.defense,
    is_down: fc.isDown,
    rarity: card.rarity,
    ultimate_name: card.ultimateName,
    ultimate_damage: card.ultimate,
    effect: card.effect,
  }
}

// L2 FieldChar[] → WASM FieldChar[] JSON
function fieldCharsToWasmJson(field: readonly FieldChar[]): string {
  return JSON.stringify(
    field.map((fc) => ({
      id: fc.card.id,
      name: fc.card.name,
      hp: fc.hp,
      max_hp: fc.maxHp,
      attack: fc.card.attack,
      defense: fc.card.defense,
      is_down: fc.isDown,
      rarity: fc.card.rarity,
      ultimate_name: fc.card.ultimateName,
      ultimate_damage: fc.card.ultimate,
      effect: fc.card.effect,
    }))
  )
}

// L2 Enemy → WASM Enemy JSON
// Maps L2 field names to WASM snake_case field names
function enemyToWasmJson(enemy: Enemy): string {
  const wasmEnemy: WasmEnemyJson = {
    id: enemy.id,
    name: enemy.name,
    max_hp: enemy.maxHp,
    attack: enemy.attackPower,
    phases: enemy.phases.map((p) => ({
      hp_percent: p.triggerHpPercent,
      message: p.message,
      attack_multiplier: 1 + p.attackBonus / 100,
    })),
  }
  return JSON.stringify(wasmEnemy)
}

// ── Bridge Functions ──

/** Parameters for damage calculation */
export interface CalculateDamageParams {
  readonly character: FieldChar
  readonly ability: AbilityType
}

/**
 * Calculate damage/effect for a player ability via WASM.
 * Returns null if WASM is not available (never throws).
 */
export function wasmCalculateDamage(params: CalculateDamageParams): WasmBattleResult | null {
  if (wasmModule === null) return null

  try {
    const flat = fieldCharToFlatParams(params.character)
    const abilityIdx = abilityTypeToIndex(params.ability)
    return wasmModule.calculate_damage_wasm(
      flat.id,
      flat.name,
      flat.hp,
      flat.max_hp,
      flat.attack,
      flat.defense,
      flat.is_down,
      flat.rarity,
      flat.ultimate_name,
      flat.ultimate_damage,
      flat.effect,
      abilityIdx
    )
  } catch (err) {
    console.warn(
      "[L0 METAL] wasmCalculateDamage failed:",
      err instanceof Error ? err.message : String(err)
    )
    return null
  }
}

/** Parameters for enemy turn execution */
export interface ExecuteEnemyTurnParams {
  readonly turn: number
  readonly enemyHp: number
  readonly enemyMaxHp: number
  readonly enemyPhase: number
  readonly shieldBuffer: number
  readonly field: readonly FieldChar[]
  readonly enemy: Enemy
  readonly poisonActive: boolean
  readonly enemyAttackReduction: number
}

/**
 * Execute enemy turn via WASM.
 * Returns null if WASM is not available (never throws).
 */
export function wasmExecuteEnemyTurn(params: ExecuteEnemyTurnParams): WasmEnemyTurnResult | null {
  if (wasmModule === null) return null

  try {
    const fieldJson = fieldCharsToWasmJson(params.field)
    const enemyJson = enemyToWasmJson(params.enemy)
    return wasmModule.execute_enemy_turn_wasm(
      params.turn,
      params.enemyHp,
      params.enemyMaxHp,
      params.enemyPhase,
      params.shieldBuffer,
      fieldJson,
      enemyJson,
      params.poisonActive,
      params.enemyAttackReduction
    )
  } catch (err) {
    console.warn(
      "[L0 METAL] wasmExecuteEnemyTurn failed:",
      err instanceof Error ? err.message : String(err)
    )
    return null
  }
}

/** Parameters for phase transition check */
export interface CheckPhaseTransitionParams {
  readonly enemyHp: number
  readonly enemyMaxHp: number
  readonly enemyPhase: number
  readonly enemy: Enemy
}

/**
 * Check enemy phase transition via WASM.
 * Returns the transition message string, or null if no transition / WASM unavailable.
 */
export function wasmCheckPhaseTransition(params: CheckPhaseTransitionParams): string | null {
  if (wasmModule === null) return null

  try {
    const enemyJson = enemyToWasmJson(params.enemy)
    return wasmModule.check_phase_transition_wasm(
      params.enemyHp,
      params.enemyMaxHp,
      params.enemyPhase,
      enemyJson
    )
  } catch (err) {
    console.warn(
      "[L0 METAL] wasmCheckPhaseTransition failed:",
      err instanceof Error ? err.message : String(err)
    )
    return null
  }
}

/**
 * Simulate entire battle via WASM (for benchmarking).
 * Returns null if WASM is not available (never throws).
 */
export function wasmSimulateBattle(
  field: readonly FieldChar[],
  enemy: Enemy
): WasmSimResult | null {
  if (wasmModule === null) return null

  try {
    const fieldJson = fieldCharsToWasmJson(field)
    const enemyJson = enemyToWasmJson(enemy)
    return wasmModule.simulate_battle_wasm(fieldJson, enemyJson)
  } catch (err) {
    console.warn(
      "[L0 METAL] wasmSimulateBattle failed:",
      err instanceof Error ? err.message : String(err)
    )
    return null
  }
}

/**
 * Reset the WASM engine state (for testing).
 * Clears the cached module so initWasmEngine() can be called again.
 */
export function resetWasmEngine(): void {
  wasmModule = null
  initPromise = null
}

/**
 * Inject a WASM module directly (for testing only).
 * Bypasses the dynamic import, allowing unit tests to provide mock modules.
 */
export function __injectWasmModuleForTesting(mod: WasmBattleModule): void {
  wasmModule = mod
  initPromise = Promise.resolve(mod)
}
