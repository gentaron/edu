/* ═══════════════════════════════════════════
   L3 NETWORK — Full-Text Search Engine
   Inverted index with BM25 ranking, bi-gram tokenization,
   word-level tokenization, snippet generation, and Trie-based autocomplete.
   ═══════════════════════════════════════════ */

// ─── Types ────────────────────────────────────────────────────────────────

export interface Posting {
  docId: string
  positions: number[]
  tf: number
}

export interface PostingList {
  token: string
  postings: Posting[]
  df: number
}

export interface SearchDocument {
  id: string
  title: string
  content: string
  category?: string
  weight?: number
}

export interface SearchResult {
  id: string
  score: number
  title: string
  snippet: string
  category?: string
}

export interface SearchOptions {
  limit?: number
  category?: string
  offset?: number
  minScore?: number
}

// ─── Tokenizers ───────────────────────────────────────────────────────────

/**
 * Bi-gram tokenizer for CJK / agglutinative text.
 * "HELLO" → ["HE", "EL", "LL", "LO"]
 * Handles empty string, single char, unicode.
 */
export function bigramTokenize(text: string): string[] {
  const normalized = text.toUpperCase()
  if (normalized.length === 0) {
    return []
  }
  if (normalized.length === 1) {
    return [normalized]
  }
  const grams: string[] = []
  // Use Array.from to correctly handle surrogate pairs (emoji, rare CJK)
  const chars = [...normalized]
  for (let i = 0; i < chars.length - 1; i++) {
    const a = chars[i] ?? ""
    const b = chars[i + 1] ?? ""
    grams.push(a + b)
  }
  return grams
}

/**
 * Word-level tokenizer for space-delimited text.
 * Splits on whitespace / punctuation, lowercases output.
 */
export function wordTokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\p{P}]+/u)
    .filter((t) => t.length > 0)
}

// ─── BM25 Scoring ────────────────────────────────────────────────────────

const DEFAULT_K1 = 1.2
const DEFAULT_B = 0.75

/**
 * Computes a single-term BM25 score contribution.
 *
 * score = IDF * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / avgdl))
 *
 * IDF  = log(1 + (N - df + 0.5) / (df + 0.5))
 */
export function bm25Score(
  tf: number,
  df: number,
  totalDocs: number,
  docLength: number,
  avgDocLength: number,
  k1: number = DEFAULT_K1,
  b: number = DEFAULT_B
): number {
  if (totalDocs === 0 || avgDocLength === 0) {
    return 0
  }

  const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5))
  const numerator = tf * (k1 + 1)
  const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength))

  return idf * (numerator / denominator)
}

// ─── Snippet Generation ──────────────────────────────────────────────────

const DEFAULT_CONTEXT_LENGTH = 100

/**
 * Extracts a window of text around the first match of the query,
 * wrapping matching portions in `<mark>` tags.
 */
export function generateSnippet(
  content: string,
  query: string,
  contextLength: number = DEFAULT_CONTEXT_LENGTH
): string {
  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery.length === 0 || content.length === 0) {
    return content.slice(0, contextLength)
  }

  // Try exact substring match first
  const matchIndex = lowerContent.indexOf(lowerQuery)

  if (matchIndex === -1) {
    // Fallback: try matching individual query words
    const queryWords = wordTokenize(query)
    if (queryWords.length === 0) {
      return content.slice(0, contextLength)
    }

    let bestIndex = -1
    for (const word of queryWords) {
      const idx = lowerContent.indexOf(word)
      if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
        bestIndex = idx
      }
    }

    if (bestIndex === -1) {
      return content.slice(0, contextLength)
    }

    // Highlight individual words
    return highlightWords(content, queryWords, bestIndex, contextLength)
  }

  // Calculate window boundaries
  const half = Math.floor(contextLength / 2)
  let start = matchIndex - half
  let end = matchIndex + lowerQuery.length + half

  if (start < 0) {
    start = 0
  }
  if (end > content.length) {
    end = content.length
  }

  // Adjust start to word boundary
  if (start > 0) {
    const spaceIdx = content.indexOf(" ", start)
    if (spaceIdx !== -1 && spaceIdx < start + 20) {
      start = spaceIdx + 1
    }
  }

  // Adjust end to word boundary
  if (end < content.length) {
    const spaceIdx = content.lastIndexOf(" ", end)
    if (spaceIdx !== -1 && spaceIdx > end - 20) {
      end = spaceIdx
    }
  }

  const snippet = content.slice(start, end)
  const prefix = start > 0 ? "..." : ""
  const suffix = end < content.length ? "..." : ""

  // Highlight the matched portion
  const localMatch = snippet.toLowerCase().indexOf(lowerQuery)
  if (localMatch === -1) {
    return prefix + snippet + suffix
  }

  const highlighted =
    snippet.slice(0, localMatch) +
    "<mark>" +
    snippet.slice(localMatch, localMatch + lowerQuery.length) +
    "</mark>" +
    snippet.slice(localMatch + lowerQuery.length)

  return prefix + highlighted + suffix
}

