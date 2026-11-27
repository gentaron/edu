import { describe as suite, expect, it } from "vitest"
import { describe, histogram, kde, pearson, spearman, ols, cohenD, etaSquared, gini, theil, lorenz, topShare, palma, ranks, quantileSorted, corrCI } from "./stats"

suite("analytics statistics", () => {
  it("matches textbook descriptive values", () => {
    const d = describe([2, 4, 4, 4, 5, 5, 7, 9])
    expect(d.mean).toBe(5)
    expect(d.sd).toBeCloseTo(2.13809, 4) // sample SD
    expect(d.median).toBe(4.5)
    expect(quantileSorted([1, 2, 3, 4], 0.25)).toBeCloseTo(1.75, 12)
    expect(describe([1, 2, 3, 4, 100]).skew).toBeGreaterThan(2)
    expect(Math.abs(describe([1, 2, 3, 4, 5, 6, 7]).skew)).toBeLessThan(1e-12)
  })
  it("histogram conserves counts and KDE integrates to ~1", () => {
    const x = Array.from({ length: 500 }, (_, i) => Math.sin(i) * 3 + i / 100)
    expect(histogram(x).counts.reduce((a, b) => a + b, 0)).toBe(500)
    const k = kde(x, -10, 15, 400), step = 25 / 399
    expect(k.density.reduce((a, b) => a + b, 0) * step).toBeCloseTo(1, 2)
  })
  it("correlations, ranks and regression", () => {
    const x = [1, 2, 3, 4, 5], y = [2, 4, 6, 8, 10]
    expect(pearson(x, y)).toBeCloseTo(1, 12)
    expect(spearman(x, [1, 8, 27, 64, 125])).toBeCloseTo(1, 12)
    expect(ranks([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4])
    const f = ols(x, y); expect(f.b).toBeCloseTo(2, 12); expect(f.a).toBeCloseTo(0, 12)
    const [lo, hi] = corrCI(0.5, 100); expect(lo).toBeLessThan(0.5); expect(hi).toBeGreaterThan(0.5)
  })
  it("group effect sizes", () => {
    expect(cohenD([1, 2, 3], [1, 2, 3])).toBe(0)
    expect(cohenD([5, 6, 7], [1, 2, 3])).toBeCloseTo(4, 12)
    expect(etaSquared([[1, 1], [3, 3]])).toBeCloseTo(1, 12)
    expect(etaSquared([[1, 3], [1, 3]])).toBeCloseTo(0, 12)
  })
  it("inequality measures hit their closed forms", () => {
    expect(gini([1, 1, 1, 1])).toBe(0)
    expect(gini([0, 0, 0, 1])).toBeCloseTo(0.75, 12)
    expect(theil([1, 1, 1])).toBeCloseTo(0, 12)
    expect(topShare([1, 1, 1, 1, 1, 1, 1, 1, 1, 91], 0.1)).toBeCloseTo(0.91, 12)
    const L = lorenz([1, 2, 3, 4], 4); expect(L.at(-1)).toEqual([1, 1]); expect(L[2]![1]).toBeCloseTo(0.3, 12)
    expect(palma([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])).toBeCloseTo(0.25, 12)
  })
})
