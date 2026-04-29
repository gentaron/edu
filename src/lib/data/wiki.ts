import { ALL_ENTRIES } from "../wiki-data"
import type { WikiEntry } from "@/types"

export function getAllWikiEntries(): WikiEntry[] {
  return ALL_ENTRIES
}

export function getWikiEntryById(id: string): WikiEntry | undefined {
  return ALL_ENTRIES.find((entry) => entry.id === id)
}

export function getWikiEntriesByCategory(category: string): WikiEntry[] {
  return ALL_ENTRIES.filter((entry) => entry.category === category)
}

export function searchWikiEntries(query: string): WikiEntry[] {
  const q = query.toLowerCase()
  return ALL_ENTRIES.filter(
    (entry) =>
      entry.name.toLowerCase().includes(q) ||
      (entry.nameEn && entry.nameEn.toLowerCase().includes(q)) ||
      entry.description.toLowerCase().includes(q)
  )
}
