/* ═══════════════════════════════════════════════════════════
   L0 METAL — WebGPU AoE Damage Falloff Compute
   Epoch-12 Delta — Dimensional Horizon Force Projection
   ═══════════════════════════════════════════════════════════

   Computes AoE damage falloff fields on GPU.
   Three falloff modes: linear, smoothstep (hermite), exponential.
   Falls back to CPU path when WebGPU is unavailable.
   ═══════════════════════════════════════════════════════════ */

import { getGpuDevice, getGpuTier, GpuTier } from "./device";

// ── Constants ──

/** Maximum grid dimensions for AoE field. */
const MAX_GRID_CELLS = 256 * 256; // 65536 cells

/** Uniform buffer size: 4 x f32 + 2 x u32 + 2 x f32 = 32 bytes. */
const UNIFORM_BUFFER_SIZE = 8 * Float32Array.BYTES_PER_ELEMENT;

/** Workgroup size for AoE compute (16x16 = 256 invocations). */
const WORKGROUP_SIZE_X = 16;
const WORKGROUP_SIZE_Y = 16;

/** WGSL shader source for AoE damage falloff. */
const AOE_SHADER_CODE = `
struct AoEUniforms {
  origin_x  : f32,
  origin_y  : f32,
  radius    : f32,
  max_damage: f32,
  grid_w    : u32,
  grid_h    : u32,
  cell_size : f32,
  falloff   : f32,
};

@group(0) @binding(0) var<storage, read_write> damage_field : array<f32>;
@group(0) @binding(1) var<uniform> params : AoEUniforms;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid : vec3u) {
  let cell_x = gid.x;
  let cell_y = gid.y;
  if (cell_x >= params.grid_w || cell_y >= params.grid_h) {
    return;
  }
  let wx = f32(cell_x) * params.cell_size + params.cell_size * 0.5;
  let wy = f32(cell_y) * params.cell_size + params.cell_size * 0.5;
  let dx = wx - params.origin_x;
  let dy = wy - params.origin_y;
  let dist = sqrt(dx * dx + dy * dy);
  var damage = 0.0;
  if (dist <= params.radius) {
    let t = dist / params.radius;
    if (params.falloff < 0.5) {
      damage = params.max_damage * (1.0 - t);
    } else if (params.falloff < 1.5) {
      let s = t * t * (3.0 - 2.0 * t);
      damage = params.max_damage * (1.0 - s);
    } else {
      damage = params.max_damage * exp(-3.0 * t * t);
    }
  }
  let idx = cell_y * params.grid_w + cell_x;
  damage_field[idx] = damage;
}
`;

// ── Types ──

/** AoE falloff curve type. */
export const enum AoEFalloffType {
  /** Linear damage decrease from center to edge. */
  LINEAR = 0,
  /** Smoothstep (Hermite) interpolation for natural-looking falloff. */
  SMOOTHSTEP = 1,
  /** Exponential decay for sharp center concentration. */
  EXPONENTIAL = 2,
}

/** Parameters for computing an AoE damage field. */
export interface AoEFieldParams {
  /** Origin X in world coordinates. */
  readonly originX: number;
  /** Origin Y in world coordinates. */
  readonly originY: number;
  /** Radius of the AoE effect. */
  readonly radius: number;
  /** Maximum damage at the center. */
  readonly maxDamage: number;
  /** Width of the grid in cells. */
  readonly gridWidth: number;
  /** Height of the grid in cells. */
  readonly gridHeight: number;
  /** Size of each grid cell in world units. */
  readonly cellSize: number;
  /** Falloff curve type. */
  readonly falloff: AoEFalloffType;
}

// ── Pipeline State ──

let aoePipeline: GPUComputePipeline | null = null;
let damageBuffer: GPUBuffer | null = null;
let aoeUniformBuffer: GPUBuffer | null = null;
let aoeBindGroup: GPUBindGroup | null = null;
let aoeStagingBuffer: GPUBuffer | null = null;
let aoeInitialized = false;

// ── Initialization ──

/**
 * Initialize the AoE damage falloff compute pipeline.
 * Must be called after initGpuDevice().
 *
 * @param maxCells - Maximum number of grid cells (must be <= MAX_GRID_CELLS).
 * @returns true if initialization succeeded.
 */
export function initAoePipeline(maxCells: number = MAX_GRID_CELLS): boolean {
  const device = getGpuDevice();
  if (!device) {
    return false;
  }

  const clampedCells = Math.min(maxCells, MAX_GRID_CELLS);
  const bufferSize = clampedCells * Float32Array.BYTES_PER_ELEMENT;

  try {
    const shaderModule = device.createShaderModule({ code: AOE_SHADER_CODE });

    aoePipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: shaderModule, entryPoint: "main" },
    });

    damageBuffer = device.createBuffer({
      label: "aoe-damage-field",
      size: bufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    });

    aoeUniformBuffer = device.createBuffer({
      label: "aoe-uniforms",
      size: UNIFORM_BUFFER_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    aoeStagingBuffer = device.createBuffer({
      label: "aoe-staging",
      size: bufferSize,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    aoeBindGroup = device.createBindGroup({
      layout: aoePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: damageBuffer } },
        { binding: 1, resource: { buffer: aoeUniformBuffer } },
      ],
    });

    aoeInitialized = true;
    return true;
  } catch (error) {
    console.warn(
      "[L0 METAL/WebGPU] AoE pipeline init failed:",
      error instanceof Error ? error.message : String(error)
    );
    aoeInitialized = false;
    return false;
  }
}

