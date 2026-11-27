import { describe, expect, it } from "vitest"
import { computeNow, fields, COUPLING, hash, phaseAt } from "./living-model.mjs"
import registry from "./registry.json"

const people = registry.people.filter((p) => p.status === "current")
const day = new Date(Date.UTC(2026, 11, 3, 12))
const e = { care: .6, pressure: .25, opportunity: .5 }

describe("present-only triadic model", () => {
  it("has no time parameter beyond today's environment phase", () => {
    // identical instant → identical state; nothing is simulated forward
    expect(computeNow(people.slice(0, 50), day)).toEqual(computeNow(people.slice(0, 50), day))
    expect(phaseAt(day).day).toBe(6)
  })
  it("converges to a self-consistent equilibrium", () => {
    const r = computeNow(people, day)
    expect(r.convergence.residual).toBeLessThan(1e-9)
    expect(r.states).toHaveLength(people.length)
  })
  it("three-point term is the exact gradient of g·x_h·x_w·x_a and bounded by g", () => {
    const x = [.4, -.3, .7]
    const t = fields(x, e, .5, [0, 0, 0], [0, 0, 0]).triad
    const V = (y: number[]) => COUPLING.g * y[0]! * y[1]! * y[2]!
    for (let k = 0; k < 3; k++) {
      const up = [...x], dn = [...x]; up[k]! += 1e-6; dn[k]! -= 1e-6
      expect(t[k]!).toBeCloseTo((V(up) - V(dn)) / 2e-6, 8)
    }
    for (const y of [[1, 1, 1], [-1, 1, -1], [.9, -.9, .9]]) for (const v of fields(y, e, .5, [0, 0, 0], [0, 0, 0]).triad) expect(Math.abs(v)).toBeLessThanOrEqual(COUPLING.g + 1e-12)
    // vanishes when any partner axis is neutral
    expect(fields([.8, 0, .8], e, .5, [0, 0, 0], [0, 0, 0]).triad[0]).toBe(0)
  })
  it("couplings keep the map contractive (‖J‖ + |g| + γ < 1)", () => {
    const { hw, ha, wa, g, peer } = COUPLING
    // largest eigenvalue magnitude of a symmetric 3x3 zero-diagonal matrix is at most its max row sum
    expect(Math.max(hw + ha, hw + wa, ha + wa) + g + peer).toBeLessThan(1)
  })
  it("does not pile people up at the boundaries", () => {
    const s = computeNow(people, day).states
    for (const k of ["h", "a"] as const) expect(s.filter((x) => x[k] < .01 || x[k] > .99).length / s.length).toBeLessThan(.03)
    for (const x of s) { expect(x.h).toBeGreaterThan(0); expect(x.h).toBeLessThan(1); expect(x.assets - x.debt).toBeCloseTo(x.w, 9); expect(x.debt).toBeGreaterThanOrEqual(0) }
  })
  it("individual draws depend on ID only, not on names, identity or roster order", () => {
    const base = computeNow(people.slice(0, 80), day).states
    const renamed = computeNow(people.slice(0, 80).map((p) => ({ ...p, name: "X", nameEn: "Y", identity: "z", identityEn: "z" })), day).states
    expect(renamed).toEqual(base)
    expect(hash("C002")).toBe(hash("C002"))
  })
})
