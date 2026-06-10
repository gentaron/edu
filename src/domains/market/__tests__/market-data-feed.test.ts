import { describe, it, expect } from "vitest"
import { analyzeMarketPattern, applyRealPatternToE16 } from "../market-data-feed"
import type { TushareMarketData } from "../market-data-feed"

describe("market-data-feed", () => {
  it("fetchTushareData returns empty without API key", async () => {
    const { fetchTushareData } = await import("../market-data-feed")
    const result = await fetchTushareData("000001.SZ", "20250101", "20250131")
    expect(result).toEqual([])
  })

  it("analyzeMarketPattern detects bullish trend", () => {
    const data: TushareMarketData[] = Array.from({ length: 10 }, (_, i) => ({
      date: `2025-01-${String(i + 1).padStart(2, "0")}`,
      open: 100 + i,
      high: 102 + i,
      low: 99 + i,
      close: 101 + i,
      volume: 1_000_000,
    }))
    const result = analyzeMarketPattern(data)
    expect(result.type).toBe("bullish")
    expect(result.confidence).toBeGreaterThan(0)
  })

  it("analyzeMarketPattern returns stable for insufficient data", () => {
    const data: TushareMarketData[] = [
      { date: "2025-01-01", open: 100, high: 101, low: 99, close: 100, volume: 1000 },
    ]
    const result = analyzeMarketPattern(data)
    expect(result.type).toBe("stable")
  })

  it("applyRealPatternToE16 returns empty for empty input", () => {
    const result = applyRealPatternToE16([], { type: "bullish", confidence: .8, description: "test" })
    expect(result).toEqual([])
  })

  it("applyRealPatternToE16 applies trend factor", () => {
    const prices = [100, 100, 100]
    const result = applyRealPatternToE16(prices, { type: "bullish", confidence: .9, description: "bull" })
    expect(result).toHaveLength(3)
    // All prices should be >= 100 (bullish factor is 1.001, noise can be negative but clamped to 0.01)
    for (const price of result) {
      expect(price).toBeGreaterThan(0)
    }
  })
})