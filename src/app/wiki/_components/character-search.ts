export const normalizeCharacterName = (s: string) => s.normalize("NFKC").toLowerCase().replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s\p{P}\p{S}]/gu, "")
export function characterMatch(query: string, fields: (string | undefined)[]): number {
  const q = normalizeCharacterName(query)
  if (!q) return -1
  let score = -1
  for (const field of fields) {
    if (!field) continue
    const v = normalizeCharacterName(field)
    if (v === q) score = Math.max(score, 3)
    else if (v.startsWith(q)) score = Math.max(score, 2)
    else if (v.includes(q)) score = Math.max(score, 1)
  }
  return score
}
export const characterKey = (id: string) => Array.from(new TextEncoder().encode(id), b => b.toString(16).padStart(2, "0")).join("")
import { ASSET_ROOT } from "./portrait-design"
export async function fetchCharacterJSON<T>(path: string, validate: (value: T) => boolean): Promise<T> {
  const read = async (url: string) => {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error("HTTP " + res.status)
    const data = await res.json() as T & { schema?: number }
    if (!data || data.schema !== 3 || !validate(data)) throw new Error("Unexpected or outdated character data")
    return data
  }
  try { return await read(path) }
  catch {
    const key = path.replace(/^\/api\/characters\//, "")
    const data = await read(ASSET_ROOT + "/data/" + key + ".json")
    return { ...data, snapshot: true }
  }
}
