/* ═══════════════════════════════════════════════════════════════
   L0 METAL — Battle Worker Client
   Client-side wrapper that provides the same API as the WASM
   bridge but runs computations in Web Workers via the worker pool.
   ═══════════════════════════════════════════════════════════════ */

import { WorkerPool } from "./worker-pool"
import type { BattleWorkerMessage, BattleWorkerResponse } from "./battle-worker"

// ── Worker URL (Next.js compatible) ──

const WORKER_URL = new URL("battle-worker.ts", import.meta.url)

// ── Result Types (mirror WasmBattleResult, WasmEnemyTurnResult, etc.) ──

export interface DamageResult {
  readonly damage: number
  readonly heal: number
  readonly shield: number
  readonly attack_reduction: number
  readonly log: string
}

export interface EnemyTurnResult {
  readonly updated_field: readonly FieldCharResult[]
  readonly new_enemy_hp: number
  readonly logs: readonly string[]
}

export interface FieldCharResult {
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

export interface PhaseCheckResult {
  readonly transition_message: string | null
}

export interface SimBattleResult {
  readonly victory: boolean
  readonly turns: number
  readonly final_enemy_hp: number
  readonly survivors: number
}

// ── Parameter Types ──

export interface DamageParams {
  readonly character: {
    readonly id: string
    readonly name: string
    readonly hp: number
    readonly maxHp: number
    readonly attack: number
    readonly defense: number
    readonly isDown: boolean
    readonly rarity: string
    readonly ultimateName: string
    readonly ultimate: number
    readonly effect: string
  }
  readonly ability: "攻撃" | "防御" | "効果" | "必殺"
}

export interface EnemyTurnParams {
  readonly turn: number
  readonly enemyHp: number
  readonly enemyMaxHp: number
  readonly enemyPhase: number
  readonly shieldBuffer: number
  readonly field: readonly {
    readonly id: string
    readonly name: string
    readonly hp: number
    readonly maxHp: number
    readonly attack: number
    readonly defense: number
    readonly isDown: boolean
    readonly rarity: string
    readonly ultimateName: string
    readonly ultimate: number
    readonly effect: string
  }[]
  readonly enemy: {
    readonly id: string
    readonly name: string
    readonly maxHp: number
    readonly attackPower: number
    readonly phases: readonly {
      readonly triggerHpPercent: number
      readonly message: string
      readonly attackBonus: number
      readonly selfHealPerTurn?: number
    }[]
  }
  readonly poisonActive: boolean
  readonly enemyAttackReduction: number
}

export interface PhaseCheckParams {
  readonly enemyHp: number
  readonly enemyMaxHp: number
  readonly enemyPhase: number
  readonly enemy: {
    readonly id: string
    readonly name: string
    readonly maxHp: number
    readonly attackPower: number
    readonly phases: readonly {
      readonly triggerHpPercent: number
      readonly message: string
      readonly attackBonus: number
      readonly selfHealPerTurn?: number
    }[]
  }
}

export interface SimBattleParams {
  readonly field: readonly {
    readonly id: string
    readonly name: string
    readonly hp: number
    readonly maxHp: number
    readonly attack: number
    readonly defense: number
    readonly isDown: boolean
    readonly rarity: string
    readonly ultimateName: string
    readonly ultimate: number
    readonly effect: string
  }[]
  readonly enemy: {
    readonly id: string
    readonly name: string
    readonly maxHp: number
    readonly attackPower: number
    readonly phases: readonly {
      readonly triggerHpPercent: number
      readonly message: string
      readonly attackBonus: number
      readonly selfHealPerTurn?: number
    }[]
  }
}

// ── Conversion Helpers ──

const ABILITY_TYPE_TO_INDEX: Readonly<Record<string, number>> = {
  攻撃: 0,
  防御: 1,
  効果: 2,
  必殺: 3,
} as const

function fieldCharToWasmFormat(fc: DamageParams["character"] | EnemyTurnParams["field"][number]): {
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
  return {
    id: fc.id,
    name: fc.name,
    hp: fc.hp,
    max_hp: fc.maxHp,
    attack: fc.attack,
    defense: fc.defense,
    is_down: fc.isDown,
    rarity: fc.rarity,
    ultimate_name: fc.ultimateName,
    ultimate_damage: fc.ultimate,
    effect: fc.effect,
  }
}

function enemyToWasmJson(
  enemy: EnemyTurnParams["enemy"] | PhaseCheckParams["enemy"] | SimBattleParams["enemy"]
): string {
  return JSON.stringify({
    id: enemy.id,
    name: enemy.name,
    max_hp: enemy.maxHp,
    attack: enemy.attackPower,
    phases: enemy.phases.map((p) => ({
      hp_percent: p.triggerHpPercent,
      message: p.message,
      attack_multiplier: 1 + p.attackBonus / 100,
      self_heal_per_turn: p.selfHealPerTurn,
    })),
  })
}

// ── ID Generator ──

let correlationId = 0

function generateCorrelationId(): string {
  correlationId += 1
  return `battle-${correlationId}-${Date.now()}`
}

// ── Battle Worker Client ──

class BattleWorkerClient {
  private pool: WorkerPool<BattleWorkerMessage, BattleWorkerResponse>

