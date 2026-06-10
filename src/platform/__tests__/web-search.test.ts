import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { webSearch } from "@/platform/web-search";

describe("webSearch", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
    delete process.env.EXA_API_KEY;
    delete process.env.TAVILY_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns Exa results when Exa API succeeds", async () => {
    vi.stubEnv("EXA_API_KEY", "test-exa-key");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { title: "Diana Lore", url: "https://example.com/diana", text: "Diana is a warrior.", score: 0.95 },
          { title: "Elyseon Guide", url: "https://example.com/elyseon", text: "Elyseon civilization.", score: 0.8 },
        ],
      }),
    });

    const results = await webSearch({ query: "Diana" });
    expect(results).toHaveLength(2);
    expect(results[0]!.title).toBe("Diana Lore");
    expect(results[0]!.snippet).toBe("Diana is a warrior.");
    expect(results[0]!.url).toBe("https://example.com/diana");
  });

  it("falls back to Tavily when Exa fails", async () => {
    vi.stubEnv("EXA_API_KEY", "test-exa-key");
    vi.stubEnv("TAVILY_API_KEY", "test-tavily-key");

    mockFetch
      .mockRejectedValueOnce(new Error("Exa network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { title: "Tavily Result", url: "https://example.com/tavily", content: "Fallback content", score: 0.7 },
          ],
        }),
      });

    const results = await webSearch({ query: "test query" });
    expect(results).toHaveLength(1);
    expect(results[0]!.title).toBe("Tavily Result");
    expect(results[0]!.snippet).toBe("Fallback content");
  });

  it("returns empty array when no API keys are configured", async () => {
    const results = await webSearch({ query: "anything" });
    expect(results).toHaveLength(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});