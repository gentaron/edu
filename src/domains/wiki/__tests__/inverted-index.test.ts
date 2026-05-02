import { describe, it, expect, beforeEach } from "vitest"
import {
  bigramTokenize,
  wordTokenize,
  bm25Score,
  Trie,
  InvertedIndex,
  generateSnippet,
  type SearchDocument,
} from "@/domains/wiki/inverted-index"

/* ═══════════════════════════════════════════
   bigramTokenize
   ═══════════════════════════════════════════ */
describe("bigramTokenize", () => {
  it("returns empty array for empty string", () => {
    expect(bigramTokenize("")).toEqual([])
  })

  it("returns single char for 1-char string", () => {
    expect(bigramTokenize("A")).toEqual(["A"])
  })

  it("generates correct bigrams for ASCII", () => {
    expect(bigramTokenize("HELLO")).toEqual(["HE", "EL", "LL", "LO"])
  })

  it("uppercases input", () => {
    expect(bigramTokenize("hello")).toEqual(["HE", "EL", "LL", "LO"])
  })

  it("handles 2-char string", () => {
    expect(bigramTokenize("AB")).toEqual(["AB"])
  })

  it("handles Japanese characters", () => {
    const result = bigramTokenize("ディアナ")
    expect(result.length).toBeGreaterThan(0)
    // "ディアナ" has characters デ,ィ,ア,ナ (ディ = デ+ィ is 2 codepoints)
    // Bigrams: ["ディ", "ィア", "アナ"] or ["デ", "ィ", "ア", "ナ"] → pairs
    expect(result).toContain("アナ")
  })

  it("handles mixed case", () => {
    const result = bigramTokenize("HeLLo")
    expect(result).toEqual(["HE", "EL", "LL", "LO"])
  })

  it("handles special characters", () => {
    const result = bigramTokenize("A!B")
    expect(result).toEqual(["A!", "!B"])
  })

  it("returns array of strings", () => {
    const result = bigramTokenize("test")
    expect(Array.isArray(result)).toBe(true)
    for (const token of result) {
      expect(typeof token).toBe("string")
    }
  })
})

/* ═══════════════════════════════════════════
   wordTokenize
   ═══════════════════════════════════════════ */
describe("wordTokenize", () => {
  it("splits on whitespace", () => {
    expect(wordTokenize("hello world")).toEqual(["hello", "world"])
  })

  it("lowercases output", () => {
    expect(wordTokenize("HELLO")).toEqual(["hello"])
  })

  it("splits on punctuation", () => {
    expect(wordTokenize("hello, world!")).toEqual(["hello", "world"])
  })

  it("handles empty string", () => {
    expect(wordTokenize("")).toEqual([])
  })

  it("handles multiple spaces", () => {
    expect(wordTokenize("a  b   c")).toEqual(["a", "b", "c"])
  })

  it("handles single word", () => {
    expect(wordTokenize("hello")).toEqual(["hello"])
  })

  it("filters empty tokens", () => {
    expect(wordTokenize("  ")).toEqual([])
  })

  it("handles tabs and newlines", () => {
    expect(wordTokenize("a\tb\nc")).toEqual(["a", "b", "c"])
  })
})

/* ═══════════════════════════════════════════
   bm25Score
   ═══════════════════════════════════════════ */
describe("bm25Score", () => {
  it("returns a number", () => {
    const result = bm25Score(3, 5, 100, 20, 25)
    expect(typeof result).toBe("number")
  })

  it("returns 0 when totalDocs is 0", () => {
    expect(bm25Score(1, 1, 0, 10, 10)).toBe(0)
  })

  it("returns 0 when avgDocLength is 0", () => {
    expect(bm25Score(1, 1, 10, 10, 0)).toBe(0)
  })

  it("higher tf yields higher score", () => {
    const s1 = bm25Score(1, 5, 100, 20, 25)
    const s2 = bm25Score(10, 5, 100, 20, 25)
    expect(s2).toBeGreaterThan(s1)
  })

  it("higher df yields lower score (more common term)", () => {
    const s1 = bm25Score(3, 5, 100, 20, 25)
    const s2 = bm25Score(3, 50, 100, 20, 25)
    expect(s1).toBeGreaterThan(s2)
  })

  it("returns non-negative value", () => {
    expect(bm25Score(0, 100, 100, 10, 20)).toBeGreaterThanOrEqual(0)
  })

  it("is finite", () => {
    const result = bm25Score(1, 1, 1, 1, 1)
    expect(Number.isFinite(result)).toBe(true)
  })
})

