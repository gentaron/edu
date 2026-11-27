import { describe, expect, it } from "vitest"
import { characterMatch, characterKey } from "./character-search"
describe("character search", () => {
  it("matches exact, prefix, alternate scripts and spaced names", () => {
    expect(characterMatch("Mina", ["Mina"])).toBe(3)
    expect(characterMatch("ミナ", ["みな・エウレカ"])).toBe(2)
    expect(characterMatch("WilhelminaEureka", ["Wilhelmina Eureka Ernest"])).toBe(2)
    expect(characterMatch("C002", ["Ｃ００２"])).toBe(3)
    expect(characterMatch("unknown", ["Mina"])).toBe(-1)
  })
  it("encodes Unicode and slash IDs in a single URL segment", () => {
    const id = "Tina/Gue・ミナ"
    expect(characterKey(id)).toMatch(/^[a-f0-9]+$/)
    expect(Buffer.from(characterKey(id), "hex").toString("utf8")).toBe(id)
  })
})
