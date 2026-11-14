import { ALL_ENTRIES } from "./wiki.data"

export interface WikiIndexEntry {
  id: string
  name: string
  nameEn: string | null
  category: string
  url: string
}

/** Public wiki discovery metadata only. Descriptions and draft working data stay out. */
export function buildWikiIndex(): WikiIndexEntry[] {
  return ALL_ENTRIES.map((entry) => ({
    id: entry.id,
    name: entry.name,
    nameEn: entry.nameEn || null,
    category: entry.category,
    url: `/wiki/${encodeURIComponent(entry.id)}`,
  })).sort((a, b) => a.id.localeCompare(b.id))
}
