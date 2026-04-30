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

export { WIKI_CHARACTERS }
export { WIKI_CHARACTERS_NEW }
export { WIKI_ORGANIZATIONS }
export { WIKI_GEOGRAPHY }
export { WIKI_TECHNOLOGY }
export { WIKI_TERMS }
export { WIKI_HISTORY }

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
