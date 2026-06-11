/* ═══════════════════════════════════════════
   Wiki Domain — Data Layer
   All wiki entries re-exported from individual data files.
   ═══════════════════════════════════════════ */

import type { WikiEntry } from "@/types"
import { WIKI_CHARACTERS } from "./characters.data"
import { WIKI_CHARACTERS_NEW } from "./characters-new.data"
import { WIKI_ORGANIZATIONS } from "./organizations.data"
import { WIKI_GEOGRAPHY } from "./geography.data"
import { WIKI_TECHNOLOGY } from "./technology.data"
import { WIKI_TERMS } from "./terms.data"
import { WIKI_HISTORY } from "./history.data"

/** Combined wiki entries from all source files */
export const ALL_ENTRIES: WikiEntry[] = [
  ...WIKI_CHARACTERS,
  ...WIKI_CHARACTERS_NEW,
  ...WIKI_ORGANIZATIONS,
  ...WIKI_GEOGRAPHY,
  ...WIKI_TECHNOLOGY,
  ...WIKI_TERMS,
  ...WIKI_HISTORY,
]

// Re-export types for backward compatibility
export type { Category, SourceLink, LeaderEntry } from "@/types"

export { WIKI_CHARACTERS } from "./characters.data"
export { WIKI_CHARACTERS_NEW } from "./characters-new.data"
export { WIKI_ORGANIZATIONS } from "./organizations.data"
export { WIKI_GEOGRAPHY } from "./geography.data"
export { WIKI_TECHNOLOGY } from "./technology.data"
export { WIKI_TERMS } from "./terms.data"
export { WIKI_HISTORY } from "./history.data"
