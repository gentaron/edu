"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./MessageBubble"
import type { ChatMessage } from "../engine/types"

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-edu-accent/10 flex items-center justify-center">
            <span className="text-edu-accent text-lg">EDU</span>
          </div>
          <p className="text-sm text-edu-muted">
            EDU Universe の世界観について
            <br />
            何でも聞いてください
          </p>
          <div className="space-y-1.5 text-xs text-edu-muted/60">
            <p className="text-edu-text-dim/40">例: 「ディアナって誰？」</p>
            <p className="text-edu-text-dim/40">例: &quot;What is AURALIS?&quot;</p>
            <p className="text-edu-text-dim/40">例: 「グランベル文明の特徴は？」</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
