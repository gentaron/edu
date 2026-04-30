/** Convert a small integer (1–10) to a Roman numeral. */
export function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]
  let result = ""
  for (const [value, numeral] of map) {
    while (n >= value) {
      result += numeral
      n -= value
    }
  }
  return result
}

/* ─── Detect scene breaks / section markers ─── */
export function isSceneBreak(text: string): boolean {
  const t = text.trim()
  return (
    t.startsWith("─") ||
    t.startsWith("━") ||
    t.startsWith("==") ||
    t.startsWith("**") ||
    t.startsWith("##") ||
    t.startsWith("＊") ||
    (t.length < 5 && !t.match(/[a-zA-Z\u3040-\u30ff\u4e00-\u9faf]/))
  )
}

/* ─── Detect chapter-like headings within text ─── */
export function isChapterHeading(text: string): boolean {
  const t = text.trim()
  // Very short lines (1-15 chars) that don't end with typical sentence punctuation
  return (
    t.length > 0 &&
    t.length <= 20 &&
    !t.endsWith("。") &&
    !t.endsWith(".") &&
    !t.endsWith("！") &&
    !t.endsWith("？") &&
    !t.endsWith("!") &&
    !t.endsWith("?") &&
    !t.endsWith("」") &&
    !t.endsWith("'") &&
    !t.endsWith('"') &&
    !t.endsWith(")") &&
    !t.startsWith("「") &&
    !t.startsWith('"') &&
    !t.startsWith("(") &&
    !t.startsWith("「") &&
    t !== ""
  )
}
