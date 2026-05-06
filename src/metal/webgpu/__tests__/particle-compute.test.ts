/* ═══════════════════════════════════════════════════════════
   L0 METAL — Particle Compute Tests
   Epoch-12 Delta — Unit + PBT tests for particle integration
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest"
import fc from "fast-check"
import {
  cpuParticleIntegration,
  isParticlePipelineReady,
  getParticleCount,
  __resetParticlePipeline,
} from "../particle-compute"
import type { GpuParticle } from "../particle-compute"

describe("webgpu/particle-compute", () => {
  beforeEach(() => {
    __resetParticlePipeline()
  })

  // ── Test 1: CPU integration preserves position for zero-velocity ──
  describe("cpuParticleIntegration", () => {
    it("should preserve position when velocity is zero", () => {
      const particles: readonly GpuParticle[] = [
        { x: 100, y: 200, vx: 0, vy: 0, life: 1000, size: 3 },
      ]

      const result = cpuParticleIntegration(particles, 0.016, 800, 600, 300)

      expect(result).toHaveLength(1)
      expect(result[0]!.x).toBeCloseTo(100, 1)
      expect(result[0]!.y).toBeCloseTo(200, 1)
    })
  })

  // ── Test 2: CPU integration applies gravity ──
  it("should move particle downward with gravity", () => {
    const particles: readonly GpuParticle[] = [
      { x: 100, y: 100, vx: 0, vy: 0, life: 5000, size: 3 },
    ]

    const result = cpuParticleIntegration(particles, 1, 800, 600, 98)

    expect(result).toHaveLength(1)
    expect(result[0]!.y).toBeGreaterThan(100)
  })

  // ── Test 3: CPU integration kills dead particles ──
  it("should remove particles with expired life", () => {
    const particles: readonly GpuParticle[] = [
      { x: 100, y: 100, vx: 0, vy: 0, life: -100, size: 3 },
      { x: 200, y: 200, vx: 0, vy: 0, life: 500, size: 3 },
    ]

    const result = cpuParticleIntegration(particles, 0.016, 800, 600, 0)

    expect(result).toHaveLength(1)
    expect(result[0]!.x).toBe(200)
  })

  // ── Test 4: CPU integration clamps to canvas boundaries ──
  it("should clamp particles to canvas boundaries", () => {
    const particles: readonly GpuParticle[] = [
      { x: -50, y: 100, vx: 0, vy: 0, life: 1000, size: 3 },
      { x: 900, y: 100, vx: 0, vy: 0, life: 1000, size: 3 },
      { x: 100, y: -50, vx: 0, vy: 0, life: 1000, size: 3 },
      { x: 100, y: 700, vx: 0, vy: 0, life: 1000, size: 3 },
    ]

    const result = cpuParticleIntegration(particles, 0.016, 800, 600, 0)

    for (const p of result) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(800)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(600)
    }
  })

  // ── Test 5: CPU integration handles empty particle array ──
  it("should return empty array for no particles", () => {
    const result = cpuParticleIntegration([], 0.016, 800, 600, 300)
    expect(result).toHaveLength(0)
  })

  // ── Test 6: CPU integration handles many particles ──
  it("should handle 4096 particles without error", () => {
    const particles: readonly GpuParticle[] = Array.from({ length: 4096 }, (_, _i) => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 200,
      vy: (Math.random() - 0.5) * 200,
      life: 1000 + Math.random() * 1000,
      size: 2 + Math.random() * 4,
    }))

    const result = cpuParticleIntegration(particles, 0.016, 800, 600, 300)

    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(4096)
  })

  // ── Test 7: Pipeline is not ready without GPU ──
  describe("isParticlePipelineReady", () => {
    it("should return false without WebGPU initialization", () => {
      expect(isParticlePipelineReady()).toBe(false)
    })
  })

  // ── Test 8: getParticleCount returns 0 without initialization ──
  it("should return 0 before initialization", () => {
    expect(getParticleCount()).toBe(0)
  })
})

// ── Test 9: PBT — CPU integration is deterministic ──
describe("cpuParticleIntegration PBT", () => {
  it("should produce identical results for identical inputs", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.1) }),
        fc.float({ min: -500, max: 500 }),
        fc.float({ min: -500, max: 500 }),
        fc.float({ min: Math.fround(0), max: Math.fround(10_000) }),
        (dt, vx, vy, life) => {
          const particle: GpuParticle = {
            x: 400,
            y: 300,
            vx,
            vy,
            life,
            size: 3,
          }

          const result1 = cpuParticleIntegration([particle], dt, 800, 600, 300)
          const result2 = cpuParticleIntegration([particle], dt, 800, 600, 300)

          expect(result1).toEqual(result2)
        }
      )
    )
  })

  // ── Test 10: PBT — Particles stay within bounds ──
  it("should always keep particles within canvas bounds", () => {
    const validFloat = fc.float({ min: Math.fround(0.001), max: Math.fround(0.1) }).filter((n) => Number.isFinite(n))
    const validParticle = fc.record({
      x: fc.float({ min: -200, max: 1000 }).filter((n) => Number.isFinite(n)),
      y: fc.float({ min: -200, max: 800 }).filter((n) => Number.isFinite(n)),
      vx: fc.float({ min: -1000, max: 1000 }).filter((n) => Number.isFinite(n)),
      vy: fc.float({ min: -1000, max: 1000 }).filter((n) => Number.isFinite(n)),
      life: fc.float({ min: 100, max: 5000 }).filter((n) => Number.isFinite(n)),
      size: fc.float({ min: 1, max: 10 }).filter((n) => Number.isFinite(n)),
    })

    fc.assert(
      fc.property(
        validFloat,
        fc.array(validParticle, { minLength: 1, maxLength: 100 }),
        (dt, particles) => {
          const result = cpuParticleIntegration(particles, dt, 800, 600, 300)

          for (const p of result) {
            expect(p.x).toBeGreaterThanOrEqual(0)
            expect(p.x).toBeLessThanOrEqual(800)
            expect(p.y).toBeGreaterThanOrEqual(0)
            expect(p.y).toBeLessThanOrEqual(600)
          }
        }
      )
    )
  })

  // ── Test 11: PBT — Life always decreases ──
  it("should always decrease particle life", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.1) }),
        fc.float({ min: Math.fround(0), max: Math.fround(10_000) }),
        (dt, life) => {
          const particle: GpuParticle = {
            x: 400,
            y: 300,
            vx: 0,
            vy: 0,
            life,
            size: 3,
          }

          const result = cpuParticleIntegration([particle], dt, 800, 600, 0)

          if (result.length > 0) {
            expect(result[0]!.life).toBeLessThan(life)
          }
        }
      )
    )
  })
})
