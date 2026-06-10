/**
 * Semantic search layer for edu wiki
 * Uses pre-computed E5 embeddings with cosine similarity.
 * Falls back to BM25 inverted index when no embeddings available.
 *
 * In production, embeddings would be stored in pgvector (R2).
 * This module provides the search interface that works both
 * with in-memory embeddings and future pgvector backend.
 */

import type { WikiEntry } from "@/types/wiki";

export interface SemanticSearchResult {
  entry: WikiEntry;
  score: number;
  matchType: "semantic" | "bm25" | "hybrid";
}

export interface EmbeddingVector {
  id: string;
  vector: number[];
  metadata: { category: string; name: string };
}

/** Cosine similarity between two vectors */
export function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }
  return dotProduct / denominator;
}

/** Simple hash-based pseudo-embedding for demo (replaced by real E5 in production) */
export function pseudoEmbed(text: string, dimensions = 128): number[] {
  const vector = Array.from<unknown, number>({ length: dimensions }, () => 0);
  const words = text.toLowerCase().split(/[\s,。、]+/).filter((w) => w.length > 0);
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const charCode = word.charCodeAt(i);
      const dim = charCode % dimensions;
      vector[dim] = (vector[dim] ?? 0) + 1;
    }
  }
  // Normalize
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] = (vector[i] ?? 0) / norm;
    }
  }
  return vector;
}

/** Build embedding index from wiki entries */
export function buildEmbeddingIndex(
  entries: readonly WikiEntry[],
): Map<string, EmbeddingVector> {
  const index = new Map<string, EmbeddingVector>();
  for (const entry of entries) {
    const text = `${entry.name} ${entry.description ?? ""} ${entry.descriptionEn ?? ""}`;
    const vector = pseudoEmbed(text);
    index.set(entry.id, {
      id: entry.id,
      vector,
      metadata: { category: entry.category, name: entry.name },
    });
  }
  return index;
}

/** Search embeddings by query */
export function semanticSearch(
  query: string,
  index: Map<string, EmbeddingVector>,
  entries: readonly WikiEntry[],
  limit = 10,
): SemanticSearchResult[] {
  const queryVector = pseudoEmbed(query);
  const results: SemanticSearchResult[] = [];

  for (const [id, embedding] of index) {
    const score = cosineSimilarity(queryVector, embedding.vector);
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      results.push({ entry, score, matchType: "semantic" });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}