/**
 * Check if the AoE pipeline is initialized and ready.
 * @returns true if the pipeline is active.
 */
export function isAoePipelineReady(): boolean {
  return aoeInitialized && aoePipeline != null && getGpuTier() >= GpuTier.COMPUTE_NO_SHARED;
}

// ── AoE Computation ──

/**
 * Dispatch the AoE damage falloff compute shader.
 * Call readbackAoeField() afterward to retrieve results.
 *
 * @param params - AoE field parameters.
 */
export function dispatchAoeFalloff(params: AoEFieldParams): void {
  if (!aoeInitialized || !aoePipeline || !aoeBindGroup || !aoeUniformBuffer) {
    return;
  }

  const device = getGpuDevice();
  if (!device) {
    return;
  }

  const encoder = device.createCommandEncoder({ label: "aoe-falloff" });

  // Write uniform data: [originX, originY, radius, maxDamage, gridW, gridH, cellSize, falloff]
  const uniformData = new Uint32Array(UNIFORM_BUFFER_SIZE / Uint32Array.BYTES_PER_ELEMENT);
  const f32View = new Float32Array(uniformData.buffer);
  f32View[0] = params.originX;
  f32View[1] = params.originY;
  f32View[2] = params.radius;
  f32View[3] = params.maxDamage;
  uniformData[4] = params.gridWidth;
  uniformData[5] = params.gridHeight;
  f32View[6] = params.cellSize;
  f32View[7] = params.falloff;
  device.queue.writeBuffer(aoeUniformBuffer, 0, uniformData);

  // Dispatch compute pass
  const pass = encoder.beginComputePass({ label: "aoe-compute" });
  pass.setPipeline(aoePipeline);
  pass.setBindGroup(0, aoeBindGroup);
  pass.dispatchWorkgroups(
    Math.ceil(params.gridWidth / WORKGROUP_SIZE_X),
    Math.ceil(params.gridHeight / WORKGROUP_SIZE_Y)
  );
  pass.end();

  // Copy to staging buffer
  const bufferSize = params.gridWidth * params.gridHeight * Float32Array.BYTES_PER_ELEMENT;
  encoder.copyBufferToBuffer(damageBuffer!, 0, aoeStagingBuffer!, 0, bufferSize);

  device.queue.submit([encoder.finish()]);
}

/**
 * Read back AoE damage field from the GPU staging buffer.
 *
 * @param gridWidth - Width of the grid in cells.
 * @param gridHeight - Height of the grid in cells.
 * @returns Promise resolving to a flat Float32Array of damage values, or null on failure.
 */
export async function readbackAoeField(
  gridWidth: number,
  gridHeight: number
): Promise<Float32Array | null> {
  if (!aoeInitialized || !aoeStagingBuffer) {
    return null;
  }

  try {
    const cellCount = gridWidth * gridHeight;
    await aoeStagingBuffer.mapAsync(GPUMapMode.READ);
    const mapped = new Float32Array(new Float32Array(aoeStagingBuffer.getMappedRange()));
    const result = new Float32Array(cellCount);
    for (let i = 0; i < cellCount; i++) {
      result[i] = mapped[i]!;
    }
    aoeStagingBuffer.unmap();
    return result;
  } catch (error) {
    console.warn(
      "[L0 METAL/WebGPU] AoE readback failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

// ── CPU Fallback ──

/**
 * CPU fallback for AoE damage falloff computation.
 * Mirrors the GPU compute shader logic exactly for parity.
 *
 * @param params - AoE field parameters.
 * @returns Flat Float32Array of damage values (gridWidth * gridHeight).
 */
export function cpuAoeFalloff(params: AoEFieldParams): Float32Array {
  const { originX, originY, radius, maxDamage, gridWidth, gridHeight, cellSize, falloff } = params;
  const result = new Float32Array(gridWidth * gridHeight);

  for (let cy = 0; cy < gridHeight; cy++) {
    for (let cx = 0; cx < gridWidth; cx++) {
      const wx = cx * cellSize + cellSize * 0.5;
      const wy = cy * cellSize + cellSize * 0.5;
      const dx = wx - originX;
      const dy = wy - originY;
      const dist = Math.hypot(dx, dy);

      let damage = 0;

      if (dist <= radius) {
        const t = dist / radius;
        switch (falloff) {
          case AoEFalloffType.LINEAR: {
            damage = maxDamage * (1 - t);
            break;
          }
          case AoEFalloffType.SMOOTHSTEP: {
            const s = t * t * (3 - 2 * t);
            damage = maxDamage * (1 - s);
            break;
          }
          case AoEFalloffType.EXPONENTIAL: {
            damage = maxDamage * Math.exp(-3 * t * t);
            break;
          }
        }
      }

      result[cy * gridWidth + cx] = damage;
    }
  }

  return result;
}

/**
 * Destroy the AoE pipeline and release GPU resources.
 */
export function destroyAoePipeline(): void {
  if (damageBuffer) {
    damageBuffer.destroy();
    damageBuffer = null;
  }
  if (aoeUniformBuffer) {
    aoeUniformBuffer.destroy();
    aoeUniformBuffer = null;
  }
  if (aoeStagingBuffer) {
    aoeStagingBuffer.destroy();
    aoeStagingBuffer = null;
  }
  aoePipeline = null;
  aoeBindGroup = null;
  aoeInitialized = false;
}

// ── Testing helpers ──

/**
 * Reset AoE pipeline state (for testing only).
 */
export function __resetAoePipeline(): void {
  destroyAoePipeline();
}
