import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hybridRAGQuery } from "../rag-fallback";
import type { RAGResponse, RAGQuery } from "../rag-fallback";

const BASE_QUERY: RAGQuery = {
  question: "Who is Diana Lightshield?",
  context: ["Diana is a legendary guardian."],
};

describe("metal/webgpu/rag-fallback", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubEnv("MINIMAX_API_KEY", "test-minimax-key");
    vi.stubEnv("NVIDIA_API_KEY", "test-nvidia-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("returns Tier 1 response when confidence >= .8", async () => {
    const tier1: RAGResponse = {
      content: "Tier 1 answer",
      tier: 1,
      confidence: .9,
      sources: ["local-wiki"],
      isFallback: false,
    };

    // Fetch should NOT be called since Tier 1 is sufficient
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "Tier 2 answer" } }],
        }),
    });
    globalThis.fetch = mockFetch;

    const result = await hybridRAGQuery(tier1, BASE_QUERY);

    expect(result.content).toBe("Tier 1 answer");
    expect(result.tier).toBe(1);
    expect(result.isFallback).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("falls back to Tier 2 MiniMax when Tier 1 confidence < .8", async () => {
    const tier1: RAGResponse = {
      content: "Low confidence answer",
      tier: 1,
      confidence: .5,
      sources: [],
      isFallback: false,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: "MiniMax fallback answer" } }],
        }),
    });
    globalThis.fetch = mockFetch;

    const result = await hybridRAGQuery(tier1, BASE_QUERY);

    expect(result.content).toBe("MiniMax fallback answer");
    expect(result.tier).toBe(2);
    expect(result.isFallback).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("returns degraded Tier 1 response when all tiers fail", async () => {
    const tier1: RAGResponse = {
      content: "Degraded local answer",
      tier: 1,
      confidence: .3,
      sources: ["local-cache"],
      isFallback: false,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    globalThis.fetch = mockFetch;

    const result = await hybridRAGQuery(tier1, BASE_QUERY);

    expect(result.content).toBe("Degraded local answer");
    expect(result.tier).toBe(1);
    expect(result.isFallback).toBe(false);
    expect(result.sources).toEqual(["local-cache"]);
    // Both Tier 2 and Tier 3 should have been attempted
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
