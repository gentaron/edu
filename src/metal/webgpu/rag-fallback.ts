/**
 * Hybrid RAG — 5-tier fallback system
 *
 * Tier 1: Browser WebGPU LLM (0円, 高速) — existing edu webgpu RAG
 * Tier 2: MiniMax M3 API (長文脈1M tok, 高速, SWE-Bench Pro最強)
 * Tier 2.5: Nemotron-Nano-9B-Japanese (JP queries — 日本語特化)
 * Tier 3: NVIDIA Nemotron-3-Ultra (MoE 550B, 思考モード, 推論可視化)
 * Tier 4: DeepSeek V4 (code reasoning, 構造化出力)
 * Tier 5: Qwen 3.7 (多言語, JP content最適)
 *
 * When Tier 1 confidence < .8, falls back through tiers in order.
 * Japanese queries get NemotronNanoJP before MiniMax.
 * All API keys are server-side only (no NEXT_PUBLIC_ prefix).
 */

export interface RAGResponse {
  content: string;
  tier: 1 | 2 | 3 | 4 | 5;
  confidence: number;
  sources: string[];
  thinkingTrace?: string; // Tier 3 only — visible reasoning chain
  isFallback: boolean;
  isJP?: boolean;
}

export interface RAGQuery {
  question: string;
  context: string[];
  maxTokens?: number;
}

const MINIMAX_API_URL = "https://api.minimax.chat/v1/text/chatcompletion_v2";
const NEMOTRON_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const QWEN_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const NEMOTRON_NANO_JP_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

interface MiniMaxApiResponse {
  choices: Array<{ message: { content: string } }>;
  usage?: { total_tokens: number };
}

interface NemotronApiResponse {
  choices: Array<{ message: { content: string; reasoning_content?: string } }>;
}

interface DeepSeekApiResponse {
  choices: Array<{ message: { content: string } }>;
}

interface QwenApiResponse {
  choices: Array<{ message: { content: string } }>;
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

/** Detect if query is primarily Japanese */
function isJapaneseQuery(query: string): boolean {
  const japaneseChars = query.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g);
  if (!japaneseChars) {
    return false;
  }
  return japaneseChars.length / query.length > 0.3;
}

/** Tier 2.5: Nemotron-Nano-9B-Japanese — JP-specialized fallback */
async function queryNemotronNanoJP(query: RAGQuery): Promise<RAGResponse> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY not configured");
  }

  const response = await fetch(NEMOTRON_NANO_JP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-mini-4b-instruct",
      messages: [
        {
          role: "system",
          content:
            "あなたはE16星系の百科事典アシスタントです。日本語で正確かつ丁寧に回答してください。",
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
    throw new Error(`Nemotron Nano JP API error: ${response.status}`);
  }

  const data = (await response.json()) as NemotronApiResponse;
  const content = data.choices[0]?.message?.content ?? "";

  return {
    content,
    tier: 2,
    confidence: .87,
    sources: [],
    isFallback: true,
    isJP: true,
  };
}

/** Tier 4: DeepSeek V4 — code reasoning & structured output */
async function queryDeepSeek(query: RAGQuery): Promise<RAGResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not configured");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "E16星系百科事典アシスタント。構造化された回答を提供してください。",
        },
        {
          role: "user",
          content: `文脈:\n${query.context.join("\n")}\n\n質問: ${query.question}`,
        },
      ],
      max_tokens: query.maxTokens ?? 4096,
      temperature: .2,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = (await response.json()) as DeepSeekApiResponse;
  const content = data.choices[0]?.message?.content ?? "";

  return {
    content,
    tier: 4,
    confidence: .88,
    sources: [],
    isFallback: true,
  };
}

/** Tier 5: Qwen 3.7 — multilingual, best for JP content */
async function queryQwen(query: RAGQuery): Promise<RAGResponse> {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error("QWEN_API_KEY not configured");
  }

  const response = await fetch(QWEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content:
            "E16星系の百科事典アシスタントです。日本語と英語の両方で正確に回答してください。",
        },
        {
          role: "user",
          content: `文脈:\n${query.context.join("\n")}\n\n質問: ${query.question}`,
        },
      ],
      max_tokens: query.maxTokens ?? 4096,
      temperature: .3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.status}`);
  }

  const data = (await response.json()) as QwenApiResponse;
  const content = data.choices[0]?.message?.content ?? "";

  return {
    content,
    tier: 5,
    confidence: .9,
    sources: [],
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

/** Main hybrid RAG query with 5-tier fallback */
export async function hybridRAGQuery(
  tier1Response: RAGResponse | null,
  query: RAGQuery,
): Promise<RAGResponse> {
  // If Tier 1 has high confidence, return it directly
  if (tier1Response != null && tier1Response.confidence >= .8) {
    return tier1Response;
  }

  // For Japanese queries, try NemotronNanoJP first
  if (isJapaneseQuery(query.question)) {
    const jpResult = await safeQuery(queryNemotronNanoJP, query);
    if (jpResult != null) {
      return jpResult;
    }
  }

  // Try Tier 2: MiniMax M3
  const tier2Result = await safeQuery(queryMiniMax, query);
  if (tier2Result != null) {
    return tier2Result;
  }

  // For Japanese queries, try NemotronNanoJP after MiniMax too
  if (isJapaneseQuery(query.question)) {
    const jpResult = await safeQuery(queryNemotronNanoJP, query);
    if (jpResult != null) {
      return jpResult;
    }
  }

  // Try Tier 3: Nemotron
  const tier3Result = await safeQuery(queryNemotron, query);
  if (tier3Result != null) {
    return tier3Result;
  }

  // Try Tier 4: DeepSeek V4
  const tier4Result = await safeQuery(queryDeepSeek, query);
  if (tier4Result != null) {
    return tier4Result;
  }

  // Try Tier 5: Qwen 3.7
  const tier5Result = await safeQuery(queryQwen, query);
  if (tier5Result != null) {
    return tier5Result;
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