function highlightWords(
  content: string,
  words: string[],
  anchorIndex: number,
  contextLength: number
): string {
  const half = Math.floor(contextLength / 2)
  let start = anchorIndex - half
  let end = anchorIndex + half

  if (start < 0) {
    start = 0
  }
  if (end > content.length) {
    end = content.length
  }

  if (start > 0) {
    const spaceIdx = content.indexOf(" ", start)
    if (spaceIdx !== -1 && spaceIdx < start + 20) {
      start = spaceIdx + 1
    }
  }
  if (end < content.length) {
    const spaceIdx = content.lastIndexOf(" ", end)
    if (spaceIdx !== -1 && spaceIdx > end - 20) {
      end = spaceIdx
    }
  }

  const prefix = start > 0 ? "..." : ""
  const suffix = end < content.length ? "..." : ""
  let snippet = content.slice(start, end)

  // Sort words by length (longest first) to avoid partial replacements
  const sorted = [...words].sort((a, b) => b.length - a.length)
  for (const word of sorted) {
    const idx = snippet.toLowerCase().indexOf(word)
    if (idx !== -1) {
      snippet =
        snippet.slice(0, idx) +
        "<mark>" +
        snippet.slice(idx, idx + word.length) +
        "</mark>" +
        snippet.slice(idx + word.length)
    }
  }

  return prefix + snippet + suffix
}

// ─── Trie (Autocomplete) ────────────────────────────────────────────────

export class TrieNode {
  children: Map<string, TrieNode> = new Map()
  isEnd = false
  docIds: string[] = []
  frequency = 0
}

export class Trie {
  root: TrieNode = new TrieNode()

  /** Insert a word and associate it with a document. */
  insert(word: string, docId: string): void {
    if (word.length === 0) {
      return
    }
    const chars = [...word]
    let node = this.root

    for (const ch of chars) {
      let child = node.children.get(ch)
      if (!child) {
        child = new TrieNode()
        node.children.set(ch, child)
      }
      node = child
    }

    node.isEnd = true
    node.frequency++
    if (!node.docIds.includes(docId)) {
      node.docIds.push(docId)
    }
  }

  /** Exact-match lookup: returns the docIds associated with the word, or an empty array. */
  search(word: string): string[] {
    if (word.length === 0) {
      return []
    }
    const node = this._traverse(word)
    return node ? [...node.docIds] : []
  }

  /** Returns all completions for a given prefix, each with its associated docIds. */
  searchPrefix(prefix: string): Array<{ word: string; docIds: string[] }> {
    const startNode = this._traverse(prefix)
    if (!startNode) {
      return []
    }

    const results: Array<{ word: string; docIds: string[] }> = []
    this._collectAll(startNode, prefix, results)
    return results
  }

  /** Returns all words stored in the trie (for debugging). */
  getAllWords(): string[] {
    const results: string[] = []
    this._collectAllWords(this.root, "", results)
    return results
  }

