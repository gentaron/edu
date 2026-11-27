import { describe, expect, it } from "vitest"
import { buildRelationalGraph, computeNow, cubicVertex, COUPLING, hash, phaseAt } from "./living-model.mjs"
import registry from "./registry.json"

const people = registry.people.filter((p) => p.status === "current")
const day = new Date(Date.UTC(2026, 11, 3, 12))

describe("present-only relational model", () => {
  it("has no time parameter beyond today's environment phase", () => {
    // identical instant → identical state; nothing is simulated forward
    expect(computeNow(people.slice(0, 50), day)).toEqual(computeNow(people.slice(0, 50), day))
    expect(phaseAt(day).day).toBe(6)
  })
  it("converges to a self-consistent equilibrium", () => {
    const r = computeNow(people, day)
    expect(r.convergence.converged).toBe(true)
    expect(r.convergence.residual).toBeLessThanOrEqual(1e-10)
    expect(r.states).toHaveLength(people.length)
  })
  it("matches an explicit matrix trace, with each person's diagonal counted once", () => {
    const graph = buildRelationalGraph([[1, 2], [], [3, 1], [], []], ["A", "B", "A", "A", "B"])
    const x = [[.4, -.3, .7], [.9, .2, -.4], [-.2, .6, .3], [.2, .9, -.2], [1, 1, 1]]
    const matrix = x.map(() => x.map(() => 0))
    for (const { i, j, weights } of graph.edges) {
      matrix[i]![j] = matrix[j]![i] = weights.reduce((s, w, d) => s + w * (x[i]![d]! + x[j]![d]!) / 2, 0)
    }
    const diagonal = matrix.map((row, i) => row.reduce((a, ij, j) =>
      a + matrix[j]!.reduce((b, jk, k) => b + ij * jk * matrix[k]![i]!, 0), 0))
    const result = cubicVertex(x, graph, true)
    expect(graph.triangles).toHaveLength(2)
    expect(result.trace).toBeCloseTo(diagonal.reduce((s, v) => s + v, 0), 12)
    for (let i = 0; i < x.length; i++) {
      expect(result.diagonal[i]).toBeCloseTo(COUPLING.g * diagonal[i]! / (6 * graph.normalization), 12)
    }
    expect(result.diagonal.reduce((s, v) => s + v, 0)).toBeCloseTo(result.potential, 12)
    expect(result.strongest[4]).toBeNull()
    expect(result.gradient[4]).toEqual([0, 0, 0])
  })
  it("has a zero cubic vertex on an open path and changes under a remote person's state", () => {
    const x = [[.4, .4, .4], [.5, .5, .5], [.6, .6, .6]]
    const chain = buildRelationalGraph([[1], [2], []], ["A", "A", "A"])
    expect(cubicVertex(x, chain).gradient).toEqual(x.map(() => [0, 0, 0]))
    expect(cubicVertex(x, chain).trace).toBe(0)
    const triangle = buildRelationalGraph([[1, 2], [], []], ["A", "A", "A"])
    const before = cubicVertex(x, triangle).gradient[0]
    const after = cubicVertex([x[0]!, x[1]!, [.9, .9, .9]], triangle).gradient[0]
    expect(before).not.toEqual(after)
  })
  it("uses the gradient of the full relational potential and bounds the cubic force", () => {
    const graph = buildRelationalGraph([[1, 2], [], [3, 1], []], ["A", "B", "A", "A"])
    const x = [[.4, -.3, .7], [.9, .2, -.4], [-.2, .6, .3], [.2, .9, -.2]]
    const { gradient } = cubicVertex(x, graph)
    for (let i = 0; i < x.length; i++) {
      for (let d = 0; d < 3; d++) {
        const up = x.map(y => [...y]), down = x.map(y => [...y])
        up[i]![d]! += 1e-6
        down[i]![d]! -= 1e-6
        expect(gradient[i]![d]).toBeCloseTo((cubicVertex(up, graph).potential - cubicVertex(down, graph).potential) / 2e-6, 9)
      }
    }
    for (const row of cubicVertex(x.map(() => [1, 1, 1]), graph).gradient) {
      expect(row.reduce((total, v) => total + Math.abs(v), 0)).toBeLessThanOrEqual(COUPLING.g + 1e-12)
    }
  })
  it("reports a real three-tie cycle rooted at the displayed person", () => {
    const inputs = people.slice(0, 40)
    const result = computeNow(inputs, day)
    const cycles = result.states.flatMap((s, i) => s.cycle ? [{ cycle: s.cycle, root: inputs[i]!.id }] : [])
    expect(cycles.length).toBeGreaterThan(0)
    for (const { cycle, root } of cycles) {
      expect(cycle.ids[0]).toBe(root)
      expect(new Set(cycle.ids).size).toBe(3)
      expect(cycle.links.reduce((p, f) => p * f, 1)).toBeCloseTo(cycle.product, 12)
    }
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
    expect(computeNow(people.slice(0, 80).reverse(), day).states.reverse()).toEqual(base)
    expect(hash("C002")).toBe(hash("C002"))
  })
})