/* ═══════════════════════════════════════════
   Trie
   ═══════════════════════════════════════════ */
describe("Trie", () => {
  let trie: Trie

  beforeEach(() => {
    trie = new Trie()
  })

  describe("insert + search", () => {
    it("inserts and finds a word", () => {
      trie.insert("hello", "doc1")
      expect(trie.search("hello")).toEqual(["doc1"])
    })

    it("returns empty for non-existent word", () => {
      expect(trie.search("nonexistent")).toEqual([])
    })

    it("returns empty for empty string", () => {
      expect(trie.search("")).toEqual([])
    })

    it("ignores empty word insert", () => {
      trie.insert("", "doc1")
      expect(trie.search("")).toEqual([])
    })

    it("inserts duplicate docIds only once", () => {
      trie.insert("hello", "doc1")
      trie.insert("hello", "doc1")
      expect(trie.search("hello")).toEqual(["doc1"])
    })

    it("stores multiple docIds per word", () => {
      trie.insert("test", "doc1")
      trie.insert("test", "doc2")
      const result = trie.search("test")
      expect(result).toContain("doc1")
      expect(result).toContain("doc2")
    })

    it("does not find prefix as exact match", () => {
      trie.insert("hello", "doc1")
      expect(trie.search("hel")).toEqual([])
    })

    it("handles unicode characters", () => {
      trie.insert("ディアナ", "wiki1")
      expect(trie.search("ディアナ")).toEqual(["wiki1"])
    })
  })

  describe("prefixSearch (searchPrefix)", () => {
    it("finds all words with prefix", () => {
      trie.insert("hello", "d1")
      trie.insert("help", "d2")
      trie.insert("hero", "d3")
      trie.insert("world", "d4")
      const results = trie.searchPrefix("he")
      expect(results.length).toBe(3)
    })

    it("returns empty for non-existent prefix", () => {
      expect(trie.searchPrefix("xyz")).toEqual([])
    })

    it("returns single match", () => {
      trie.insert("hello", "d1")
      const results = trie.searchPrefix("hello")
      expect(results.length).toBe(1)
      expect(results[0]!.word).toBe("hello")
    })
  })

  describe("getCompletions", () => {
    it("returns completions sorted by frequency", () => {
      trie.insert("abc", "d1")
      trie.insert("abc", "d2")
      trie.insert("abcd", "d3")
      trie.insert("abcde", "d4")
      const completions = trie.getCompletions("abc")
      expect(completions.length).toBeGreaterThan(0)
      expect(completions[0]).toBe("abc") // highest frequency
    })

    it("respects limit", () => {
      trie.insert("a1", "d1")
      trie.insert("a2", "d2")
      trie.insert("a3", "d3")
      trie.insert("a4", "d4")
      trie.insert("a5", "d5")
      const completions = trie.getCompletions("a", 2)
      expect(completions.length).toBeLessThanOrEqual(2)
    })

    it("returns empty for non-existent prefix", () => {
      expect(trie.getCompletions("zzz")).toEqual([])
    })
  })

  describe("getAllWords", () => {
    it("returns all inserted words", () => {
      trie.insert("hello", "d1")
      trie.insert("world", "d2")
      const words = trie.getAllWords()
      expect(words).toContain("hello")
      expect(words).toContain("world")
      expect(words).toHaveLength(2)
    })

    it("returns empty for empty trie", () => {
      expect(trie.getAllWords()).toEqual([])
    })
  })
})

/* ═══════════════════════════════════════════
   InvertedIndex
   ═══════════════════════════════════════════ */
