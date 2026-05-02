/* ═══════════════════════════════════════════════════════════
   L0 METAL — AoE Falloff Compute Tests
   Epoch-12 Delta — Unit + PBT tests for AoE damage fields
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest"
import fc from "fast-check"
import {
  cpuAoeFalloff,
  isAoePipelineReady,
  __resetAoePipeline,
} from "../aoe-falloff"
import { AoEFalloffType } from "../aoe-falloff"
import type { AoEFieldParams } from "../aoe-falloff"

describe("webgpu/aoe-falloff", () => {
  beforeEach(() => {
    __resetAoePipeline()
  })

  // ── Test 1: Linear falloff at center is maxDamage ──
  describe("cpuAoeFalloff", () => {
    it("should return maxDamage at the origin for linear falloff", () => {
      const params: AoEFieldParams = {
        originX: 50,
        originY: 50,
        radius: 100,
        maxDamage: 50,
        gridWidth: 100,
        gridHeight: 100,
        cellSize: 2,
        falloff: AoEFalloffType.LINEAR,
      }

      const result = cpuAoeFalloff(params)

      // Origin is at (50, 50). Cell (25, 25) center at (51, 51) is ~1.4 units from origin.
      // With radius=100, damage at 1.4 units is close to max.
      const centerCell = result[25 * 100 + 25]
      expect(centerCell).toBeCloseTo(50, -1) // tolerance 5.0 due to discrete grid offset
    })
  })

  // ── Test 2: Linear falloff at edge is approximately zero ──
  it("should return approximately zero at the edge for linear falloff", () => {
    const params: AoEFieldParams = {
      originX: 50,
      originY: 50,
      radius: 100,
      maxDamage: 50,
      gridWidth: 100,
      gridHeight: 100,
      cellSize: 2,
      falloff: AoEFalloffType.LINEAR,
    }

    const result = cpuAoeFalloff(params)

    // Cell at (99, 50) has center at (199, 101) — distance ≈ 149 > radius=100
    const edgeCell = result[50 * 100 + 99]
    expect(edgeCell).toBe(0)
  })

  // ── Test 3: All three falloff types produce correct sizes ──
  it("should produce gridWidth*gridHeight output for all falloff types", () => {
    const baseParams: Omit<AoEFieldParams, "falloff"> = {
      originX: 50,
      originY: 50,
      radius: 100,
      maxDamage: 50,
      gridWidth: 64,
      gridHeight: 64,
      cellSize: 4,
    }

    for (const type of [AoEFalloffType.LINEAR, AoEFalloffType.SMOOTHSTEP, AoEFalloffType.EXPONENTIAL]) {
      const result = cpuAoeFalloff({ ...baseParams, falloff: type })
      expect(result.length).toBe(64 * 64)
    }
  })

  // ── Test 4: Exponential falloff has sharp center concentration ──
  it("should have higher damage near center than linear at same distance", () => {
    const params: AoEFieldParams = {
      originX: 50,
      originY: 50,
      radius: 100,
      maxDamage: 100,
      gridWidth: 100,
      gridHeight: 100,
      cellSize: 2,
      falloff: AoEFalloffType.EXPONENTIAL,
    }

    const expResult = cpuAoeFalloff(params)

    const linParams = { ...params, falloff: AoEFalloffType.LINEAR }
    const linResult = cpuAoeFalloff(linParams)

    // Find a cell at ~50% radius
    const linHalf = linResult[30 * 100 + 35] // roughly half radius
    const expHalf = expResult[30 * 100 + 35]

    // Exponential should be higher at the half-radius point
    expect(expHalf!).toBeGreaterThan(linHalf!)
  })

  // ── Test 5: AoE pipeline not ready without GPU ──
  describe("isAoePipelineReady", () => {
    it("should return false without WebGPU initialization", () => {
      expect(isAoePipelineReady()).toBe(false)
    })
  })

  // ── Test 6: Zero radius produces no damage ──
  it("should produce no damage when radius is zero", () => {
    const params: AoEFieldParams = {
      originX: 50,
      originY: 50,
      radius: 0,
      maxDamage: 100,
      gridWidth: 10,
      gridHeight: 10,
      cellSize: 10,
      falloff: AoEFalloffType.LINEAR,
    }

    const result = cpuAoeFalloff(params)

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(0)
    }
  })

  // ── Test 7: Large grid handles without error ──
  it("should handle 256x256 grid without error", () => {
    const params: AoEFieldParams = {
      originX: 256,
      originY: 256,
      radius: 200,
      maxDamage: 80,
      gridWidth: 256,
      gridHeight: 256,
      cellSize: 2,
      falloff: AoEFalloffType.SMOOTHSTEP,
    }

    const result = cpuAoeFalloff(params)
    expect(result.length).toBe(256 * 256)

    // At least some cells should have damage
    const nonzeroCells = result.filter((d) => d > 0).length
    expect(nonzeroCells).toBeGreaterThan(0)
  })
})

// ── Test 8: PBT — AoE damage is always non-negative ──
describe("cpuAoeFalloff PBT", () => {
  it("should never produce negative damage values", () => {
    const finiteFloat = fc.float({ min: -1000, max: 2000 }).filter((n) => Number.isFinite(n))
    fc.assert(
      fc.property(
        finiteFloat,
        finiteFloat,
        fc.float({ min: Math.fround(1), max: 2000 }).filter((n) => Number.isFinite(n)),
        fc.float({ min: Math.fround(1), max: 500 }).filter((n) => Number.isFinite(n)),
        fc.nat(50), // reduced grid size for speed
        (originX, originY, radius, maxDamage, gridSize) => {
          const g = Math.max(1, gridSize)
          const params: AoEFieldParams = {
            originX,
            originY,
            radius: Math.max(1, radius),
            maxDamage: Math.max(1, maxDamage),
            gridWidth: g,
            gridHeight: g,
            cellSize: Math.max(1, radius / g),
            falloff: AoEFalloffType.LINEAR,
          }

          const result = cpuAoeFalloff(params)

          for (let i = 0; i < result.length; i++) {
            expect(result[i]).toBeGreaterThanOrEqual(0)
          }
        }
      )
    )
  })

  // ── Test 9: PBT — Damage at center is always maxDamage ──
  it("should return maxDamage at the origin cell", () => {
    const validRadius = fc.float({ min: Math.fround(10), max: 100 }).filter((n) => Number.isFinite(n))
    const validDmg = fc.float({ min: Math.fround(1), max: 100 }).filter((n) => Number.isFinite(n))
    fc.assert(
      fc.property(
        validRadius,
        validDmg,
        (radius, maxDamage) => {
          const gridSize = 100
          const cellSize = (radius * 2) / gridSize
          const params: AoEFieldParams = {
            originX: radius,
            originY: radius,
            radius,
            maxDamage,
            gridWidth: gridSize,
            gridHeight: gridSize,
            cellSize,
            falloff: AoEFalloffType.LINEAR,
          }

          const result = cpuAoeFalloff(params)

          // The cell at the center — find the cell closest to origin
          const cx = Math.floor(radius / cellSize)
          const cy = Math.floor(radius / cellSize)
          if (cx < gridSize && cy < gridSize) {
            const centerDamage = result[cy * gridSize + cx]
            // Should be close to maxDamage (may not be exact due to discrete grid)
            expect(centerDamage).toBeGreaterThan(maxDamage * 0.95)
          }
        }
      )
    )
  })

  // ── Test 10: PBT — All falloff types produce same result size ──
  it("should produce identical sized output for all falloff types", () => {
    fc.assert(
      fc.property(
        fc.nat(100),
        fc.nat(100),
        fc.float({ min: 1, max: 1000 }),
        (gridW, gridH, maxDmg) => {
          const gw = Math.max(1, gridW)
          const gh = Math.max(1, gridH)
          const params: Omit<AoEFieldParams, "falloff"> = {
            originX: 50,
            originY: 50,
            radius: 100,
            maxDamage: Math.max(1, maxDmg),
            gridWidth: gw,
            gridHeight: gh,
            cellSize: 2,
          }

          const linear = cpuAoeFalloff({ ...params, falloff: AoEFalloffType.LINEAR })
          const smooth = cpuAoeFalloff({ ...params, falloff: AoEFalloffType.SMOOTHSTEP })
          const expo = cpuAoeFalloff({ ...params, falloff: AoEFalloffType.EXPONENTIAL })

          expect(linear.length).toBe(smooth.length)
          expect(smooth.length).toBe(expo.length)
          expect(expo.length).toBe(gw * gh)
        }
      )
    )
  })
})
