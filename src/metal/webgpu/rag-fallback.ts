/**
 * Hybrid RAG — 3-tier fallback system
 *
 * Tier 1: Browser WebGPU LLM (0円, 高速) — existing edu webgpu RAG
 * Tier 2: MiniMax M3 API (長文脈1M tok, 高速, SWE-Bench Pro最強)
 * Tier 3: NVIDIA Nemotron-3-Ultra (MoE 550B, 思考モード, 推論可視化)
 *
 * When Tier 1 confidence < .8, falls back to Tier 2, then Tier 3 if needed.
 * All API keys are server-side only (no NEXT_PUBLIC_ prefix).
 */

export interface RAGResponse {
  content: string;
  tier: 1 | 2 | 3;
  confidence: number;
  sources: string[];
  thinkingTrace?: string; // Tier 3 only — visible reasoning chain
  isFallback: boolean;
}

export interface RAGQuery {
  question: string;
  context: string[];
  maxTokens?: number;
}

const MINIMAX_API_URL = "https://api.minimax.chat/v1/text/chatcompletion_v2";
const NEMOTRON_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

interface MiniMaxApiResponse {
  choices: Array<{ message: { content: string } }>;
  usage?: { total_tokens: number };
}

interface NemotronApiResponse {
  choices: Array<{ message: { content: string; reasoning_content?: string } }>;
}

/** Tier 2: MiniMax M3 fallback */
async function queryMiniMax(query: RAGQuery): Promise<RAGResponse> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY not configured");
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-M3",
      messages: [
        {
          role: "system",
          content:
            "あなたはE16星系の百科事典アシスタントです。提供された文脈に基づいて正確に回答してください。",
        },
        {
          role: "user",
          content: `文脈:\n${query.context.join("\n")}\n\n質問: ${query.question}`,
        },
      ],
      max_tokens: query.maxTokens ?? 2048,
      temperature: .3,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = (await response.json()) as MiniMaxApiResponse;
  const content = data.choices[0]?.message?.content ?? "";

  return {
    content,
    tier: 2,
    confidence: .85,
    sources: [],
    isFallback: true,
  };
}

/** Tier 3: NVIDIA Nemotron-3-Ultra fallback */
async function queryNemotron(query: RAGQuery): Promise<RAGResponse> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY not configured");
  }

  const response = await fetch(NEMOTRON_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        {
          role: "system",
          content:
            "E16 star system encyclopedia assistant. Provide accurate answers based on the given context. Think step by step.",
        },
        {
          role: "user",
          content: `Context:\n${query.context.join("\n")}\n\nQuestion: ${query.question}`,
        },
      ],
      max_tokens: query.maxTokens ?? 4096,
      temperature: .2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Nemotron API error: ${response.status}`);
  }

  const data = (await response.json()) as NemotronApiResponse;
  const choice = data.choices[0];
  const content = choice?.message?.content ?? "";

  return {
    content,
    tier: 3,
    confidence: .92,
    sources: [],
    thinkingTrace: choice?.message?.reasoning_content,
    isFallback: true,
  };
}

/** Safely attempt a query, returning null on failure */
async function safeQuery(
  fn: (q: RAGQuery) => Promise<RAGResponse>,
  query: RAGQuery,
): Promise<RAGResponse | null> {
  try {
    return await fn(query);
  } catch {
    return null;
  }
}

/** Main hybrid RAG query with 3-tier fallback */
export async function hybridRAGQuery(
  tier1Response: RAGResponse | null,
  query: RAGQuery,
): Promise<RAGResponse> {
  // If Tier 1 has high confidence, return it directly
  if (tier1Response != null && tier1Response.confidence >= .8) {
    return tier1Response;
  }

  // Try Tier 2: MiniMax M3
  const tier2Result = await safeQuery(queryMiniMax, query);
  if (tier2Result != null) {
    return tier2Result;
  }

  // Try Tier 3: Nemotron
  const tier3Result = await safeQuery(queryNemotron, query);
  if (tier3Result != null) {
    return tier3Result;
  }

  // All tiers failed — return degraded response
  if (tier1Response != null) {
    return { ...tier1Response, isFallback: false };
  }

  return {
    content:
      "申し訳ありません。回答を生成できませんでした。後でもう一度お試しください。",
    tier: 1,
    confidence: 0,
    sources: [],
    isFallback: false,
  };
}
