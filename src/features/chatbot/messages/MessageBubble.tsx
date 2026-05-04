"use client"

import { memo } from "react"
import { User, Bot } from "lucide-react"
import type { ChatMessage } from "../engine/types"

interface MessageBubbleProps {
  message: ChatMessage
}

export const MessageBubble = memo(function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) return null

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-edu-accent/20 text-edu-accent"
            : "bg-edu-accent2/20 text-edu-accent2"
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Content */}
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-edu-accent/10 border border-edu-accent/20 text-edu-text"
            : "bg-edu-card border border-edu-border text-edu-text-dim"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-edu-border/50">
            <span className="text-[10px] uppercase tracking-wider text-edu-muted">
              Sources
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {message.citations.map((cid) => (
                <span
                  key={cid}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-edu-accent2/10 text-edu-accent2 border border-edu-accent2/20"
                >
                  #{cid}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
