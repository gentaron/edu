import { describe, it, expect } from "vitest";
import {
  compressContext,
  compressWikiEntries,
  getCompressionRatio,
} from "@/platform/context-compressor";
import type { CompressedBlock } from "@/platform/context-compressor";

describe("platform/context-compressor", () => {
  describe("compressContext", () => {
    it("produces a valid CompressedBlock with correct metadata", () => {
      const text =
        "Diana Lightshield is a legendary guardian from the planet Granbell. " +
        "She wields the Shield of Auralis to protect the E16 star system. " +
        "Her abilities include healing and defensive maneuvers.";

      const block = compressContext("diana", text);

      expect(block.id).toBe("diana");
      expect(block.originalSize).toBe(text.length);
      expect(block.hash).toBeTruthy();
      expect(block.summary.length).toBeGreaterThan(0);
      expect(block.keywords.length).toBeGreaterThan(0);
      expect(block.entityRefs.length).toBeGreaterThan(0);
      expect(block.compressedAt).toBeGreaterThan(0);
    });

    it("extracts named entities from the text", () => {
      const text =
        "Diana Lightshield traveled from Granbell to Elyseon. The Shield of Auralis was her weapon.";

      const block = compressContext("test-entity", text);

      expect(block.entityRefs).toContain("Diana Lightshield");
      expect(block.entityRefs).toContain("Granbell");
    });

    it("generates shorter summary than original text", () => {
      const longText = Array.from({ length: 100 }, (_, i) =>
        `Sentence number ${i} provides additional context about the universe.`,
      ).join(" ");

      const block = compressContext("long-entry", longText);

      expect(block.summary.length).toBeLessThan(block.originalSize);
    });
  });

  describe("compressWikiEntries", () => {
    it("batch compresses multiple entries preserving order", () => {
      const entries = [
        { id: "entry-a", content: "Alpha is the first letter." },
        { id: "entry-b", content: "Beta is the second letter." },
        { id: "entry-c", content: "Gamma is the third letter." },
      ];

      const blocks = compressWikiEntries(entries);

      expect(blocks).toHaveLength(3);
      expect(blocks[0]?.id).toBe("entry-a");
      expect(blocks[1]?.id).toBe("entry-b");
      expect(blocks[2]?.id).toBe("entry-c");
    });
  });

  describe("getCompressionRatio", () => {
    it("returns 0 when original size is 0", () => {
      const block: CompressedBlock = {
        id: "empty",
        hash: "0",
        originalSize: 0,
        compressedSize: 0,
        summary: "",
        keywords: [],
        entityRefs: [],
        compressedAt: Date.now(),
      };

      expect(getCompressionRatio(block)).toBe(0);
    });

    it("returns positive ratio when compressed is smaller", () => {
      const block: CompressedBlock = {
        id: "ratio-test",
        hash: "1a2b3c",
        originalSize: 1000,
        compressedSize: 100,
        summary: "Short summary.",
        keywords: ["test"],
        entityRefs: ["Test"],
        compressedAt: Date.now(),
      };

      const ratio = getCompressionRatio(block);
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
    });
  });
});
