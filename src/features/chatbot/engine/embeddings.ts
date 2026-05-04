/**
 * Runtime embedding using @xenova/transformers in the browser (WASM).
 * No WebGPU needed for embeddings — uses the WASM backend.
 *
 * IMPORTANT: Uses lazy dynamic import to keep @xenova/transformers
 * out of the initial bundle.
 */

const E5_MODEL_ID = "Xenova/multilingual-e5-small"
const E5_DIMENSION = 384

type EmbeddingPipeline = {
  (texts: string[], options?: Record<string, unknown>): Promise<{
    dims?: number[]
    data: number[] | number[][]
    [j: number]: unknown
  }>
}

let pipelineInstance: EmbeddingPipeline | null = null
let pipelinePromise: Promise<EmbeddingPipeline> | null = null

/**
 * Load the embedding pipeline (lazy, cached after first call).
 * Uses dynamic import to avoid bundling @xenova/transformers in initial bundle.
 */
export async function getEmbeddingPipeline(
  progressCallback?: (message: string) => void,
): Promise<EmbeddingPipeline> {
  if (pipelineInstance) return pipelineInstance
  if (pipelinePromise) return pipelinePromise

  pipelinePromise = (async () => {
    progressCallback?.("Loading embedding model...")

    // Dynamic import — keeps the WASM out of the main bundle
    const { pipeline } = await import("@xenova/transformers")

    const p = await pipeline("feature-extraction", E5_MODEL_ID, {
      progress_callback: (progress: {
        status: string
        progress?: number
        file?: string
      }) => {
        if (progress.status === "progress" && progress.progress !== undefined) {
          const pct = Math.round(progress.progress)
          progressCallback?.(`Downloading model: ${pct}%`)
        } else if (progress.status === "done") {
          progressCallback?.("Model loaded")
        } else if (progress.status === "ready") {
          progressCallback?.("Model ready")
        }
      },
    })

    pipelineInstance = p as unknown as EmbeddingPipeline
    return pipelineInstance
  })()

  return pipelinePromise
}

/**
 * Embed a query string using the E5 model.
 * Uses "query: " prefix per E5 model requirements
 * (vs "passage: " prefix used for corpus at build time).
 *
 * @param text - The query text to embed
 * @param existingPipeline - Optional pre-loaded pipeline (avoids re-loading)
 * @returns A Float32Array of dimension 384
 */
export async function embedQuery(
  text: string,
  existingPipeline?: EmbeddingPipeline,
): Promise<Float32Array> {
  const pipe = existingPipeline ?? (await getEmbeddingPipeline())

  // E5 uses "query: " prefix for queries
  const prefixed = `query: ${text}`

  const output = await pipe([prefixed], {
    pooling: "mean",
    normalize: true,
  })

  // Extract the embedding vector
  const data = output.data

  if (Array.isArray(data) && typeof data[0] === "number") {
    // Flat array (single query, single output)
    return new Float32Array(data as number[])
  }

  // Handle nested array format
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return new Float32Array(data[0] as number[])
  }

  // Fallback: try to extract from the output object
  if (output.dims && output.dims.length === 2) {
    const arr = new Float32Array(E5_DIMENSION)
    const flatData = Array.isArray(data)
      ? (data as number[]).flat()
      : []
    for (let i = 0; i < E5_DIMENSION; i++) {
      arr[i] = (flatData[i] as number) ?? 0
    }
    return arr
  }

  throw new Error("Unexpected embedding output format from transformers pipeline")
}
