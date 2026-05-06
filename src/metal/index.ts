/* ═══════════════════════════════════════════
   Metal — Public API
   WASM engine bridge + WebGPU compute substrate.
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

// ── WebGPU Compute Substrate (Epoch-12 Delta) ──

export {
  initGpuDevice,
  getGpuTier,
  isCrossOriginIsolated,
  getGpuDevice,
  getGpuAdapterInfo,
  asGpuDeviceId,
} from "./webgpu/device"

export type { GpuDeviceId, GpuAdapterInfo, GpuInitResult } from "./webgpu/device"

export { GpuTier } from "./webgpu/device"

export {
  initParticlePipeline,
  isParticlePipelineReady,
  uploadParticles,
  dispatchParticleIntegration,
  readbackParticles,
  cpuParticleIntegration,
  getParticleCount,
  destroyParticlePipeline,
} from "./webgpu/particle-compute"

export type { GpuParticle, ParticleComputeConfig } from "./webgpu/particle-compute"

export {
  initAoePipeline,
  isAoePipelineReady,
  dispatchAoeFalloff,
  readbackAoeField,
  cpuAoeFalloff,
  destroyAoePipeline,
} from "./webgpu/aoe-falloff"

export type { AoEFieldParams } from "./webgpu/aoe-falloff"

export { AoEFalloffType } from "./webgpu/aoe-falloff"

export {
  SharedRingBuffer,
  FallbackRingBuffer,
  createRingBuffer,
} from "./webgpu/ring-buffer"

export type { RingSlotId, RingWriteResult, RingReadResult, RingBufferStats } from "./webgpu/ring-buffer"
