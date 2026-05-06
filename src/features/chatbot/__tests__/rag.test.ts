import { describe, it, expect } from "vitest"
import {
  decodeBase64ToFloat32,
  encodeFloat32ToBase64,
  cosineSimilarity,
  searchCorpus,
  buildRAGPrompt,
} from "../engine/rag"
import type { RetrievedChunk } from "../engine/types"
import tinyCorpus from "./fixtures/tiny-corpus.json"

describe("chatbot/engine/rag", () => {
  describe("decodeBase64ToFloat32", () => {
    it("decodes a base64 string to Float32Array", () => {
      const original = new Float32Array([1, 2, 3, 4])
      const encoded = encodeFloat32ToBase64(original)
      const decoded = decodeBase64ToFloat32(encoded)
      expect(decoded).toBeInstanceOf(Float32Array)
      expect(decoded.length).toBe(4)
      expect([...decoded]).toEqual([1, 2, 3, 4])
    })

    it("round-trips correctly for various values", () => {
      const cases = [
        new Float32Array([0, 0, 0]),
        new Float32Array([-1, 0, 1]),
        new Float32Array([0.5, -0.3, 0.1, 999, -999]),
        new Float32Array([1, 1, 1]),
      ]
      for (const original of cases) {
        const encoded = encodeFloat32ToBase64(original)
        const decoded = decodeBase64ToFloat32(encoded)
        expect([...decoded]).toEqual([...original])
      }
    })
  })

  describe("encodeFloat32ToBase64", () => {
    it("produces a valid base64 string", () => {
      const result = encodeFloat32ToBase64(new Float32Array([1, 2, 3]))
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
      // Should be valid base64
      expect(() => atob(result)).not.toThrow()
    })
  })

  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      const v = new Float32Array([1, 2, 3])
      expect(cosineSimilarity(v, v)).toBeCloseTo(1, 10)
    })

    it("returns 0 for orthogonal vectors", () => {
      const a = new Float32Array([1, 0, 0])
      const b = new Float32Array([0, 1, 0])
      expect(cosineSimilarity(a, b)).toBeCloseTo(0, 10)
    })

    it("returns -1 for opposite vectors", () => {
      const a = new Float32Array([1, 0])
      const b = new Float32Array([-1, 0])
      expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 10)
    })

    it("computes correct similarity for known values", () => {
      const a = new Float32Array([0, 1, 0])
      const b = new Float32Array([0, 1, 1])
      // cos = (0*0 + 1*1 + 0*1) / (1 * sqrt(2)) = 1/sqrt(2)
      expect(cosineSimilarity(a, b)).toBeCloseTo(1 / Math.sqrt(2), 10)
    })

    it("returns 0 for zero vectors", () => {
      const a = new Float32Array([0, 0])
      const b = new Float32Array([1, 1])
      expect(cosineSimilarity(a, b)).toBe(0)
    })

    it("throws on dimension mismatch", () => {
      const a = new Float32Array([1, 2])
      const b = new Float32Array([1, 2, 3])
      expect(() => cosineSimilarity(a, b)).toThrow("Dimension mismatch")
    })
  })

  describe("searchCorpus", () => {
    const corpusEmbeddings = tinyCorpus.chunks.map((chunk) => ({
      id: chunk.id,
      embedding: decodeBase64ToFloat32(chunk.embedding),
    }))

    const chunkTexts = new Map<string, string>()
    const chunkMetadatas = new Map<string, RetrievedChunk["metadata"]>()

    for (const chunk of tinyCorpus.chunks) {
      chunkTexts.set(chunk.id, chunk.text)
      chunkMetadatas.set(chunk.id, chunk.metadata as RetrievedChunk["metadata"])
    }

    it("returns top-K results sorted by descending similarity", () => {
      // Query [0, 1, 0] — should match 0002 and 0003 equally (both ~0.707), then 0001 (~0.577), then 0004 (0)
      const query = new Float32Array([0, 1, 0])
      const results = searchCorpus(
        query,
        corpusEmbeddings,
        chunkTexts,
        chunkMetadatas,
        3,
      )

      expect(results).toHaveLength(3)
      // First two should have equal high scores
      expect(results[0]!.score).toBeCloseTo(1 / Math.sqrt(2), 5)
      expect(results[1]!.score).toBeCloseTo(1 / Math.sqrt(2), 5)
      // Third should be lower
      expect(results[2]!.score).toBeLessThan(results[0]!.score)
    })

    it("respects topK parameter", () => {
      const query = new Float32Array([1, 1, 1])
      const results = searchCorpus(
        query,
        corpusEmbeddings,
        chunkTexts,
        chunkMetadatas,
        2,
      )
      expect(results).toHaveLength(2)
    })

    it("includes text and metadata in results", () => {
      const query = new Float32Array([1, 1, 1])
      const results = searchCorpus(
        query,
        corpusEmbeddings,
        chunkTexts,
        chunkMetadatas,
        1,
      )
      expect(results[0]!.text).toBe(tinyCorpus.chunks[0]!.text)
      expect(results[0]!.metadata.kind).toBe("story")
      expect(results[0]!.metadata.headingPath).toEqual(["Project", "AURALIS"])
    })

    it("works with topK greater than corpus size", () => {
      const query = new Float32Array([0, 0, 0])
      const results = searchCorpus(
        query,
        corpusEmbeddings,
        chunkTexts,
        chunkMetadatas,
        100,
      )
      expect(results).toHaveLength(4) // all chunks
    })

    it("uses the tiny corpus fixture correctly", () => {
      // Query similar to "character" → should match Diana chunk best
      const query = new Float32Array([0, 0, 1])
      const results = searchCorpus(
        query,
        corpusEmbeddings,
        chunkTexts,
        chunkMetadatas,
        1,
      )
      // [0,0,1] is orthogonal to [1,1,1], similar to [0,1,1], orthogonal to [1,1,0], identical to [0,0,1]
      expect(results[0]!.id).toBe("0004")
      expect(results[0]!.text).toContain("card battle")
    })
  })

  describe("buildRAGPrompt", () => {
    const mockChunks: RetrievedChunk[] = [
      {
        id: "0001",
        text: "Diana is a light-wielder from EDU.",
        score: 0.95,
        metadata: {
          path: "test/chars.ts",
          headingPath: ["Characters", "Diana"],
          kind: "character",
          language: "en",
          hash: "abc",
        },
      },
      {
        id: "0002",
        text: "The E16 star system contains 16 linked stars.",
        score: 0.85,
        metadata: {
          path: "test/geo.ts",
          headingPath: ["Geography", "E16"],
          kind: "faction",
          language: "en",
          hash: "def",
        },
      },
    ]

    it("includes context passages with numbered references", () => {
      const prompt = buildRAGPrompt("Who is Diana?", mockChunks)
      expect(prompt).toContain("[1] Diana is a light-wielder from EDU.")
      expect(prompt).toContain("[2] The E16 star system contains 16 linked stars.")
    })

    it("includes the user question", () => {
      const prompt = buildRAGPrompt("Tell me about EDU", mockChunks)
      expect(prompt).toContain("Tell me about EDU")
    })

    it("includes system instructions", () => {
      const prompt = buildRAGPrompt("test", mockChunks)
      expect(prompt).toContain("EDU Universe lorekeeper")
      expect(prompt).toContain("Cite the passage number")
      expect(prompt).toContain("200 words")
      expect(prompt).toContain("Match the user's language")
    })

    it("includes correct top-K count in prompt", () => {
      const prompt = buildRAGPrompt("test", mockChunks)
      expect(prompt).toContain("top-2 retrieved passages")
    })

    it("handles empty chunks", () => {
      const prompt = buildRAGPrompt("test", [])
      expect(prompt).toContain("top-0 retrieved passages")
      expect(prompt).toContain("EDU Universe lorekeeper")
    })
  })
})