describe("InvertedIndex", () => {
  let index: InvertedIndex

  const docs: SearchDocument[] = [
    {
      id: "d1",
      title: "Hello World",
      content: "This is a test document about hello",
      category: "test",
    },
    {
      id: "d2",
      title: "Goodbye World",
      content: "Another test document about goodbye",
      category: "test",
    },
    {
      id: "d3",
      title: "Hello Again",
      content: "Yet another document with hello in it",
      category: "other",
    },
  ]

  beforeEach(() => {
    index = new InvertedIndex()
    index.addDocuments(docs)
  })

  describe("build", () => {
    it("stores all documents", () => {
      expect(index.getDocumentCount()).toBe(3)
    })

    it("builds vocabulary", () => {
      expect(index.getVocabularySize()).toBeGreaterThan(0)
    })
  })

  describe("search", () => {
    it("finds matching documents", () => {
      const results = index.search("hello")
      expect(results.length).toBeGreaterThan(0)
    })

    it("returns documents with correct IDs", () => {
      const results = index.search("hello")
      const ids = results.map((r) => r.id)
      expect(ids).toContain("d1")
      expect(ids).toContain("d3")
    })

    it("returns empty for non-matching query", () => {
      // Use a truly unique token that won't match any bigrams in the corpus
      const results = index.search("zzzzqqqqxxxx")
      expect(results).toHaveLength(0)
    })

    it("returns empty for empty query", () => {
      const results = index.search("")
      expect(results).toHaveLength(0)
    })

    it("results have snippet", () => {
      const results = index.search("hello")
      for (const r of results) {
        expect(typeof r.snippet).toBe("string")
      }
    })

    it("supports category filter", () => {
      const results = index.search("hello", { category: "test" })
      for (const r of results) {
        expect(r.category).toBe("test")
      }
    })

    it("supports limit", () => {
      const results = index.search("document", { limit: 1 })
      expect(results.length).toBeLessThanOrEqual(1)
    })

    it("results sorted by score descending", () => {
      const results = index.search("document")
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score)
      }
    })
  })

  describe("addDocument", () => {
    it("adds a single document", () => {
      index.addDocument({ id: "d4", title: "New Doc", content: "new content" })
      expect(index.getDocumentCount()).toBe(4)
    })

    it("re-indexes existing document", () => {
      index.addDocument({ id: "d1", title: "Updated", content: "updated content" })
      expect(index.getDocumentCount()).toBe(3)
    })
  })

  describe("removeDocument", () => {
    it("removes a document", () => {
      index.removeDocument("d1")
      expect(index.getDocumentCount()).toBe(2)
    })

    it("ignores non-existent document", () => {
      index.removeDocument("nonexistent")
      expect(index.getDocumentCount()).toBe(3)
    })
  })

  describe("clear", () => {
    it("removes all documents", () => {
      index.clear()
      expect(index.getDocumentCount()).toBe(0)
      expect(index.getVocabularySize()).toBe(0)
    })
  })

  describe("getTermFrequency", () => {
    it("returns 0 for unknown term", () => {
      expect(index.getTermFrequency("nonexistent")).toBe(0)
    })

    it("returns positive for known term", () => {
      expect(index.getTermFrequency("hello")).toBeGreaterThan(0)
    })
  })

  describe("getDocumentFrequency", () => {
    it("returns 0 for unknown term", () => {
      expect(index.getDocumentFrequency("nonexistent")).toBe(0)
    })

    it("returns count of docs containing term", () => {
      const df = index.getDocumentFrequency("hello")
      expect(df).toBeGreaterThanOrEqual(1)
    })
  })
})

/* ═══════════════════════════════════════════
   generateSnippet
   ═══════════════════════════════════════════ */
describe("generateSnippet", () => {
  it("returns prefix of content for empty query", () => {
    const result = generateSnippet("Hello world this is a test", "")
    expect(result).toBeTruthy()
  })

  it("highlights matched text with <mark> tags", () => {
    const result = generateSnippet("The quick brown fox jumps", "brown fox")
    expect(result).toContain("<mark>")
    expect(result).toContain("</mark>")
  })

  it("returns content slice when no match", () => {
    const result = generateSnippet("Hello world this is a test", "zzz")
    expect(result).toBeTruthy()
    expect(result.length).toBeLessThanOrEqual(110) // ~100 + ellipsis
  })

  it("handles empty content", () => {
    const result = generateSnippet("", "test")
    expect(result).toBe("")
  })

  it("respects contextLength parameter", () => {
    const content = "A ".repeat(100)
    const result = generateSnippet(content, "A", 20)
    expect(result.length).toBeLessThan(40)
  })
})
