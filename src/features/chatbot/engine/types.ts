/**
 * Shared types for the EDU browser-native chatbot engine.
 * Pure types — no browser or Node dependencies.
 */

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  citations?: number[] // chunk IDs cited in the response
}

export interface RetrievedChunk {
  id: string
  text: string
  score: number
  metadata: {
    path: string
    headingPath: string[]
    kind: string
    language: string
    hash: string
  }
}

export interface RAGConfig {
  topK: number // default 5, range 3-10
  modelId: string // WebLLM model ID
}

export type ChatbotStatus =
  | "idle"
  | "loading-corpus"
  | "loading-embedding-model"
  | "loading-llm"
  | "ready"
  | "embedding-query"
  | "searching"
  | "generating"
  | "error"

export interface ChunkMetadata {
  path: string
  headingPath: string[]
  kind: "character" | "faction" | "timeline" | "rules" | "story" | "misc"
  language: "ja" | "en" | "mixed"
  hash: string
}

export interface CorpusChunk {
  id: string
  text: string
  embedding: string // base64-encoded Float32Array
  metadata: ChunkMetadata
}

export interface CorpusFile {
  version: 1
  model: string
  dimension: number
  chunks: CorpusChunk[]
}

export type ModelSize = "small" | "medium" | "large"

export const MODEL_OPTIONS: Record<
  ModelSize,
  { id: string; label: string; description: string }
> = {
  small: {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    label: "1B (Llama 3.2)",
    description: "Fastest, ~400MB download",
  },
  medium: {
    id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
    label: "1.5B (Qwen 2.5)",
    description: "Good balance, ~600MB download",
  },
  large: {
    id: "Qwen2.5-3B-Instruct-q4f16_1-MLC",
    label: "3B (Qwen 2.5)",
    description: "Best quality, ~1.2GB download",
  },
} as const
