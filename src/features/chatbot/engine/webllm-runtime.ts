/**
 * WebLLM runtime wrapper with LAZY dynamic import.
 * Runs the LLM entirely in the browser via WebGPU.
 *
 * IMPORTANT: Uses dynamic import to keep @mlc-ai/web-llm
 * out of the initial bundle.
 */

type ProgressCallback = (report: {
  progress: number
  text: string
  timeElapsed: number
}) => void

type ChatMessage = {
  role: string
  content: string
}

type MLCEngine = {
  chat: (
    messages: ChatMessage[],
    options?: { max_tokens?: number; temperature?: number; stream?: boolean },
  ) => AsyncGenerator<{ choices: Array<{ delta: { content?: string } }> }>
}

let engineInstance: MLCEngine | null = null
let initPromise: Promise<void> | null = null

/**
 * WebLLM Runtime — manages a browser-native LLM via WebGPU.
 */
export class WebLLMRuntime {
  private engine: MLCEngine | null = null
  private currentModelId = ""

  /**
   * Initialize the WebLLM engine with a specific model.
   * Downloads model weights on first call; caches in browser storage.
   *
   * @param modelId - WebLLM model identifier
   * @param progressCallback - Called with download/init progress
   */
  async init(
    modelId: string,
    progressCallback?: ProgressCallback,
  ): Promise<void> {
    // Reuse existing engine if same model
    if (engineInstance && this.currentModelId === modelId) {
      this.engine = engineInstance
      return
    }

    // If another init is in progress, wait for it
    if (initPromise) {
      await initPromise
      if (engineInstance && this.currentModelId === modelId) {
        this.engine = engineInstance
        return
      }
    }

    initPromise = (async () => {
      // Dynamic import — keeps @mlc-ai/web-llm out of the main bundle
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm")

      const engine = await CreateMLCEngine(modelId, {
        initProgressCallback: (report: {
          progress: number
          text: string
          timeElapsed: number
        }) => {
          progressCallback?.({
            progress: report.progress,
            text: report.text,
            timeElapsed: report.timeElapsed,
          })
        },
      })

      engineInstance = engine as unknown as MLCEngine
      this.engine = engineInstance
      this.currentModelId = modelId
    })()

    await initPromise
  }

  /**
   * Generate a streaming response from the LLM.
   *
   * @param systemPrompt - The system prompt (includes RAG context)
   * @param messages - Chat history (user/assistant turns)
   * @yields Token strings as they're generated
   */
  async *chat(
    systemPrompt: string,
    messages: ChatMessage[],
  ): AsyncGenerator<string> {
    if (!this.engine) {
      throw new Error("WebLLM engine not initialized. Call init() first.")
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ]

    try {
      const stream = this.engine.chat(fullMessages, {
        max_tokens: 512,
        temperature: 0.3,
        stream: true,
      })

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content
        if (delta) {
          yield delta
        }
      }
    } catch (error) {
      throw new Error(
        `WebLLM chat failed: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Dispose of the engine instance and free GPU resources.
   */
  dispose(): void {
    this.engine = null
    if (this.currentModelId) {
      engineInstance = null
      initPromise = null
    }
  }
}

/** Singleton runtime instance for app-wide use */
let runtimeInstance: WebLLMRuntime | null = null

/**
 * Get or create the singleton WebLLMRuntime instance.
 */
export function getWebLLMRuntime(): WebLLMRuntime {
  if (!runtimeInstance) {
    runtimeInstance = new WebLLMRuntime()
  }
  return runtimeInstance
}
