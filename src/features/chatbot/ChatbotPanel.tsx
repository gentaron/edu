"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Send,
  X,
  Settings,
  Loader2,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import { useWebGPUSupport } from "./hooks/useWebGPUSupport"
import { useChatbot } from "./hooks/useChatbot"
import { MessageList } from "./messages/MessageList"
import { MODEL_OPTIONS } from "./engine/types"
import type { ModelSize, ChatbotStatus } from "./engine/types"

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
}

const STATUS_LABELS: Record<ChatbotStatus, string> = {
  idle: "準備中",
  "loading-corpus": "知識ベースを読み込み中...",
  "loading-embedding-model": "埋め込みモデルを読み込み中...",
  "loading-llm": "言語モデルを読み込み中...",
  ready: "準備完了",
  "embedding-query": "質問を処理中...",
  searching: "検索中...",
  generating: "回答生成中...",
  error: "エラー",
}

function StatusBadge({ status }: { status: ChatbotStatus }) {
  const isWorking = !["idle", "ready", "error"].includes(status)

  return (
    <div className="flex items-center gap-2 text-xs">
      {isWorking && (
        <Loader2 className="w-3 h-3 animate-spin text-edu-accent" />
      )}
      <span
        className={
          status === "ready"
            ? "text-green-400"
            : status === "error"
              ? "text-red-400"
              : "text-edu-muted"
        }
      >
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const {
    messages,
    status,
    error,
    sendMessage,
    clearMessages,
    config,
    updateConfig,
    modelSize,
    setModelSize,
    modelInfo,
    initChatbot,
    retryInit,
    loadProgress,
  } = useChatbot()

  const { supported: webGPUSupported, checking: checkingGPU } =
    useWebGPUSupport()

  const [inputText, setInputText] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Auto-init on first open
  useEffect(() => {
    if (isOpen && !initialized && status === "idle") {
      initChatbot()
        .then(() => setInitialized(true))
        .catch(() => {
          // Error is handled by the hook
        })
    }
  }, [isOpen, initialized, status, initChatbot])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return
    const text = inputText
    setInputText("")
    await sendMessage(text)
  }, [inputText, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleModelSizeChange = useCallback(
    (size: ModelSize) => {
      setModelSize(size)
      updateConfig({ modelId: MODEL_OPTIONS[size].id })
    },
    [setModelSize, updateConfig],
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[700px] bg-edu-bg border border-edu-border rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-edu-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-edu-accent/15 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-edu-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-edu-text tracking-wide">
                EDU Universe 質問箱
              </h2>
              <StatusBadge status={status} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? "bg-edu-accent/15 text-edu-accent"
                  : "text-edu-muted hover:text-edu-text hover:bg-edu-surface"
              }`}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-edu-muted hover:text-edu-text hover:bg-edu-surface transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="px-4 py-3 border-b border-edu-border space-y-3 shrink-0 bg-edu-surface/50">
            {/* Model size selector */}
            <div>
              <label className="text-xs text-edu-muted block mb-1.5">
                モデルサイズ
              </label>
              <div className="flex gap-1.5">
                {(Object.keys(MODEL_OPTIONS) as ModelSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleModelSizeChange(size)}
                    className={`flex-1 px-2 py-1.5 text-[11px] rounded-md border transition-all ${
                      modelSize === size
                        ? "border-edu-accent bg-edu-accent/10 text-edu-accent"
                        : "border-edu-border text-edu-muted hover:border-edu-border-bright hover:text-edu-text"
                    }`}
                  >
                    {MODEL_OPTIONS[size].label}
                    <span className="block text-[9px] opacity-60 mt-0.5">
                      {MODEL_OPTIONS[size].description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top-K slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-edu-muted">
                  検索結果数 (Top-K)
                </label>
                <span className="text-xs text-edu-accent font-mono">
                  {config.topK}
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                step={1}
                value={config.topK}
                onChange={(e) =>
                  updateConfig({ topK: parseInt(e.target.value, 10) })
                }
                className="w-full h-1.5 bg-edu-border rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-edu-accent
                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-edu-bg"
              />
            </div>

            {/* Clear button */}
            <button
              onClick={clearMessages}
              className="text-xs text-edu-muted hover:text-red-400 transition-colors"
            >
              会話をクリア
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="px-4 py-2.5 border-b border-red-500/20 bg-red-500/5 shrink-0">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-red-400">{error}</p>
                <button
                  onClick={retryInit}
                  className="text-[10px] text-red-400/70 hover:text-red-400 mt-1 underline"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WebGPU not supported warning */}
        {!checkingGPU && !webGPUSupported && (
          <div className="px-4 py-3 border-b border-yellow-500/20 bg-yellow-500/5 shrink-0">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-400 font-medium">
                  WebGPU が利用できません
                </p>
                <p className="text-[10px] text-yellow-400/60 mt-1">
                  お使いのブラウザは WebGPU に対応していません。
                  <br />
                  Chrome 113+ または Edge 113+ をお試しください。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading progress */}
        {!["idle", "ready", "error", "generating"].includes(status) && (
          <div className="px-4 py-2 bg-edu-surface/30 shrink-0">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-edu-accent" />
              <span className="text-[11px] text-edu-muted truncate">
                {loadProgress}
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <MessageList messages={messages} />

        {/* Input */}
        <div className="px-3 py-3 border-t border-edu-border shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                status === "ready"
                  ? "EDUの世界について質問..."
                  : "読み込み中..."
              }
              disabled={status !== "ready"}
              className="flex-1 bg-edu-card border border-edu-border rounded-lg px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted/50 focus:outline-none focus:border-edu-accent/40 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || status !== "ready"}
              className="p-2 rounded-lg bg-edu-accent text-edu-bg hover:bg-edu-accent/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-edu-muted/40 mt-1.5 text-center">
            {modelInfo.label} — 回答はEDUの知識ベースに基づきます
          </p>
        </div>
      </div>
    </div>
  )
}
