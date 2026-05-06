"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

/**
 * ChatbotPanel is loaded via next/dynamic with ssr: false to prevent
 * the WebGPU/WASM dependencies from being evaluated during SSR.
 */
const ChatbotPanel = dynamic(
  () =>
    import("@/features/chatbot").then((mod) => ({
      default: mod.ChatbotPanel,
    })),
  { ssr: false },
)

export default function ChatbotPage() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-edu-bg">
      {/* Header area */}
      <div className="border-b border-edu-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-edu-text tracking-wide">
            EDU Universe 質問箱
          </h1>
          <p className="mt-2 text-sm text-edu-muted">
            ブラウザ内で動作するAIチャットボット。EDUの世界観について質問してください。
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => {
                setIsOpen(true)
              }}
              className="px-4 py-2 text-xs rounded-lg bg-edu-accent text-edu-bg hover:bg-edu-accent/80 transition-colors"
            >
              チャットを開く
            </button>
          </div>
        </div>
      </div>

      {/* Main content — just renders the panel directly on this page */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="edu-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-edu-accent/15 flex items-center justify-center">
              <span className="text-edu-accent font-bold text-sm">EDU</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-edu-text">
                ブラウザネイティブ RAG チャットボット
              </h2>
              <p className="text-xs text-edu-muted">
                WebLLM + E5 Embeddings + WebGPU
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-edu-text-dim">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-edu-surface border border-edu-border">
                <h3 className="text-xs font-medium text-edu-accent mb-1">
                  🔍 RAG 検索
                </h3>
                <p className="text-[11px] text-edu-muted">
                  729の知識チャンクから意味検索。コサイン類似度で関連情報を特定。
                </p>
              </div>
              <div className="p-3 rounded-lg bg-edu-surface border border-edu-border">
                <h3 className="text-xs font-medium text-edu-accent2 mb-1">
                  🧠 ブラウザLLM
                </h3>
                <p className="text-[11px] text-edu-muted">
                  WebGPU上でQwen/Llamaモデルを直接実行。サーバー不要。
                </p>
              </div>
              <div className="p-3 rounded-lg bg-edu-surface border border-edu-border">
                <h3 className="text-xs font-medium text-edu-cyan mb-1">
                  🔒 プライバシー
                </h3>
                <p className="text-[11px] text-edu-muted">
                  全ての処理がブラウザ内で完結。データは外部に送信されません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Panel Modal */}
      <ChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
