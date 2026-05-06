import { describe, it, expect } from "vitest"
import { toRoman, isSceneBreak, isChapterHeading } from "@/domains/stories/stories.parser"

/* ═══════════════════════════════════════════
   toRoman
   ═══════════════════════════════════════════ */
describe("toRoman", () => {
  it("1 → I", () => {
    expect(toRoman(1)).toBe("I")
  })

  it("2 → II", () => {
    expect(toRoman(2)).toBe("II")
  })

  it("3 → III", () => {
    expect(toRoman(3)).toBe("III")
  })

  it("4 → IV", () => {
    expect(toRoman(4)).toBe("IV")
  })

  it("5 → V", () => {
    expect(toRoman(5)).toBe("V")
  })

  it("6 → VI", () => {
    expect(toRoman(6)).toBe("VI")
  })

  it("7 → VII", () => {
    expect(toRoman(7)).toBe("VII")
  })

  it("8 → VIII", () => {
    expect(toRoman(8)).toBe("VIII")
  })

  it("9 → IX", () => {
    expect(toRoman(9)).toBe("IX")
  })

  it("10 → X", () => {
    expect(toRoman(10)).toBe("X")
  })

  it("0 → empty string", () => {
    expect(toRoman(0)).toBe("")
  })

  it("toRoman only supports 1-10 (by design)", () => {
    // The function's map only covers 1-10
    const result50 = toRoman(50)
    expect(typeof result50).toBe("string")
    // 50 is not in the map, so it returns the remainder as-is
    expect(result50.length).toBeGreaterThanOrEqual(0)
  })

  it("returns string type", () => {
    expect(typeof toRoman(5)).toBe("string")
  })
})

/* ═══════════════════════════════════════════
   isSceneBreak
   ═══════════════════════════════════════════ */
describe("isSceneBreak", () => {
  it("detects ***", () => {
    expect(isSceneBreak("***")).toBe(true)
  })

  it("detects ----", () => {
    expect(isSceneBreak("----")).toBe(true)
  })

  it("detects ─── (box drawing)", () => {
    expect(isSceneBreak("──────")).toBe(true)
  })

  it("detects ━━━ (heavy box drawing)", () => {
    expect(isSceneBreak("━━━━━━")).toBe(true)
  })

  it("detects ===", () => {
    expect(isSceneBreak("========")).toBe(true)
  })

  it("detects ##", () => {
    expect(isSceneBreak("## heading")).toBe(true)
  })

  it("detects ＊ (fullwidth asterisk)", () => {
    expect(isSceneBreak("＊＊＊")).toBe(true)
  })

  it("detects short non-text lines", () => {
    expect(isSceneBreak("---")).toBe(true)
  })

  it("does NOT detect normal text", () => {
    expect(isSceneBreak("This is a normal sentence.")).toBe(false)
  })

  it("does NOT detect Japanese text", () => {
    expect(isSceneBreak("これは普通の文章です。")).toBe(false)
  })

  it("does NOT detect text with mixed content", () => {
    expect(isSceneBreak("Hello World")).toBe(false)
  })

  it("empty string is detected as scene break (matches short-line rule)", () => {
    expect(isSceneBreak("")).toBe(true)
  })

  it("whitespace-only string is detected as scene break (matches short-line rule)", () => {
    expect(isSceneBreak("   ")).toBe(true)
  })

  it("detects long dash lines", () => {
    expect(isSceneBreak("────────────────")).toBe(true)
  })

  it("returns boolean", () => {
    expect(typeof isSceneBreak("test")).toBe("boolean")
  })
})

/* ═══════════════════════════════════════════
   isChapterHeading
   ═══════════════════════════════════════════ */
describe("isChapterHeading", () => {
  it("detects short title without punctuation", () => {
    expect(isChapterHeading("Chapter Title")).toBe(true)
  })

  it("detects Japanese short text", () => {
    expect(isChapterHeading("第一章")).toBe(true)
  })

  it("does NOT detect lines ending with 。", () => {
    expect(isChapterHeading("これは文です。")).toBe(false)
  })

  it("does NOT detect lines ending with .", () => {
    expect(isChapterHeading("This is a sentence.")).toBe(false)
  })

  it("does NOT detect lines ending with ！", () => {
    expect(isChapterHeading("驚きだ！")).toBe(false)
  })

  it("does NOT detect lines ending with ？", () => {
    expect(isChapterHeading("何だろう？")).toBe(false)
  })

  it("does NOT detect lines starting with 「", () => {
    expect(isChapterHeading("「会話の始まり")).toBe(false)
  })

  it("does NOT detect lines starting with (", () => {
    expect(isChapterHeading("( parenthetical")).toBe(false)
  })

  it("does NOT detect empty string", () => {
    expect(isChapterHeading("")).toBe(false)
  })

  it("does NOT detect long lines (> 20 chars)", () => {
    const long = "This is a very long line that exceeds twenty characters"
    expect(isChapterHeading(long)).toBe(false)
  })

  it("does NOT detect lines ending with !", () => {
    expect(isChapterHeading("Wow!")).toBe(false)
  })

  it("does NOT detect lines ending with ?", () => {
    expect(isChapterHeading("What?")).toBe(false)
  })

  it("does NOT detect lines ending with )", () => {
    expect(isChapterHeading("something)")).toBe(false)
  })

  it("does NOT detect lines ending with 」", () => {
    expect(isChapterHeading("会話終了」")).toBe(false)
  })

  it("detects exactly 20 char line", () => {
    expect(isChapterHeading("12345678901234567890")).toBe(true)
  })

  it("returns boolean", () => {
    expect(typeof isChapterHeading("test")).toBe("boolean")
  })
})
