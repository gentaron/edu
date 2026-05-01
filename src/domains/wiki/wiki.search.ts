/* ═══════════════════════════════════════════
   Wiki Domain — Wiki Search Engine
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
} from "./wiki.data"
import { ALL_CARDS } from "@/lib/data"
import type { WikiEntry, GameCard } from "@/types"

// ─── Types ────────────────────────────────────────────────────────────────

export interface WikiSearchOptions extends SearchOptions {
  categories?: string[]
  includeCards?: boolean
}

export interface AutocompleteSuggestion {
  text: string
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

export class WikiSearchEngine {
  private index: InvertedIndex
  private _autocomplete: Trie
  private initialized = false
  private categorySet: Set<string> = new Set()

  constructor() {
    this.index = new InvertedIndex()
    this._autocomplete = new Trie()
  }

  /**
   * Build the index from wiki and (optionally) card data.
   * Call once at startup.
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
   * Search the wiki index.
   * Supports multi-category filtering and BM25 scoring.
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
   * Autocomplete: returns matching document titles grouped by category.
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
   * Return stats about the index.
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
