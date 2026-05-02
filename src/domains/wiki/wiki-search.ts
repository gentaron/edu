/* ═══════════════════════════════════════════
   L3 NETWORK — Wiki Search Engine
   Wiki-specific search that builds an inverted index
   from wiki data and card data, with category-aware
   boosting and autocomplete support.
   ═══════════════════════════════════════════ */

import { InvertedIndex, Trie } from "./inverted-index"
import type { SearchDocument, SearchResult, SearchOptions } from "./inverted-index"
import {
  WIKI_CHARACTERS,
  WIKI_CHARACTERS_NEW,
  WIKI_ORGANIZATIONS,
  WIKI_GEOGRAPHY,
  WIKI_TECHNOLOGY,
  WIKI_TERMS,
  WIKI_HISTORY,
} from "@/domains/wiki/wiki.data"
import { ALL_CARDS } from "@/lib/data"
import type { WikiEntry, GameCard } from "@/types"

// ─── Types ────────────────────────────────────────────────────────────────

/**
 * Search options specific to the wiki search engine.
 * Extends base {@link SearchOptions} with wiki-specific category filtering.
 */
export interface WikiSearchOptions extends SearchOptions {
  /** Restrict search to these category names (e.g. 'キャラクター', 'card') */
  categories?: string[]
  /** Whether to include card results in the search output (default: false) */
  includeCards?: boolean
}

/**
 * An autocomplete suggestion result containing the matching text and its category.
 */
export interface AutocompleteSuggestion {
  /** The matched term/text */
  text: string
  /** The category of the document (e.g. 'キャラクター', 'card', 'unknown') */
  category: string
}

// ─── Wiki Search Engine ──────────────────────────────────────────────────

/**
 * Category-specific weight boosts.
 * Characters are boosted highest for wiki-centric searches.
 */
const CATEGORY_WEIGHTS: Record<string, number> = {
  キャラクター: 1.3,
  用語: 1.1,
  組織: 1.1,
  地理: 1,
  技術: 1,
  歴史: 1,
  card: 0.9,
}

/**
 * Wiki-specific search engine that builds an inverted index from wiki data
 * and card data, with category-aware boosting and autocomplete support.
 *
 * Usage: call {@link initialize} once at startup, then use {@link search} and
 * {@link autocomplete} for querying. All methods are safe to call before
 * initialization — they will simply return empty results.
 */
export class WikiSearchEngine {
  private index: InvertedIndex
  private _autocomplete: Trie
  private initialized = false
  private categorySet: Set<string> = new Set()

  /**
   * Create a new WikiSearchEngine instance.
   * Does not index any data yet — call {@link initialize} first.
   */
  constructor() {
    this.index = new InvertedIndex()
    this._autocomplete = new Trie()
  }

