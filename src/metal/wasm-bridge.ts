/* ═══════════════════════════════════════════
   L0 METAL — WASM Battle Engine Bridge
   Hardware-closest layer. Loads and wraps the
   Rust/WASM battle engine for use by L1+ layers.
   ═══════════════════════════════════════════ */

import type { FieldChar, Enemy, AbilityType } from "@/types"

// ── WASM Module Interface ──

/**
 * Interface for the WASM battle engine module.
 * Matches the exported Rust `#[wasm_bindgen]` function signatures.
 * Each function returns a JsValue (serde_wasm_bindgen serialized).
 */
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

/** Mirror of Rust `BattleResult` — result of a player ability calculation. */
export interface WasmBattleResult {
  readonly damage: number
  readonly heal: number
  readonly shield: number
  readonly attack_reduction: number
  readonly log: string
}

/** Mirror of Rust `EnemyTurnResult` — result of an enemy turn execution. */
export interface WasmEnemyTurnResult {
  readonly updated_field: readonly WasmFieldChar[]
  readonly new_enemy_hp: number
  readonly logs: readonly string[]
}

/** Mirror of Rust `FieldChar` as returned by WASM (snake_case fields). */
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

/** Mirror of Rust `SimResult` — result of a full battle simulation. */
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

/**
 * Map an L2 Japanese ability type string to its WASM u8 index.
 * Used to bridge the TypeScript domain layer (Japanese strings) with the Rust WASM layer (numeric indices).
 *
 * @param ability - The Japanese ability type ('攻撃', '防御', '効果', or '必殺').
 * @returns The corresponding WASM index (0=攻撃, 1=防御, 2=効果, 3=必殺).
 * @example
 * abilityTypeToIndex('必殺') // → 3
 */
export function abilityTypeToIndex(ability: AbilityType): number {
  return ABILITY_TYPE_TO_INDEX[ability]
}

/**
 * Map a WASM u8 index back to its L2 Japanese ability type string.
 * Returns null for invalid indices.
 *
 * @param idx - The WASM ability type index (0–3).
 * @returns The Japanese ability type string, or `null` if the index is out of range.
 * @example
 * indexToAbilityType(2) // → '効果'
 * indexToAbilityType(99) // → null
 */
export function indexToAbilityType(idx: number): AbilityType | null {
  return INDEX_TO_ABILITY_TYPE[idx] ?? null
}

// ── Module State ──

let wasmModule: WasmBattleModule | null = null
let initPromise: Promise<WasmBattleModule | null> | null = null

// ── Public API ──

/**
 * Load and initialize the WASM battle engine from `/wasm/edu_battle_engine.js`.
 * Safe to call multiple times — subsequent calls return the same promise (idempotent).
 * Never throws — returns null if WASM cannot be loaded (graceful degradation).
 * Uses an indirect dynamic import via `Function` constructor to bypass Vite/Rollup
 * static analysis of the WASM glue module.
 *
 * @returns A promise resolving to the loaded {@link WasmBattleModule}, or `null` if loading fails.
 * @example
 * const wasm = await initWasmEngine()
 * if (wasm) { console.log('WASM engine ready') }
 */
export async function initWasmEngine(): Promise<WasmBattleModule | null> {
  if (wasmModule !== null) {return wasmModule}
  if (initPromise !== null) {return initPromise}

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
    } catch (error) {
      console.warn(
        "[L0 METAL] WASM battle engine could not be loaded.",
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  })()

  return initPromise
}

/**
 * Check whether the WASM battle engine has been successfully loaded.
 * Does not trigger loading — only checks if a module is already cached.
 *
 * @returns `true` if the WASM module is available and ready for use.
 */
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
      ultimate_name: fc.ultimateName,
      ultimate_damage: fc.ultimate,
      effect: fc.effect,
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

/** Parameters for the WASM damage calculation bridge function. */
export interface CalculateDamageParams {
  readonly character: FieldChar
  readonly ability: AbilityType
}

/**
 * Calculate damage/effect for a player ability via the WASM battle engine.
 * Returns null if WASM is not available — never throws (graceful degradation).
 *
 * @param params - The character and ability type to calculate damage for.
 * @returns The battle result (damage, heal, shield, etc.), or `null` if WASM is unavailable.
 * @example
 * const result = wasmCalculateDamage({ character: myChar, ability: '必殺' })
 * if (result) { console.log(result.damage) }
 */
export function wasmCalculateDamage(params: CalculateDamageParams): WasmBattleResult | null {
  if (wasmModule === null) {return null}

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
  } catch (error) {
    console.warn(
      "[L0 METAL] wasmCalculateDamage failed:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/** Parameters for the WASM enemy turn execution bridge function. */
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
 * Execute an enemy turn via the WASM battle engine.
 * Returns null if WASM is not available — never throws (graceful degradation).
 *
 * @param params - The current battle state for the enemy turn.
 * @returns The enemy turn result (updated field, new HP, logs), or `null` if WASM is unavailable.
 */
export function wasmExecuteEnemyTurn(params: ExecuteEnemyTurnParams): WasmEnemyTurnResult | null {
  if (wasmModule === null) {return null}

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
  } catch (error) {
    console.warn(
      "[L0 METAL] wasmExecuteEnemyTurn failed:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/** Parameters for the WASM phase transition check bridge function. */
export interface CheckPhaseTransitionParams {
  readonly enemyHp: number
  readonly enemyMaxHp: number
  readonly enemyPhase: number
  readonly enemy: Enemy
}

/**
 * Check enemy phase transition via the WASM battle engine.
 * Returns null if WASM is not available or no transition occurs.
 *
 * @param params - The enemy state to check for phase transitions.
 * @returns The transition message string, or `null` if no transition or WASM unavailable.
 */
export function wasmCheckPhaseTransition(params: CheckPhaseTransitionParams): string | null {
  if (wasmModule === null) {return null}

  try {
    const enemyJson = enemyToWasmJson(params.enemy)
    return wasmModule.check_phase_transition_wasm(
      params.enemyHp,
      params.enemyMaxHp,
      params.enemyPhase,
      enemyJson
    )
  } catch (error) {
    console.warn(
      "[L0 METAL] wasmCheckPhaseTransition failed:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/**
 * Simulate an entire battle via the WASM battle engine (for benchmarking/testing).
 * Returns null if WASM is not available — never throws (graceful degradation).
 *
 * @param field - The initial player field characters.
 * @param enemy - The enemy to battle against.
 * @returns The simulation result (victory, turns, HP, survivors), or `null` if WASM unavailable.
 */
export function wasmSimulateBattle(
  field: readonly FieldChar[],
  enemy: Enemy
): WasmSimResult | null {
  if (wasmModule === null) {return null}

  try {
    const fieldJson = fieldCharsToWasmJson(field)
    const enemyJson = enemyToWasmJson(enemy)
    return wasmModule.simulate_battle_wasm(fieldJson, enemyJson)
  } catch (error) {
    console.warn(
      "[L0 METAL] wasmSimulateBattle failed:",
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/**
 * Reset the WASM engine state (for testing only).
 * Clears the cached module and init promise so {@link initWasmEngine} can be called again.
 */
export function resetWasmEngine(): void {
  wasmModule = null
  initPromise = null
}

/**
 * Inject a WASM module directly for testing purposes.
 * Bypasses the dynamic import mechanism, allowing unit tests to provide mock modules.
 *
 * @param mod - The mock or real WasmBattleModule to inject.
 */
export function __injectWasmModuleForTesting(mod: WasmBattleModule): void {
  wasmModule = mod
  initPromise = Promise.resolve(mod)
}
