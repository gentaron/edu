/* ═══════════════════════════════════════════
   Wiki Domain — Data Layer
   All wiki entries re-exported from individual data files.
   ═══════════════════════════════════════════ */

export { WIKI_CHARACTERS } from "./characters.data"
export { WIKI_CHARACTERS_NEW } from "./characters-new.data"
export { WIKI_ORGANIZATIONS } from "./organizations.data"
export { WIKI_GEOGRAPHY } from "./geography.data"
export { WIKI_TECHNOLOGY } from "./technology.data"
export { WIKI_TERMS } from "./terms.data"
export { WIKI_HISTORY } from "./history.data"

// Re-export types for backward compatibility
export type { Category, SourceLink, LeaderEntry } from "@/types"
