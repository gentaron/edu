/* ═══════════════════════════════════════════
   L3 NETWORK — Wiki Repository
   Data access layer for wiki entries.
   Depends on: L2 schemas, L1 wiki data
   ═══════════════════════════════════════════ */

import {
  WIKI_CHARACTERS,
  WIKI_CHARACTERS_NEW,
  WIKI_ORGANIZATIONS,
  WIKI_GEOGRAPHY,
  WIKI_TECHNOLOGY,
  WIKI_TERMS,
  WIKI_HISTORY,
} from "@/l1-physical/wiki"
import type { WikiEntry, Category } from "@/l2-datalink"

/** Combined wiki entries from all source files */
const ALL_ENTRIES: WikiEntry[] = [
  ...WIKI_CHARACTERS,
  ...WIKI_CHARACTERS_NEW,
  ...WIKI_ORGANIZATIONS,
  ...WIKI_GEOGRAPHY,
  ...WIKI_TECHNOLOGY,
  ...WIKI_TERMS,
  ...WIKI_HISTORY,
]

/** Category display order */
const CATEGORY_ORDER: Category[] = ["キャラクター", "組織", "地理", "技術", "用語", "歴史"]

/** In-memory index for fast lookups */
const entryById = new Map<string, WikiEntry>()
const entriesByCategory = new Map<Category, WikiEntry[]>()

for (const entry of ALL_ENTRIES) {
  entryById.set(entry.id, entry)
  const existing = entriesByCategory.get(entry.category)
  if (existing) {
    existing.push(entry)
  } else {
    entriesByCategory.set(entry.category, [entry])
  }
}

export class WikiRepository {
  /** Find a wiki entry by its ID */
  static findById(id: string): WikiEntry | undefined {
    return entryById.get(id)
  }

  /** Get all wiki entries */
  static getAll(): readonly WikiEntry[] {
    return ALL_ENTRIES
  }

  /** Find entries by category (sorted by category display order) */
  static findByCategory(category: Category): readonly WikiEntry[] {
    return entriesByCategory.get(category) ?? []
  }

  /** Get entries grouped by category */
  static getGroupedByCategory(): Map<Category, WikiEntry[]> {
    const grouped = new Map<Category, WikiEntry[]>()
    for (const cat of CATEGORY_ORDER) {
      const entries = entriesByCategory.get(cat)
      if (entries && entries.length > 0) {
        grouped.set(cat, entries)
      }
    }
    return grouped
  }

  /** Get category summary with counts */
  static getCategorySummary(): Array<{ category: Category; count: number; entries: WikiEntry[] }> {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      count: entriesByCategory.get(cat)?.length ?? 0,
      entries: entriesByCategory.get(cat) ?? [],
    })).filter((s) => s.count > 0)
  }

  /** Search entries by name (partial match, both JA and EN) */
  static search(query: string): WikiEntry[] {
    const q = query.toLowerCase()
    return ALL_ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
    )
  }

  /** Resolve wiki links — check that referenced IDs exist */
  static resolveLinks(ids: string[]): Array<{ id: string; exists: boolean; entry?: WikiEntry }> {
    return ids.map((id) => {
      const entry = entryById.get(id)
      return { id, exists: !!entry, entry }
    })
  }

  /** Total count of all entries */
  static get totalCount(): number {
    return ALL_ENTRIES.length
  }
}

/** Re-export for backward compatibility */
export { ALL_ENTRIES }
