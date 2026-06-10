import { describe, it, expect } from "vitest"
import { analyzeRisk, suggestPortfolio, saveAnalysis } from "../fin-analysis"
import type { MarketAsset } from "../fin-analysis"

const SAMPLE_ASSETS: MarketAsset[] = [
  { id: "s1", name: "Auralis Corp", nameEn: "Auralis Corp", type: "stock", price: 150.5, change24h: 2.3, volume: 1_000_000 },
  { id: "s2", name: "E16 Energy", nameEn: "E16 Energy", type: "stock", price: 85.2, change24h: -1.5, volume: 500_000 },
  { id: "i1", name: "E16MC Index", nameEn: "E16MC Index", type: "index", price: 1000, change24h: 0.5, volume: 5_000_000 },
]

describe("fin-analysis", () => {
  it("analyzeRisk returns medium risk for 1-of-3 negative assets", async () => {
    const result = await analyzeRisk(SAMPLE_ASSETS)
    // 1/3 = 33% negative ratio > 0.3 threshold → medium
    expect(result.overallRisk).toBe("medium")
    expect(result.riskScore).toBeGreaterThanOrEqual(0)
    expect(result.riskScore).toBeLessThanOrEqual(100)
    expect(result.factors).toHaveLength(3)
    expect(result.generatedAt).toBeTruthy()
  })

  it("analyzeRisk returns high risk when 60% negative", async () => {
    const negativeAssets: MarketAsset[] = [
      { id: "a", name: "A", nameEn: "A", type: "stock", price: 100, change24h: -3, volume: 1000 },
      { id: "b", name: "B", nameEn: "B", type: "stock", price: 100, change24h: -2, volume: 1000 },
      { id: "c", name: "C", nameEn: "C", type: "stock", price: 100, change24h: -1, volume: 1000 },
      { id: "d", name: "D", nameEn: "D", type: "stock", price: 100, change24h: 5, volume: 1000 },
      { id: "e", name: "E", nameEn: "E", type: "stock", price: 100, change24h: 1, volume: 1000 },
    ]
    const result = await analyzeRisk(negativeAssets)
    expect(result.overallRisk).toBe("high")
  })

  it("suggestPortfolio returns conservative allocation", async () => {
    const result = await suggestPortfolio(SAMPLE_ASSETS, "conservative")
    expect(result.allocation).toHaveLength(SAMPLE_ASSETS.length)
    expect(result.riskLevel).toBe("conservative")
    expect(result.disclaimer).toContain("シミュレーション")
    const totalWeight = result.allocation.reduce((s, a) => s + a.weight, 0)
    expect(totalWeight).toBeCloseTo(1, 1)
  })

  it("suggestPortfolio handles fewer assets than weight slots", async () => {
    const single: MarketAsset[] = [
      { id: "x", name: "X", nameEn: "X", type: "stock", price: 50, change24h: 1, volume: 100 },
    ]
    const result = await suggestPortfolio(single, "aggressive")
    expect(result.allocation).toHaveLength(1)
    expect(result.allocation[0]?.weight).toBeCloseTo(.15)
  })

  it("saveAnalysis returns false when storage unavailable", async () => {
    const analysis = await analyzeRisk(SAMPLE_ASSETS)
    const saved = await saveAnalysis(analysis)
    expect(saved).toBe(false)
  })
})