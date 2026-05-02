/* ═══════════════════════════════════════════
   Metal — Public API
   Re-exports from the WASM engine bridge.
   ═══════════════════════════════════════════ */

export {
  initWasmEngine,
  isWasmReady,
  wasmCalculateDamage,
  wasmExecuteEnemyTurn,
  wasmCheckPhaseTransition,
  wasmSimulateBattle,
  abilityTypeToIndex,
  indexToAbilityType,
  resetWasmEngine,
} from "./wasm-bridge"

export type {
  WasmBattleModule,
  WasmBattleResult,
  WasmEnemyTurnResult,
  WasmFieldChar,
  WasmSimResult,
  CalculateDamageParams,
  ExecuteEnemyTurnParams,
  CheckPhaseTransitionParams,
} from "./wasm-bridge"

export { swManager } from "./service-worker"

export type { SwStatus, SwStatusCallback } from "./service-worker"

export { registerServiceWorker } from "./service-worker-registration"