  /**
   * Build the search index from wiki and card data.
   * Call once at startup. Subsequent calls are no-ops (idempotent).
   * Indexes both Japanese and English names for wiki entries, and card data
   * with flavor text and effects. Also builds the autocomplete trie.
   *
   * @returns A promise that resolves when indexing is complete.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    const allWiki: readonly WikiEntry[] = [
      ...WIKI_CHARACTERS,
      ...WIKI_CHARACTERS_NEW,
      ...WIKI_ORGANIZATIONS,
      ...WIKI_GEOGRAPHY,
      ...WIKI_TECHNOLOGY,
      ...WIKI_TERMS,
      ...WIKI_HISTORY,
    ]

    const wikiDocs: SearchDocument[] = allWiki.map((entry) => ({
      id: entry.id,
      title: `${entry.name}${entry.nameEn ? ` (${entry.nameEn})` : ""}`,
      content: entry.description,
      category: entry.category,
      weight: CATEGORY_WEIGHTS[entry.category] ?? 1,
    }))

    // Also add the English name as separate searchable content for wiki entries
    for (const entry of allWiki) {
      if (entry.nameEn) {
        wikiDocs.push({
          id: `__en__${entry.id}`,
          title: entry.nameEn,
          content: `${entry.nameEn} - ${entry.name}`,
          category: entry.category,
          weight: 0.8,
        })
      }
    }

    this.index.addDocuments(wikiDocs)

    // Index cards
    const cardDocs: SearchDocument[] = ALL_CARDS.map((card: GameCard) => ({
      id: `card:${card.id}`,
      title: card.name,
      content: `${card.flavorText} ${card.effect} ${card.ultimateName}`,
      category: "card",
      weight: CATEGORY_WEIGHTS["card"] ?? 0.9,
    }))

    this.index.addDocuments(cardDocs)

    // Build autocomplete trie from document titles and English names
    for (const entry of allWiki) {
      this._autocomplete.insert(entry.name, entry.id)
      this.categorySet.add(entry.category)
      if (entry.nameEn) {
        this._autocomplete.insert(entry.nameEn, entry.id)
      }
    }

    for (const card of ALL_CARDS) {
      this._autocomplete.insert(card.name, `card:${card.id}`)
      this.categorySet.add("card")
    }

    this.initialized = true
  }

  /**
   * Search the wiki index using BM25 scoring.
   * Supports multi-category filtering by running one search per category
   * and merging results. By default, card results are excluded unless
   * `includeCards` is set to true.
   *
   * @param query - The search query string.
   * @param options - Optional search configuration (categories, limit, offset, includeCards).
   * @returns Array of search results sorted by relevance score (descending).
   *          Empty array if not initialized or no matches found.
   */
  search(query: string, options: WikiSearchOptions = {}): SearchResult[] {
    if (!this.initialized) {
      return []
    }

    const { categories, includeCards = false, ...baseOptions } = options

    // When multiple categories specified, we run one search per category
    // and merge results, since InvertedIndex.search only supports a single category.
    if (categories && categories.length > 0) {
      const filteredCategories = includeCards ? categories : categories.filter((c) => c !== "card")

      const resultsMap = new Map<string, SearchResult>()

      for (const cat of filteredCategories) {
        const catResults = this.index.search(query, {
          ...baseOptions,
          category: cat,
        })
        for (const result of catResults) {
          const existing = resultsMap.get(result.id)
          if (!existing || result.score > existing.score) {
            resultsMap.set(result.id, result)
          }
        }
      }

      const merged = [...resultsMap.values()]
      merged.sort((a, b) => b.score - a.score)

      const offset = baseOptions.offset ?? 0
      const limit = baseOptions.limit ?? 20
      return merged.slice(offset, offset + limit)
    }

    // Default: exclude cards unless explicitly included
    if (!includeCards) {
      const allResults = this.index.search(query, baseOptions)
      return allResults.filter((r) => r.category !== "card")
    }

    return this.index.search(query, baseOptions)
  }

  /**
   * Get autocomplete suggestions matching a prefix string.
   * Returns matching document titles from the trie, with categories resolved.
   * Deduplicates by word+docId combination.
   *
   * @param prefix - The text prefix to match against indexed terms.
   * @param limit - Maximum number of suggestions to return (default 10).
   * @returns Array of suggestions with text and category. Empty if not initialized or empty prefix.
   */
  autocomplete(prefix: string, limit = 10): AutocompleteSuggestion[] {
    if (!this.initialized || prefix.trim().length === 0) {
      return []
    }

    const completions = this._autocomplete.getCompletions(prefix, limit * 2)
    const suggestions: AutocompleteSuggestion[] = []
    const seen = new Set<string>()

    for (const word of completions) {
      if (suggestions.length >= limit) {
        break
      }

      // Determine category from the docId
      const docIds = this._autocomplete.search(word)
      for (const docId of docIds) {
        const key = `${word}:${docId}`
        if (seen.has(key)) {
          continue
        }
        seen.add(key)

        let category = "unknown"
        if (docId.startsWith("card:")) {
          category = "card"
        } else if (docId.startsWith("__en__")) {
          // Use the original entry's category
          const originalId = docId.slice(6)
          const doc = this._findWikiCategory(originalId)
          if (doc) {
            category = doc
          }
        } else {
          const cat = this._findWikiCategory(docId)
          if (cat) {
            category = cat
          }
        }

        suggestions.push({ text: word, category })
        if (suggestions.length >= limit) {
          break
        }
      }
    }

    return suggestions
  }

  /**
   * Return statistics about the search index.
   * Useful for debugging and monitoring index health.
   *
   * @returns An object containing document count, vocabulary size (terms),
   *          and the sorted list of indexed categories.
   */
  getStats(): { documents: number; terms: number; categories: string[] } {
    return {
      documents: this.index.getDocumentCount(),
      terms: this.index.getVocabularySize(),
      categories: [...this.categorySet].sort(),
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────

  private _findWikiCategory(docId: string): string | null {
    // Search across all wiki arrays for the docId
    const allEntries = [
      ...WIKI_CHARACTERS,
      ...WIKI_CHARACTERS_NEW,
      ...WIKI_ORGANIZATIONS,
      ...WIKI_GEOGRAPHY,
      ...WIKI_TECHNOLOGY,
      ...WIKI_TERMS,
      ...WIKI_HISTORY,
    ] as const

    for (const entry of allEntries) {
      if (entry.id === docId) {
        return entry.category
      }
    }

    return null
  }
}