  /**
   * Returns top completions for a prefix, ranked by frequency (descending).
   * Only returns words where `isEnd` is true.
   */
  getCompletions(prefix: string, limit = 10): string[] {
    const startNode = this._traverse(prefix)
    if (!startNode) {
      return []
    }

    const candidates: Array<{ word: string; frequency: number }> = []
    this._collectEndWords(startNode, prefix, candidates)

    // Sort by frequency descending, then alphabetically
    candidates.sort((a, b) => {
      if (b.frequency !== a.frequency) {
        return b.frequency - a.frequency
      }
      return a.word.localeCompare(b.word)
    })

    return candidates.slice(0, limit).map((c) => c.word)
  }

  // ── Private helpers ──────────────────────────────────────────────────

  private _traverse(prefix: string): TrieNode | null {
    const chars = [...prefix]
    let node = this.root
    for (const ch of chars) {
      const child = node.children.get(ch)
      if (!child) {
        return null
      }
      node = child
    }
    return node
  }

  private _collectAll(
    node: TrieNode,
    prefix: string,
    results: Array<{ word: string; docIds: string[] }>
  ): void {
    if (node.isEnd) {
      results.push({ word: prefix, docIds: [...node.docIds] })
    }
    for (const [ch, child] of node.children) {
      this._collectAll(child, prefix + ch, results)
    }
  }

  private _collectAllWords(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isEnd) {
      results.push(prefix)
    }
    for (const [ch, child] of node.children) {
      this._collectAllWords(child, prefix + ch, results)
    }
  }

  private _collectEndWords(
    node: TrieNode,
    prefix: string,
    results: Array<{ word: string; frequency: number }>
  ): void {
    if (node.isEnd) {
      results.push({ word: prefix, frequency: node.frequency })
    }
    for (const [ch, child] of node.children) {
      this._collectEndWords(child, prefix + ch, results)
    }
  }
}

// ─── Inverted Index ──────────────────────────────────────────────────────

export class InvertedIndex {
  private postings: Map<string, PostingList> = new Map()
  private documents: Map<string, SearchDocument> = new Map()
  private docLengths: Map<string, number> = new Map()
  private avgDocLength = 0
  private totalDocs = 0

  constructor() {}

  // ── Building ────────────────────────────────────────────────────────

  /** Index a single document. */
  addDocument(doc: SearchDocument): void {
    if (this.documents.has(doc.id)) {
      // Remove old data first to allow re-indexing
      this.removeDocument(doc.id)
    }

    this.documents.set(doc.id, doc)
    this.totalDocs++

    // Tokenize using both word and bi-gram tokenizers
    const wordTokens = wordTokenize(doc.title + " " + doc.content)
    const bigramTokens = bigramTokenize(doc.title + " " + doc.content)

    // Build position map for word tokens
    const wordPositionMap = new Map<string, number[]>()
    for (let i = 0; i < wordTokens.length; i++) {
      const token = wordTokens[i]!
      const positions = wordPositionMap.get(token)
      if (positions) {
        positions.push(i)
      } else {
        wordPositionMap.set(token, [i])
      }
    }

    // Build position map for bi-gram tokens
    const bigramPositionMap = new Map<string, number[]>()
    for (let i = 0; i < bigramTokens.length; i++) {
      const token = bigramTokens[i]!
      const positions = bigramPositionMap.get(token)
      if (positions) {
        positions.push(i)
      } else {
        bigramPositionMap.set(token, [i])
      }
    }

    // Index word tokens
    for (const [token, positions] of wordPositionMap) {
      this._addToPosting(token, doc.id, positions)
    }

    // Index bi-gram tokens
    for (const [token, positions] of bigramPositionMap) {
      this._addToPosting(token, doc.id, positions)
    }

    // Update average document length (using word token count as doc length)
    const docLen = wordTokens.length
    this.docLengths.set(doc.id, docLen)
    this._recalcAvgDocLength()
  }

  /** Index multiple documents at once. */
  addDocuments(docs: SearchDocument[]): void {
    for (const doc of docs) {
      this.addDocument(doc)
    }
  }

