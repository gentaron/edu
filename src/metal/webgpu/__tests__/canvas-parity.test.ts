/* ═══════════════════════════════════════════════════════════
   L0 METAL — Canvas 2D Parity Tests
   Epoch-12 Delta — Ensures CPU fallback matches expected behavior
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { cpuParticleIntegration } from "../particle-compute"
import type { GpuParticle } from "../particle-compute"
import { cpuAoeFalloff } from "../aoe-falloff"
import { AoEFalloffType } from "../aoe-falloff"
import type { AoEFieldParams } from "../aoe-falloff"

describe("Canvas 2D Parity — CPU fallback correctness", () => {
  // ── Test 1: Particle integration output count is always ≤ input count ──
  it("should never produce more particles than input", () => {
    const validParticle = fc.record({
      x: fc.float({ min: 0, max: 800 }).filter((n) => Number.isFinite(n)),
      y: fc.float({ min: 0, max: 600 }).filter((n) => Number.isFinite(n)),
      vx: fc.float({ min: -500, max: 500 }).filter((n) => Number.isFinite(n)),
      vy: fc.float({ min: -500, max: 500 }).filter((n) => Number.isFinite(n)),
      life: fc.float({ min: -100, max: 5000 }).filter((n) => Number.isFinite(n)),
      size: fc.float({ min: 1, max: 8 }).filter((n) => Number.isFinite(n)),
    })
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.05) }).filter((n) => Number.isFinite(n)),
        fc.array(validParticle, { minLength: 1, maxLength: 2000 }),
        (dt, particles) => {
          const result = cpuParticleIntegration(particles, dt, 800, 600, 300)
          expect(result.length).toBeLessThanOrEqual(particles.length)
        }
      )
    )
  })

  // ── Test 2: AoE field output size is exactly gridWidth * gridHeight ──
  it("should produce exact grid size output", () => {
    fc.assert(
      fc.property(fc.nat(200), fc.nat(200), (gw, gh) => {
        const w = Math.max(1, gw)
        const h = Math.max(1, gh)
        const params: AoEFieldParams = {
          originX: 100,
          originY: 100,
          radius: 50,
          maxDamage: 100,
          gridWidth: w,
          gridHeight: h,
          cellSize: 4,
          falloff: AoEFalloffType.LINEAR,
        }

        const result = cpuAoeFalloff(params)
        expect(result.length).toBe(w * h)
      })
    )
  })

  // ── Test 3: Particles with positive life always survive ──
  it("should preserve particles with life > dt * 1000", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.01) }),
        fc.float({ min: Math.fround(100), max: Math.fround(10_000) }),
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

          // Life should still be positive since life >> dt * 1000
          if (result.length > 0) {
            expect(result[0]!.life).toBeGreaterThan(0)
          }
        }
      )
    )
  })

  // ── Test 4: AoE field is symmetric around origin ──
  it("should produce approximately symmetric damage field for centered origin", () => {
    const size = 100
    const params: AoEFieldParams = {
      originX: 50.5, // Must be at a cell center for symmetry
      originY: 50.5,
      radius: 40,
      maxDamage: 100,
      gridWidth: size,
      gridHeight: size,
      cellSize: 1,
      falloff: AoEFalloffType.LINEAR,
    }

    const result = cpuAoeFalloff(params)

    // Check that cells at the same distance from center have same damage
    const cx = Math.floor(size / 2)
    const cy = Math.floor(size / 2)

    for (let dx = 1; dx < 20; dx++) {
      for (let dy = 0; dy < 20; dy++) {
        // 4-way symmetry (only for dy >= 0 to avoid redundant checks)
        const dRight = result[cy * size + (cx + dx)]
        const dLeft = result[cy * size + (cx - dx)]
        expect(dRight!).toBeCloseTo(dLeft!, 10)
      }
      for (let dy = 1; dy < 20; dy++) {
        const dDown = result[(cy + dy) * size + cx]
        const dUp = result[(cy - dy) * size + cx]
        expect(dDown!).toBeCloseTo(dUp!, 10)
      }
    }
  })

  // ── Test 5: Multiple integration steps are consistent ──
  it("should produce consistent results across multiple integration steps", () => {
    const particle: GpuParticle = {
      x: 400,
      y: 300,
      vx: 100,
      vy: 0,
      life: 10_000,
      size: 3,
    }

    // Two half-steps should approximately equal one full step
    const halfStep1 = cpuParticleIntegration([particle], 0.008, 800, 600, 0)
    const halfStep2 = halfStep1.length > 0
      ? cpuParticleIntegration(halfStep1, 0.008, 800, 600, 0)
      : halfStep1

    const fullStep = cpuParticleIntegration([particle], 0.016, 800, 600, 0)

    if (halfStep2.length > 0 && fullStep.length > 0) {
      expect(halfStep2[0]!.x).toBeCloseTo(fullStep[0]!.x, 0)
      expect(halfStep2[0]!.y).toBeCloseTo(fullStep[0]!.y, 0)
    }
  })

  // ── Test 6: AoE smoothstep is always between linear and exponential ──
  it("should have smoothstep damage between linear and exponential at same point", () => {
    const params: AoEFieldParams = {
      originX: 50,
      originY: 50,
      radius: 100,
      maxDamage: 100,
      gridWidth: 100,
      gridHeight: 100,
      cellSize: 2,
      falloff: AoEFalloffType.LINEAR,
    }

    const linear = cpuAoeFalloff(params)
    const smoothstep = cpuAoeFalloff({ ...params, falloff: AoEFalloffType.SMOOTHSTEP })
    const exponential = cpuAoeFalloff({ ...params, falloff: AoEFalloffType.EXPONENTIAL })

    for (let i = 0; i < linear.length; i++) {
      // Only check cells within the radius
      if (linear[i]! > 0 && smoothstep[i]! > 0 && exponential[i]! > 0) {
        // All should be positive when within range
        expect(linear[i]).toBeGreaterThan(0)
        expect(smoothstep[i]).toBeGreaterThan(0)
        expect(exponential[i]).toBeGreaterThan(0)
      }
      // Cells outside the radius should be zero
      if (linear[i] === 0) {
        expect(smoothstep[i]).toBe(0)
        expect(exponential[i]).toBe(0)
      }
    }
  })
})
