/**
 * Pure cosine similarity search + RAG prompt assembly.
 * No browser or Node built-in dependencies.
 */

import type { RetrievedChunk } from "./types"

/**
 * Decode a base64 string into a Float32Array.
 */
export function decodeBase64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new Float32Array(bytes.buffer)
}

/**
 * Encode a Float32Array to a base64 string.
 */
export function encodeFloat32ToBase64(floats: Float32Array): string {
  const bytes = new Uint8Array(floats.buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

/**
 * Compute cosine similarity between two vectors.
 * Returns a value in [-1, 1]; typically [0, 1] for normalized embeddings.
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error(
      `Dimension mismatch: ${a.length} vs ${b.length}`,
    )
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    const ai = a[i]!
    const bi = b[i]!
    dotProduct += ai * bi
    normA += ai * ai
    normB += bi * bi
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) {
    return 0
  }

  return dotProduct / denominator
}

/**
 * Search the corpus for the most similar chunks to the query embedding.
 *
 * @param queryEmbedding - The query's embedding vector
 * @param corpusEmbeddings - Array of all corpus embeddings
 * @param corpusChunkTexts - Map from chunk ID to chunk text
 * @param corpusChunkMetadatas - Map from chunk ID to chunk metadata
 * @param topK - Number of top results to return
 * @returns Array of retrieved chunks sorted by descending similarity
 */
export function searchCorpus(
  queryEmbedding: Float32Array,
  corpusEmbeddings: Array<{ id: string; embedding: Float32Array }>,
  corpusChunkTexts: Map<string, string>,
  corpusChunkMetadatas: Map<
    string,
    {
      path: string
      headingPath: string[]
      kind: string
      language: string
      hash: string
    }
  >,
  topK: number,
): RetrievedChunk[] {
  const scored: Array<{ id: string; score: number }> = []

  for (const item of corpusEmbeddings) {
    const score = cosineSimilarity(queryEmbedding, item.embedding)
    scored.push({ id: item.id, score })
  }

  // Sort by descending score, take topK
  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, topK)

  return top.map((item) => ({
    id: item.id,
    text: corpusChunkTexts.get(item.id) ?? "",
    score: item.score,
    metadata: corpusChunkMetadatas.get(item.id) ?? {
      path: "",
      headingPath: [],
      kind: "misc",
      language: "en",
      hash: "",
    },
  }))
}

/**
 * Build the RAG prompt with retrieved context passages.
 *
 * @param query - The user's question
 * @param chunks - Retrieved chunks (sorted by relevance)
 * @returns The assembled system + user prompt for the LLM
 */
export function buildRAGPrompt(
  query: string,
  chunks: RetrievedChunk[],
): string {
  const contextSections = chunks
    .map((chunk, index) => `[${index + 1}] ${chunk.text}`)
    .join("\n\n")

  return `You are the EDU Universe lorekeeper. Answer the user's question using ONLY the context passages below. If the answer is not in the context, say so plainly — do not invent details.

# Context (top-${chunks.length} retrieved passages)
${contextSections}

# User question
${query}

# Instructions
- Cite the passage number(s) in square brackets, e.g. [1][3].
- Keep replies under 200 words unless the user asks for more.
- Match the user's language (Japanese → reply in Japanese, English → English).`
}