  /** Remove a document from the index by ID. */
  removeDocument(id: string): void {
    const doc = this.documents.get(id)
    if (!doc) {
      return
    }

    // Remove from all posting lists that reference this doc
    const tokensToRemove: string[] = []
    for (const [token, pl] of this.postings) {
      const _before = pl.postings.length
      pl.postings = pl.postings.filter((p) => p.docId !== id)
      pl.df = pl.postings.length
      if (pl.postings.length === 0) {
        tokensToRemove.push(token)
      }
    }

    for (const token of tokensToRemove) {
      this.postings.delete(token)
    }

    this.documents.delete(id)
    this.docLengths.delete(id)
    this.totalDocs--
    this._recalcAvgDocLength()
  }

  /** Clear the entire index. */
  clear(): void {
    this.postings.clear()
    this.documents.clear()
    this.docLengths.clear()
    this.avgDocLength = 0
    this.totalDocs = 0
  }

  // ── Searching ───────────────────────────────────────────────────────

  /**
   * Search the index using BM25 ranking.
   * Uses both word-level and bi-gram matching for best recall.
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const { limit = 20, category, offset = 0, minScore = 0 } = options

    if (query.trim().length === 0) {
      return []
    }

    const queryWords = wordTokenize(query)
    const queryBigrams = bigramTokenize(query)

    // Collect all unique query tokens (words + bigrams)
    const allTokens = new Set<string>([...queryWords, ...queryBigrams])

    // Accumulate BM25 scores per document
    const scores = new Map<string, number>()

    for (const token of allTokens) {
      const pl = this.postings.get(token)
      if (!pl) {
        continue
      }

      for (const posting of pl.postings) {
        const docId = posting.docId
        const doc = this.documents.get(docId)
        if (!doc) {
          continue
        }

        // Category filter
        if (category && doc.category !== category) {
          continue
        }

        const docLength = this.docLengths.get(docId) ?? 0
        const score = bm25Score(posting.tf, pl.df, this.totalDocs, docLength, this.avgDocLength)

        // Apply document weight boost
        const weight = doc.weight ?? 1
        const current = scores.get(docId) ?? 0
        scores.set(docId, current + score * weight)
      }
    }

    // Build results, sort by score descending
    const results: SearchResult[] = []
    for (const [docId, score] of scores) {
      if (score < minScore) {
        continue
      }

      const doc = this.documents.get(docId)
      if (!doc) {
        continue
      }

      results.push({
        id: docId,
        score,
        title: doc.title,
        snippet: generateSnippet(doc.content, query),
        category: doc.category,
      })
    }

    results.sort((a, b) => b.score - a.score)

    return results.slice(offset, offset + limit)
  }

  // ── Stats ───────────────────────────────────────────────────────────

  getDocumentCount(): number {
    return this.totalDocs
  }

  getVocabularySize(): number {
    return this.postings.size
  }

  /** Total occurrences of a term across all documents (sum of tfs). */
  getTermFrequency(term: string): number {
    const normalized = term.toLowerCase()
    const pl = this.postings.get(normalized)
    if (!pl) {
      return 0
    }
    return pl.postings.reduce((sum, p) => sum + p.tf, 0)
  }

  /** Number of documents containing the term. */
  getDocumentFrequency(term: string): number {
    const normalized = term.toLowerCase()
    const pl = this.postings.get(normalized)
    return pl?.df ?? 0
  }

  // ── Private helpers ─────────────────────────────────────────────────

  private _addToPosting(token: string, docId: string, positions: number[]): void {
    let pl = this.postings.get(token)
    if (!pl) {
      pl = { token, postings: [], df: 0 }
      this.postings.set(token, pl)
    }

    // Avoid duplicates if same doc added twice
    const existing = pl.postings.find((p) => p.docId === docId)
    if (existing) {
      existing.positions = positions
      existing.tf = positions.length
    } else {
      pl.postings.push({
        docId,
        positions,
        tf: positions.length,
      })
    }
    pl.df = pl.postings.length
  }

  private _recalcAvgDocLength(): void {
    if (this.totalDocs === 0) {
      this.avgDocLength = 0
      return
    }
    let total = 0
    for (const len of this.docLengths.values()) {
      total += len
    }
    this.avgDocLength = total / this.totalDocs
  }
}