  constructor(workerCount?: number) {
    this.pool = new WorkerPool<BattleWorkerMessage, BattleWorkerResponse>({
      workerUrl: WORKER_URL,
      workerCount,
    })
  }

  async calculateDamage(params: DamageParams): Promise<DamageResult> {
    const wasmChar = fieldCharToWasmFormat(params.character)
    const abilityIdx = ABILITY_TYPE_TO_INDEX[params.ability] ?? 0

    const message: BattleWorkerMessage = {
      type: "CALCULATE_DAMAGE",
      id: generateCorrelationId(),
      payload: {
        ...wasmChar,
        ability_idx: abilityIdx,
      },
    }

    const response = await this.pool.submit(message)
    if (response.type === "ERROR") {
      throw new Error(String(response.payload.error))
    }

    const p = response.payload
    return {
      damage: p.damage as number,
      heal: p.heal as number,
      shield: p.shield as number,
      attack_reduction: p.attack_reduction as number,
      log: p.log as string,
    }
  }

  async executeEnemyTurn(params: EnemyTurnParams): Promise<EnemyTurnResult> {
    const fieldJson = JSON.stringify(params.field.map(fieldCharToWasmFormat))
    const enemyJson = enemyToWasmJson(params.enemy)

    const message: BattleWorkerMessage = {
      type: "EXECUTE_ENEMY_TURN",
      id: generateCorrelationId(),
      payload: {
        turn: params.turn,
        enemy_hp: params.enemyHp,
        enemy_max_hp: params.enemyMaxHp,
        enemy_phase: params.enemyPhase,
        shield_buffer: params.shieldBuffer,
        field_json: fieldJson,
        enemy_json: enemyJson,
        poison_active: params.poisonActive,
        enemy_attack_reduction: params.enemyAttackReduction,
      },
    }

    const response = await this.pool.submit(message)
    if (response.type === "ERROR") {
      throw new Error(String(response.payload.error))
    }

    const p = response.payload
    return {
      updated_field: p.updated_field as FieldCharResult[],
      new_enemy_hp: p.new_enemy_hp as number,
      logs: p.logs as string[],
    }
  }

  async checkPhaseTransition(params: PhaseCheckParams): Promise<PhaseCheckResult> {
    const enemyJson = enemyToWasmJson(params.enemy)

    const message: BattleWorkerMessage = {
      type: "CHECK_PHASE",
      id: generateCorrelationId(),
      payload: {
        enemy_hp: params.enemyHp,
        enemy_max_hp: params.enemyMaxHp,
        enemy_phase: params.enemyPhase,
        enemy_json: enemyJson,
      },
    }

    const response = await this.pool.submit(message)
    if (response.type === "ERROR") {
      throw new Error(String(response.payload.error))
    }

    const p = response.payload
    return {
      transition_message: p.transition_message as string | null,
    }
  }

  async simulateBattle(params: SimBattleParams): Promise<SimBattleResult> {
    const fieldJson = JSON.stringify(params.field.map(fieldCharToWasmFormat))
    const enemyJson = enemyToWasmJson(params.enemy)

    const message: BattleWorkerMessage = {
      type: "SIMULATE_BATTLE",
      id: generateCorrelationId(),
      payload: {
        field_json: fieldJson,
        enemy_json: enemyJson,
      },
    }

    const response = await this.pool.submit(message)
    if (response.type === "ERROR") {
      throw new Error(String(response.payload.error))
    }

    const p = response.payload
    return {
      victory: p.victory as boolean,
      turns: p.turns as number,
      final_enemy_hp: p.final_enemy_hp as number,
      survivors: p.survivors as number,
    }
  }

  /** Terminate all workers in the pool. */
  terminate(): void {
    this.pool.terminate()
  }

  /** Check if the pool is idle (no pending or active tasks). */
  isIdle(): boolean {
    return this.pool.isIdle()
  }

  /** Get the number of pending tasks in the queue. */
  getPendingCount(): number {
    return this.pool.getPendingCount()
  }

  /** Get the number of active tasks being processed. */
  getActiveCount(): number {
    return this.pool.getActiveCount()
  }

  /** Get the total number of workers in the pool. */
  getWorkerCount(): number {
    return this.pool.getWorkerCount()
  }
}

// ── Singleton ──

export let battleWorkerClient: BattleWorkerClient | null = null

/**
 * Initialize the battle worker client singleton.
 * Safe to call multiple times — returns the existing instance if already initialized.
 */
export function initBattleWorker(workerCount?: number): BattleWorkerClient {
  if (battleWorkerClient != null) {
    return battleWorkerClient
  }
  battleWorkerClient = new BattleWorkerClient(workerCount)
  return battleWorkerClient
}

/**
 * Terminate the battle worker client singleton.
 * Allows re-initialization via initBattleWorker().
 */
export function terminateBattleWorker(): void {
  if (battleWorkerClient != null) {
    battleWorkerClient.terminate()
    battleWorkerClient = null
  }
}
