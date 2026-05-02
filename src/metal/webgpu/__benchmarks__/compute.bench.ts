/* ═══════════════════════════════════════════════════════════
   L0 METAL — Particle & AoE Compute Benchmarks
   Epoch-12 Delta — Performance benchmarks for compute pipelines
   ═══════════════════════════════════════════════════════════ */

import { describe, bench } from "vitest"
import { cpuParticleIntegration } from "../particle-compute"
import type { GpuParticle } from "../particle-compute"
import { cpuAoeFalloff } from "../aoe-falloff"
import { AoEFalloffType } from "../aoe-falloff"
import type { AoEFieldParams } from "../aoe-falloff"
import { SharedRingBuffer, FallbackRingBuffer } from "../ring-buffer"

/** Generate N random particles within the given canvas bounds. */
function generateParticles(count: number, canvasW: number, canvasH: number): readonly GpuParticle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    vx: (Math.random() - 0.5) * 300,
    vy: (Math.random() - 0.5) * 300 - 100, // slight upward bias
    life: 500 + Math.random() * 1500,
    size: 2 + Math.random() * 4,
  }))
}

describe("Benchmark: CPU Particle Integration", () => {
  bench("256 particles × 60fps frame (16.67ms dt)", () => {
    const particles = generateParticles(256, 800, 600)
    cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)
  })

  bench("1024 particles × 60fps frame", () => {
    const particles = generateParticles(1024, 800, 600)
    cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)
  })

  bench("2048 particles × 60fps frame", () => {
    const particles = generateParticles(2048, 800, 600)
    cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)
  })

  bench("4096 particles × 60fps frame", () => {
    const particles = generateParticles(4096, 800, 600)
    cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)
  })

  bench("4096 particles × 10 integration steps", () => {
    let particles = generateParticles(4096, 800, 600)
    for (let i = 0; i < 10; i++) {
      particles = cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)
    }
  })
})

describe("Benchmark: CPU AoE Damage Falloff", () => {
  bench("64×64 grid linear falloff", () => {
    const params: AoEFieldParams = {
      originX: 64,
      originY: 64,
      radius: 50,
      maxDamage: 100,
      gridWidth: 64,
      gridHeight: 64,
      cellSize: 2,
      falloff: AoEFalloffType.LINEAR,
    }
    cpuAoeFalloff(params)
  })

  bench("128×128 grid smoothstep falloff", () => {
    const params: AoEFieldParams = {
      originX: 128,
      originY: 128,
      radius: 100,
      maxDamage: 100,
      gridWidth: 128,
      gridHeight: 128,
      cellSize: 2,
      falloff: AoEFalloffType.SMOOTHSTEP,
    }
    cpuAoeFalloff(params)
  })

  bench("256×256 grid exponential falloff", () => {
    const params: AoEFieldParams = {
      originX: 256,
      originY: 256,
      radius: 200,
      maxDamage: 100,
      gridWidth: 256,
      gridHeight: 256,
      cellSize: 2,
      falloff: AoEFalloffType.EXPONENTIAL,
    }
    cpuAoeFalloff(params)
  })
})

describe("Benchmark: Ring Buffer Throughput", () => {
  bench("FallbackRingBuffer write 1000 entries", () => {
    const buf = new FallbackRingBuffer(1024 * 1024)
    for (let i = 0; i < 1000; i++) {
      const data = new Uint8Array(64)
      buf.write(data)
    }
  })

  bench("FallbackRingBuffer write + read 1000 entries", () => {
    const buf = new FallbackRingBuffer(1024 * 1024)
    // Fill
    for (let i = 0; i < 1000; i++) {
      buf.write(new Uint8Array(64))
    }
    // Drain
    for (let i = 0; i < 1000; i++) {
      buf.read()
    }
  })

  bench("SharedRingBuffer write 1000 entries", () => {
    const buf = new SharedRingBuffer(1024 * 1024)
    for (let i = 0; i < 1000; i++) {
      const data = new Uint8Array(64)
      buf.write(data)
    }
  })

  bench("SharedRingBuffer write + read 1000 entries", () => {
    const buf = new SharedRingBuffer(1024 * 1024)
    // Fill
    for (let i = 0; i < 1000; i++) {
      buf.write(new Uint8Array(64))
    }
    // Drain
    for (let i = 0; i < 1000; i++) {
      buf.read()
    }
  })
})

describe("Benchmark: Frame-time Simulation", () => {
  /**
   * Simulates 60 frames of battle rendering with particles.
   * Measures total time to compute all 60 frames of particle updates.
   */
  bench("60 frames × 2048 particles (full battle scene)", () => {
    let particles = generateParticles(2048, 800, 600)

    for (let frame = 0; frame < 60; frame++) {
      particles = cpuParticleIntegration(particles, 0.016_67, 800, 600, 300)

      // Simulate emitting new particles every few frames
      if (frame % 5 === 0) {
        const burst: readonly GpuParticle[] = generateParticles(50, 800, 600)
        particles = [...particles, ...burst]
      }
    }
  })
})
