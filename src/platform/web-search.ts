/**
 * External web search fallback for wiki
 * When edu internal data doesn't contain the answer,
 * falls back to Exa or Tavily API for web search.
 * Graceful degradation: returns empty results if no API key.
 */

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  score: number;
}

export interface WebSearchOptions {
  query: string;
  limit?: number;
  category?: string;
}

/** Exa API search */
async function searchExa(
  query: string,
  limit: number,
  apiKey: string,
): Promise<WebSearchResult[]> {
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query,
      numResults: limit,
      type: "auto",
      contents: { text: { maxCharacters: 500 } },
    }),
  });

  if (!response.ok) {
    throw new Error(`Exa API error: ${response.status}`);
  }

  const data = await response.json() as {
    results: Array<{ title: string; url: string; text: string; score: number }>;
  };

  return data.results.map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.text,
    score: r.score,
  }));
}

/** Tavily API search */
async function searchTavily(
  query: string,
  limit: number,
  apiKey: string,
): Promise<WebSearchResult[]> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: limit,
      include_answer: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`);
  }

  const data = await response.json() as {
    results: Array<{ title: string; url: string; content: string; score: number }>;
  };

  return data.results.map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.content,
    score: r.score,
  }));
}

/** Main web search with fallback chain: Exa → Tavily */
export async function webSearch(
  options: WebSearchOptions,
): Promise<WebSearchResult[]> {
  const { query, limit = 5 } = options;
  const exaKey = process.env.EXA_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;

  if (exaKey) {
    try {
      return await searchExa(query, limit, exaKey);
    } catch (error) {
      console.warn("Exa search failed:", error);
    }
  }

  if (tavilyKey) {
    try {
      return await searchTavily(query, limit, tavilyKey);
    } catch (error) {
      console.warn("Tavily search failed:", error);
    }
  }

  return [];
}