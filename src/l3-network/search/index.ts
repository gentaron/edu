/* ═══════════════════════════════════════════
   L3 NETWORK — Search Public API
   ═══════════════════════════════════════════ */

export { WikiSearchEngine } from "./wiki-search"
export type { WikiSearchOptions, AutocompleteSuggestion } from "./wiki-search"
export { InvertedIndex, Trie } from "./inverted-index"
export type {
  SearchDocument,
  SearchResult,
  SearchOptions,
  Posting,
  PostingList,
} from "./inverted-index"
export { bigramTokenize, wordTokenize, bm25Score, generateSnippet } from "./inverted-index"
