/**
 * Corpus loader — fetches and parses the pre-built corpus from /rag/corpus.json.
 * Uses fetch() only — NO fs/path Node built-ins.
 */

import { decodeBase64ToFloat32 } from "../engine/rag"
import type { CorpusFile, ChunkMetadata } from "../engine/types"

export interface LoadedCorpus {
  corpusEmbeddings: Array<{ id: string; embedding: Float32Array }>
  chunkTexts: Map<string, string>
  chunkMetadatas: Map<string, ChunkMetadata>
  dimension: number
  chunkCount: number
}

/**
 * Load the RAG corpus from the public directory.
 * Fetches /rag/corpus.json and decodes base64 embeddings into Float32Arrays.
 */
export async function loadCorpus(): Promise<LoadedCorpus> {
  const response = await fetch("/rag/corpus.json")

  if (!response.ok) {
    throw new Error(
      `Failed to load corpus: ${response.status} ${response.statusText}`,
    )
  }

  const corpus: CorpusFile = await response.json()

  if (corpus.version !== 1) {
    throw new Error(`Unsupported corpus version: ${String(corpus.version)}`)
  }

  const corpusEmbeddings: Array<{ id: string; embedding: Float32Array }> = []
  const chunkTexts = new Map<string, string>()
  const chunkMetadatas = new Map<string, ChunkMetadata>()

  for (const chunk of corpus.chunks) {
    const embedding = decodeBase64ToFloat32(chunk.embedding)
    corpusEmbeddings.push({ id: chunk.id, embedding })
    chunkTexts.set(chunk.id, chunk.text)
    chunkMetadatas.set(chunk.id, chunk.metadata)
  }

  return {
    corpusEmbeddings,
    chunkTexts,
    chunkMetadatas,
    dimension: corpus.dimension,
    chunkCount: corpus.chunks.length,
  }
}
