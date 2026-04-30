import type { WikiEntry } from "@/types"
import { WIKI_CHARACTERS } from "./characters"
import { WIKI_CHARACTERS_NEW } from "./characters-new"
import { WIKI_ORGANIZATIONS } from "./terminology-organizations"
import { WIKI_GEOGRAPHY } from "./terminology-geography"
import { WIKI_TECHNOLOGY } from "./terminology-technology"
import { WIKI_TERMS } from "./terminology-terms"
import { WIKI_HISTORY } from "./terminology-history"

export const ALL_ENTRIES: WikiEntry[] = [
  ...WIKI_CHARACTERS,
  ...WIKI_CHARACTERS_NEW,
  ...WIKI_ORGANIZATIONS,
  ...WIKI_GEOGRAPHY,
  ...WIKI_TECHNOLOGY,
  ...WIKI_TERMS,
  ...WIKI_HISTORY,
]

export { WIKI_CHARACTERS as CHARACTERS }
export type { Category, SourceLink, LeaderEntry, WikiEntry } from "@/types"
