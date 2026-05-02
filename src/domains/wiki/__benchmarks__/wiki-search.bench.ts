import { describe, bench, beforeAll } from "vitest"
import { WikiSearchEngine } from "@/domains/wiki/wiki-search"

describe("WikiSearchEngine benchmarks", () => {
  let engine: WikiSearchEngine

  beforeAll(async () => {
    engine = new WikiSearchEngine()
    await engine.initialize()
  })

  bench("search — single Japanese term (2 chars)", () => {
    engine.search("セリア", { limit: 10 })
  })

  bench("search — multi-term query (4 chars)", () => {
    engine.search("虚無 宇宙", { limit: 10 })
  })

  bench("search — English term", () => {
    engine.search("Celia", { limit: 10 })
  })

  bench("search — category filtered (キャラクター)", () => {
    engine.search("セリア", { categories: ["キャラクター"], limit: 10 })
  })

  bench("search — multi-category filtered", () => {
    engine.search("攻撃", { categories: ["キャラクター", "用語", "技術"], limit: 10 })
  })

  bench("search — with limit 50", () => {
    engine.search("能力", { limit: 50 })
  })

  bench("autocomplete — Japanese prefix", () => {
    engine.autocomplete("セ", 10)
  })

  bench("autocomplete — English prefix", () => {
    engine.autocomplete("Ce", 10)
  })

  bench("search — 100 sequential different queries", () => {
    const queries = [
      "セリア",
      "虚無",
      "宇宙",
      "ディオクレニス",
      "フェーズ",
      "シールド",
      "ダメージ",
      "回復",
      "文明",
      "技術",
    ]
    for (const q of queries) {
      for (let j = 0; j < 10; j++) {
        engine.search(q, { limit: 5 })
      }
    }
  })
})
