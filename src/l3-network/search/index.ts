/* ═══════════════════════════════════════════
   L3 NETWORK — Search Public API (deprecated)
   Re-exports from domains/wiki search.
   ═══════════════════════════════════════════ */

export { WikiSearchEngine } from "@/domains/wiki/wiki-search"
export type { WikiSearchOptions, AutocompleteSuggestion } from "@/domains/wiki/wiki-search"
export { InvertedIndex, Trie } from "@/domains/wiki/inverted-index"
export type {
  SearchDocument,
  SearchResult,
  SearchOptions,
  Posting,
  PostingList,
} from "@/domains/wiki/inverted-index"
export {
  bigramTokenize,
  wordTokenize,
  bm25Score,
  generateSnippet,
} from "@/domains/wiki/inverted-index"
