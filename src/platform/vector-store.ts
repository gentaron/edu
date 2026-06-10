/**
 * Vector store abstraction for RAG embeddings
 * Supports in-memory (current) and pgvector (future) backends.
 * Prisma schema will be extended with pgvector when PostgreSQL is used.
 */

export interface VectorRecord {
  id: string;
  embedding: number[];
  metadata: Record<string, string>;
  createdAt: number;
}

export interface VectorSearchQuery {
  vector: number[];
  topK: number;
  filter?: Record<string, string>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: Record<string, string>;
}

/** In-memory vector store (current implementation) */
class InMemoryVectorStore {
  private records = new Map<string, VectorRecord>();

  upsert(record: VectorRecord): void {
    this.records.set(record.id, record);
  }

  upsertBatch(records: readonly VectorRecord[]): void {
    for (const record of records) {
      this.upsert(record);
    }
  }

  delete(id: string): boolean {
    return this.records.delete(id);
  }

  search(query: VectorSearchQuery): VectorSearchResult[] {
    const results: VectorSearchResult[] = [];

    for (const record of this.records.values()) {
      // Apply metadata filter if provided
      if (query.filter) {
        const matches = Object.entries(query.filter).every(
          ([key, value]) => record.metadata[key] === value,
        );
        if (!matches) {
          continue;
        }
      }

      const score = cosineSimilarity(query.vector, record.embedding);
      results.push({
        id: record.id,
        score,
        metadata: { ...record.metadata },
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, query.topK);
  }

  get(id: string): VectorRecord | undefined {
    return this.records.get(id);
  }

  size(): number {
    return this.records.size;
  }

  /** Clear all records (useful for testing) */
  clear(): void {
    this.records.clear();
  }
}

function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
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

/** Singleton vector store instance */
export const vectorStore = new InMemoryVectorStore();

export { cosineSimilarity };