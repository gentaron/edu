/* ═══════════════════════════════════════════════════════════════
   L0 METAL — Workers Public API
   Re-exports from the battle worker client module.
   ═══════════════════════════════════════════════════════════════ */

export { battleWorkerClient, initBattleWorker, terminateBattleWorker } from "./battle-worker-client"

export type {
  DamageResult,
  EnemyTurnResult,
  FieldCharResult,
  PhaseCheckResult,
  SimBattleResult,
  DamageParams,
  EnemyTurnParams,
  PhaseCheckParams,
  SimBattleParams,
} from "./battle-worker-client"

export { WorkerPool } from "./worker-pool"
export type { PoolOptions } from "./worker-pool"

export type {
  BattleWorkerMessage,
  BattleWorkerResponse,
  BattleWorkerMessageType,
  BattleWorkerResponseType,
} from "./battle-worker"
