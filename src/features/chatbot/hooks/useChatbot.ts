"use client"

import { useState, useCallback, useRef } from "react"
import type {
  ChatMessage,
  ChatbotStatus,
  RAGConfig,
  RetrievedChunk,
  ModelSize,
} from "../engine/types"
import { MODEL_OPTIONS } from "../engine/types"
import { loadCorpus } from "../data/corpus-loader"
import { searchCorpus, buildRAGPrompt } from "../engine/rag"
import { getEmbeddingPipeline, embedQuery } from "../engine/embeddings"
import { getWebLLMRuntime } from "../engine/webllm-runtime"

let messageIdCounter = 0
function nextMessageId(): string {
  messageIdCounter++
  return `msg-${Date.now()}-${messageIdCounter}`
}

interface UseChatbotReturn {
  messages: ChatMessage[]
  status: ChatbotStatus
  error: string | null
  sendMessage: (text: string) => Promise<void>
  clearMessages: () => void
  config: RAGConfig
  updateConfig: (partial: Partial<RAGConfig>) => void
  modelSize: ModelSize
  setModelSize: (size: ModelSize) => void
  modelInfo: {
    label: string
    description: string
  }
  initChatbot: () => Promise<void>
  retryInit: () => Promise<void>
  loadProgress: string
}

const DEFAULT_CONFIG: RAGConfig = {
  topK: 5,
  modelId: MODEL_OPTIONS.medium.id,
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatbotStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<RAGConfig>(DEFAULT_CONFIG)
  const [modelSize, setModelSize] = useState<ModelSize>("medium")
  const [loadProgress, setLoadProgress] = useState("")

  // Refs to hold loaded data across renders
  const corpusRef = useRef<Awaited<ReturnType<typeof loadCorpus>> | null>(null)
  const llmInitializedRef = useRef(false)

  const updateConfig = useCallback((partial: Partial<RAGConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }))
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  /**
   * Initialize the chatbot pipeline: load corpus + embedding model.
   * The LLM is loaded lazily on the first message.
   */
  const initChatbot = useCallback(async () => {
    setError(null)

    // Step 1: Load corpus
    if (!corpusRef.current) {
      setStatus("loading-corpus")
      setLoadProgress("Loading knowledge base...")
      try {
        const corpus = await loadCorpus()
        corpusRef.current = corpus
        setLoadProgress(`Loaded ${corpus.chunkCount} knowledge entries`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(`Failed to load corpus: ${msg}`)
        setStatus("error")
        return
      }
    }

    // Step 2: Load embedding model (WASM, no WebGPU needed)
    setStatus("loading-embedding-model")
    setLoadProgress("Loading embedding model...")
    try {
      await getEmbeddingPipeline((msg) => {
        setLoadProgress(msg)
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(`Failed to load embedding model: ${msg}`)
      setStatus("error")
      return
    }

    setStatus("ready")
    setLoadProgress("Ready")
  }, [])

  /**
   * Send a message through the RAG pipeline.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || status === "generating") return

      // Add user message
      const userMessage: ChatMessage = {
        id: nextMessageId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Ensure corpus and embedding model are loaded
      if (!corpusRef.current) {
        await initChatbot()
        if (!corpusRef.current) return
      }

      const corpus = corpusRef.current

      // Step 1: Embed the query
      setStatus("embedding-query")
      setLoadProgress("Embedding your question...")
      let queryEmbedding: Float32Array
      try {
        queryEmbedding = await embedQuery(text.trim())
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(`Embedding failed: ${msg}`)
        setStatus("error")
        return
      }

      // Step 2: Search corpus
      setStatus("searching")
      setLoadProgress("Searching knowledge base...")
      const retrievedChunks: RetrievedChunk[] = searchCorpus(
        queryEmbedding,
        corpus.corpusEmbeddings,
        corpus.chunkTexts,
        corpus.chunkMetadatas,
        config.topK,
      )

      // Step 3: Build RAG prompt
      const ragPrompt = buildRAGPrompt(text.trim(), retrievedChunks)

      // Step 4: Initialize LLM if needed (lazy, first message only)
      if (!llmInitializedRef.current) {
        setStatus("loading-llm")
        setLoadProgress("Loading language model (this may take a minute)...")
        try {
          const runtime = getWebLLMRuntime()
          await runtime.init(config.modelId, (report) => {
            const pct = Math.round(report.progress)
            if (report.text) {
              setLoadProgress(`${report.text} (${pct}%)`)
            } else {
              setLoadProgress(`Loading model: ${pct}%`)
            }
          })
          llmInitializedRef.current = true
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          setError(`LLM init failed: ${msg}`)
          setStatus("error")
          return
        }
      }

      // Step 5: Stream LLM response
      setStatus("generating")
      setLoadProgress("Generating response...")

      const assistantId = nextMessageId()
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        citations: retrievedChunks.map((c) => parseInt(c.id, 10)),
      }

      setMessages((prev) => [...prev, assistantMessage])

      try {
        const runtime = getWebLLMRuntime()

        // Build chat history for LLM (exclude system messages)
        const chatHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        let fullContent = ""
        for await (const token of runtime.chat(ragPrompt, chatHistory)) {
          fullContent += token
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullContent } : m,
            ),
          )
        }

        setStatus("ready")
        setLoadProgress("Ready")
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(`Generation failed: ${msg}`)
        setStatus("error")

        // Update the assistant message to show the error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `⚠ Error: ${msg}` }
              : m,
          ),
        )
      }
    },
    [status, messages, config, initChatbot],
  )

  const retryInit = useCallback(async () => {
    setStatus("idle")
    setError(null)
    corpusRef.current = null
    llmInitializedRef.current = false
    await initChatbot()
  }, [initChatbot])

  const currentModel = MODEL_OPTIONS[modelSize]

  return {
    messages,
    status,
    error,
    sendMessage,
    clearMessages,
    config,
    updateConfig,
    modelSize,
    setModelSize,
    modelInfo: {
      label: currentModel.label,
      description: currentModel.description,
    },
    initChatbot,
    retryInit,
    loadProgress,
  }
}
