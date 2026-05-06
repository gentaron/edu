/* ═══════════════════════════════════════════════════════════
   L0 METAL — WebGPU Public API
   Epoch-12 Delta — Liminal Forge Rendering Substrate
   ═══════════════════════════════════════════════════════════ */

// Device management and feature detection
export {
  initGpuDevice,
  getGpuTier,
  isCrossOriginIsolated,
  getGpuDevice,
  getGpuAdapterInfo,
  asGpuDeviceId,
  __resetGpuState,
  __injectGpuResult,
} from "./device";

export type { GpuDeviceId, GpuAdapterInfo, GpuInitResult } from "./device";

export { GpuTier } from "./device";

// Particle compute pipeline
export {
  initParticlePipeline,
  isParticlePipelineReady,
  uploadParticles,
  dispatchParticleIntegration,
  readbackParticles,
  cpuParticleIntegration,
  getParticleCount,
  destroyParticlePipeline,
  __resetParticlePipeline,
} from "./particle-compute";

export type { GpuParticle, ParticleComputeConfig } from "./particle-compute";

// AoE damage falloff compute
export {
  initAoePipeline,
  isAoePipelineReady,
  dispatchAoeFalloff,
  readbackAoeField,
  cpuAoeFalloff,
  destroyAoePipeline,
  __resetAoePipeline,
} from "./aoe-falloff";

export type { AoEFieldParams } from "./aoe-falloff";

export { AoEFalloffType } from "./aoe-falloff";

// Zero-copy ring buffer
export {
  SharedRingBuffer,
  FallbackRingBuffer,
  createRingBuffer,
} from "./ring-buffer";

export type { RingSlotId, RingWriteResult, RingReadResult, RingBufferStats } from "./ring-buffer";
