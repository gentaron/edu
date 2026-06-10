import { describe, it, expect, beforeEach } from "vitest";
import { vectorStore, cosineSimilarity } from "@/platform/vector-store";
import type { VectorRecord, VectorSearchQuery } from "@/platform/vector-store";

describe("vectorStore", () => {
  beforeEach(() => {
    vectorStore.clear();
  });

  /* ── upsert + search ── */
  describe("upsert and search", () => {
    it("stores a record and retrieves it by id", () => {
      const record: VectorRecord = {
        id: "vec-1",
        embedding: [1, 0, 0],
        metadata: { source: "wiki" },
        createdAt: Date.now(),
      };
      vectorStore.upsert(record);
      const got = vectorStore.get("vec-1");
      expect(got).toBeDefined();
      expect(got!.id).toBe("vec-1");
    });

    it("search returns results ranked by cosine similarity", () => {
      vectorStore.upsert({
        id: "similar",
        embedding: [1, 0, 0],
        metadata: {},
        createdAt: 1,
      });
      vectorStore.upsert({
        id: "different",
        embedding: [0, 1, 0],
        metadata: {},
        createdAt: 1,
      });

      const query: VectorSearchQuery = { vector: [1, 0, 0], topK: 10 };
      const results = vectorStore.search(query);

      expect(results).toHaveLength(2);
      expect(results[0]!.id).toBe("similar");
      expect(results[0]!.score).toBeGreaterThan(results[1]!.score);
    });

    it("overwrites on duplicate upsert", () => {
      vectorStore.upsert({
        id: "vec-1",
        embedding: [1, 0],
        metadata: { version: "v1" },
        createdAt: 100,
      });
      vectorStore.upsert({
        id: "vec-1",
        embedding: [0, 1],
        metadata: { version: "v2" },
        createdAt: 200,
      });

      expect(vectorStore.size()).toBe(1);
      const got = vectorStore.get("vec-1");
      expect(got!.metadata.version).toBe("v2");
    });
  });

  /* ── metadata filtering ── */
  describe("metadata filtering", () => {
    it("filters results by metadata key-value pairs", () => {
      vectorStore.upsert({
        id: "char-a",
        embedding: [1, 0],
        metadata: { domain: "wiki", type: "character" },
        createdAt: 1,
      });
      vectorStore.upsert({
        id: "char-b",
        embedding: [1, 0],
        metadata: { domain: "story", type: "character" },
        createdAt: 1,
      });

      const query: VectorSearchQuery = {
        vector: [1, 0],
        topK: 10,
        filter: { domain: "wiki" },
      };
      const results = vectorStore.search(query);

      expect(results).toHaveLength(1);
      expect(results[0]!.id).toBe("char-a");
    });

    it("returns empty when no records match filter", () => {
      vectorStore.upsert({
        id: "char-a",
        embedding: [1, 0],
        metadata: { domain: "wiki" },
        createdAt: 1,
      });

      const query: VectorSearchQuery = {
        vector: [1, 0],
        topK: 10,
        filter: { domain: "battle" },
      };
      const results = vectorStore.search(query);
      expect(results).toHaveLength(0);
    });
  });

  /* ── batch operations ── */
  describe("batch operations", () => {
    it("upsertBatch inserts multiple records", () => {
      const records: readonly VectorRecord[] = [
        { id: "batch-1", embedding: [1, 0], metadata: {}, createdAt: 1 },
        { id: "batch-2", embedding: [0, 1], metadata: {}, createdAt: 1 },
        { id: "batch-3", embedding: [1, 1], metadata: {}, createdAt: 1 },
      ];
      vectorStore.upsertBatch(records);
      expect(vectorStore.size()).toBe(3);
    });

    it("delete removes a record", () => {
      vectorStore.upsert({
        id: "del-me",
        embedding: [1, 0],
        metadata: {},
        createdAt: 1,
      });
      expect(vectorStore.size()).toBe(1);
      const removed = vectorStore.delete("del-me");
      expect(removed).toBe(true);
      expect(vectorStore.size()).toBe(0);
    });

    it("delete returns false for nonexistent id", () => {
      const removed = vectorStore.delete("nope");
      expect(removed).toBe(false);
    });
  });

  /* ── cosineSimilarity (exported helper) ── */
  describe("cosineSimilarity", () => {
    it("returns 1 for identical unit vectors", () => {
      expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1);
    });

    it("returns 0 for orthogonal vectors", () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    });
  });
});