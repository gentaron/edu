import { describe, it, expect } from "vitest";
import {
  cosineSimilarity,
  pseudoEmbed,
  semanticSearch,
  buildEmbeddingIndex,
} from "@/domains/wiki/wiki-semantic-search";
import type { WikiEntry } from "@/types/wiki";
import type { WikiId } from "@/platform/schemas/branded";

/** Helper to create test wiki entries with branded IDs */
const makeEntry = (id: string, name: string, description: string, category: WikiEntry["category"]): WikiEntry => ({
  id: id as WikiId,
  name,
  category,
  description,
});

describe("wiki-semantic-search", () => {
  /* ── cosineSimilarity ── */
  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      const v = [1, 0, 0];
      expect(cosineSimilarity(v, v)).toBe(1);
    });

    it("returns 0 for orthogonal vectors", () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    });

    it("returns 0 for vectors of different lengths", () => {
      expect(cosineSimilarity([1, 2, 3], [1, 2])).toBe(0);
    });

    it("returns 0 for zero vectors", () => {
      expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
    });

    it("returns value between 0 and 1 for similar vectors", () => {
      const score = cosineSimilarity([1, 1, 0], [1, 0, 0]);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  /* ── pseudoEmbed ── */
  describe("pseudoEmbed", () => {
    it("returns a vector of the requested dimensionality", () => {
      const vec = pseudoEmbed("hello world", 64);
      expect(vec).toHaveLength(64);
    });

    it("normalizes the output vector to unit length", () => {
      const vec = pseudoEmbed("some text with several words", 128);
      const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
      expect(norm).toBeCloseTo(1, 10);
    });

    it("returns zero vector for empty string", () => {
      const vec = pseudoEmbed("", 32);
      const allZero = vec.every((v) => v === 0);
      expect(allZero).toBe(true);
    });
  });

  /* ── semanticSearch ── */
  describe("semanticSearch", () => {
    const entries: readonly WikiEntry[] = [
      makeEntry("char-diana", "Diana", "Light shield warrior of Elyseon", "キャラクター"),
      makeEntry("char-ronan", "Ronan", "Centaur laser knight from Granbell", "キャラクター"),
      makeEntry("term-auralis", "Auralis", "The resonant frequency dimension", "用語"),
    ];

    it("returns ranked results sorted by score descending", () => {
      const index = buildEmbeddingIndex(entries);
      const results = semanticSearch("Diana", index, entries);
      expect(results.length).toBeGreaterThan(0);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
      }
    });

    it("returns entries with matchType semantic", () => {
      const index = buildEmbeddingIndex(entries);
      const results = semanticSearch("light", index, entries);
      for (const r of results) {
        expect(r.matchType).toBe("semantic");
      }
    });

    it("respects the limit parameter", () => {
      const index = buildEmbeddingIndex(entries);
      const results = semanticSearch("warrior", index, entries, 1);
      expect(results.length).toBeLessThanOrEqual(1);
    });
  });
});