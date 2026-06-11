/* ═══════════════════════════════════════════
   Wiki Domain — Wiki Repository
   Data access layer for wiki entries.
   ═══════════════════════════════════════════ */

import {
  WIKI_CHARACTERS,
  WIKI_CHARACTERS_NEW,
  WIKI_ORGANIZATIONS,
  WIKI_GEOGRAPHY,
  WIKI_TECHNOLOGY,
  WIKI_TERMS,
  WIKI_HISTORY,
} from "./wiki.data"
import type { WikiId } from "@/platform/schemas/branded"
import type { WikiEntry, Category } from "@/types"

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
const entryById = new Map<WikiId, WikiEntry>()
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

/**
 * Wiki Repository — in-memory data access layer for wiki entries.
 * Provides O(1) lookups by ID and O(n) filtering by category or search query.
 * All data is loaded eagerly at module initialization time from the wiki data files.
 */
export const WikiRepository = {
  /**
   * Find a wiki entry by its unique ID.
   * Uses an in-memory Map for O(1) lookup.
   *
   * @param id - The unique identifier of the wiki entry (e.g. 'char-lin').
   * @returns The matching {@link WikiEntry}, or `undefined` if not found.
   * @example
   * const entry = WikiRepository.findById('char-lin')
   * // → { id: 'char-lin', name: 'リン', category: 'キャラクター', ... }
   */
  findById(id: WikiId): WikiEntry | undefined {
    return entryById.get(id)
  },

  /**
   * Get all wiki entries as a read-only array.
   * Entries come from all wiki source files (characters, organizations, geography, etc.).
   *
   * @returns Read-only array of all {@link WikiEntry} objects.
   */
  getAll(): readonly WikiEntry[] {
    return ALL_ENTRIES
  },

  /**
   * Find wiki entries belonging to a specific category.
   * Uses the pre-built in-memory category index for fast lookup.
   *
   * @param category - The Japanese category name (e.g. 'キャラクター', '組織', '地理').
   * @returns Read-only array of entries in the category, or empty array if category not found.
   * @example
   * const chars = WikiRepository.findByCategory('キャラクター')
   * // → [{ id: 'char-lin', ... }, { id: 'char-akira', ... }, ...]
   */
  findByCategory(category: Category): readonly WikiEntry[] {
    return entriesByCategory.get(category) ?? []
  },

  /**
   * Get all wiki entries grouped by category in display order.
   * Categories follow the predefined CATEGORY_ORDER for consistent UI rendering.
   *
   * @returns A Map where each key is a category name and value is the array of entries.
   *          Categories with zero entries are omitted.
   */
  getGroupedByCategory(): Map<Category, WikiEntry[]> {
    const grouped = new Map<Category, WikiEntry[]>()
    for (const cat of CATEGORY_ORDER) {
      const entries = entriesByCategory.get(cat)
      if (entries && entries.length > 0) {
        grouped.set(cat, entries)
      }
    }
    return grouped
  },

  /**
   * Get a summary of all categories with their entry counts.
   * Useful for rendering category navigation or overview pages.
   *
   * @returns Array of objects containing the category name, total entry count,
   *          and the entries themselves. Categories with zero entries are filtered out.
   */
  getCategorySummary(): Array<{ category: Category; count: number; entries: WikiEntry[] }> {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      count: entriesByCategory.get(cat)?.length ?? 0,
      entries: entriesByCategory.get(cat) ?? [],
    })).filter((s) => s.count > 0)
  },

  /**
   * Search wiki entries by partial text match.
   * Matches against the Japanese name (`name`), English name (`nameEn`),
   * and description field. Case-insensitive.
   *
   * @param query - The search string to match against entry fields.
   * @returns Array of matching entries. Empty array if no matches or empty query.
   * @example
   * const results = WikiRepository.search('lin')
   * // → [{ id: 'char-lin', name: 'リン', nameEn: 'Lin', ... }]
   */
  search(query: string): WikiEntry[] {
    const q = query.toLowerCase()
    return ALL_ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.nameEn && e.nameEn.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
    )
  },

  /**
   * Resolve wiki cross-references by checking that referenced IDs exist.
   * Used for validating links between wiki entries (e.g. "see also" references).
   *
   * @param ids - Array of wiki entry IDs to resolve.
   * @returns Array of resolution results indicating whether each ID exists,
   *          with the full entry attached if found.
   */
  resolveLinks(ids: WikiId[]): Array<{ id: WikiId; exists: boolean; entry?: WikiEntry }> {
    return ids.map((id) => {
      const entry = entryById.get(id)
      return { id, exists: !!entry, entry }
    })
  },

  /**
   * Total number of wiki entries across all categories.
   * Computed from the ALL_ENTRIES array length.
   *
   * @returns The total count of all wiki entries.
   */
  get totalCount(): number {
    return ALL_ENTRIES.length
  },
}

/**
 * Re-export of the combined wiki entries array for backward compatibility.
 * Prefer using {@link WikiRepository} methods for data access.
 */
export { ALL_ENTRIES }
