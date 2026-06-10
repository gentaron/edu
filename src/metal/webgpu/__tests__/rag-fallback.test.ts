import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hybridRAGQuery } from "../rag-fallback";
import type { RAGResponse, RAGQuery } from "../rag-fallback";

const BASE_QUERY: RAGQuery = {
  question: "Who is Diana Lightshield?",
  context: ["Diana is a legendary guardian."],
};

const JP_QUERY: RAGQuery = {
  question: "ダイアナ・ライトシールドは誰ですか？",
  context: ["ダイアナは伝説の守護者です。"],
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
    // Tier 2 (MiniMax) + Tier 3 (Nemotron) = 2 fetch calls
    // Tier 4 & 5 fail before fetch (no API key env var)
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("has 5 tiers in the fallback chain when all API keys are set", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-deepseek-key");
    vi.stubEnv("QWEN_API_KEY", "test-qwen-key");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    globalThis.fetch = mockFetch;

    const result = await hybridRAGQuery(null, BASE_QUERY);

    // Should return degraded response since all tiers fail
    expect(result.content).toBe(
      "申し訳ありません。回答を生成できませんでした。後でもう一度お試しください。",
    );
    expect(result.tier).toBe(1);
    expect(result.confidence).toBe(0);
    // Non-JP: Tier 2 + Tier 3 + Tier 4 + Tier 5 = 4 fetch calls
    // (NemotronNanoJP skipped because non-JP query)
    expect(mockFetch).toHaveBeenCalledTimes(4);
  });

  it("tries Tier 4 (DeepSeek) before Tier 5 (Qwen)", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-deepseek-key");
    vi.stubEnv("QWEN_API_KEY", "test-qwen-key");

    const tier1: RAGResponse = {
      content: "",
      tier: 1,
      confidence: .1,
      sources: [],
      isFallback: false,
    };

    const callOrder: string[] = [];

    const mockFetch = vi.fn().mockImplementation((_url: string) => {
      callOrder.push(_url);
      return Promise.resolve({ ok: false, status: 500 });
    });
    globalThis.fetch = mockFetch;

    await hybridRAGQuery(tier1, BASE_QUERY);

    // Verify call order: MiniMax (Tier 2) → Nemotron (Tier 3) → DeepSeek (Tier 4) → Qwen (Tier 5)
    const deepSeekIndex = callOrder.indexOf("https://api.deepseek.com/v1/chat/completions");
    const qwenIndex = callOrder.indexOf("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");

    expect(deepSeekIndex).toBeGreaterThan(-1);
    expect(qwenIndex).toBeGreaterThan(-1);
    expect(deepSeekIndex).toBeLessThan(qwenIndex);
  });

  it("prioritizes NemotronNanoJP for Japanese queries", async () => {
    const tier1: RAGResponse = {
      content: "",
      tier: 1,
      confidence: .1,
      sources: [],
      isFallback: false,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            { message: { content: "日本語での回答" } },
          ],
        }),
    });
    globalThis.fetch = mockFetch;

    const result = await hybridRAGQuery(tier1, JP_QUERY);

    // NemotronNanoJP should be tried first for JP queries and succeed
    expect(result.content).toBe("日本語での回答");
    expect(result.isFallback).toBe(true);
    expect(result.isJP).toBe(true);
    // Only 1 fetch call — NemotronNanoJP succeeds before MiniMax
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("does not use NemotronNanoJP for non-Japanese queries", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-deepseek-key");
    vi.stubEnv("QWEN_API_KEY", "test-qwen-key");

    const tier1: RAGResponse = {
      content: "",
      tier: 1,
      confidence: .1,
      sources: [],
      isFallback: false,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    globalThis.fetch = mockFetch;

    await hybridRAGQuery(tier1, BASE_QUERY);

    // Non-JP query: NemotronNanoJP should NOT be called
    // Only MiniMax, Nemotron, DeepSeek, Qwen = 4 calls
    expect(mockFetch).toHaveBeenCalledTimes(4);

    const nemotronNanoJPModel = "nvidia/nemotron-mini-4b-instruct";
    for (const call of mockFetch.mock.calls) {
      const body = JSON.parse(call[1]?.body as string);
      expect(body.model).not.toBe(nemotronNanoJPModel);
    }
  });
});
