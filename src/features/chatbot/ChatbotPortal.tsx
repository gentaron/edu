"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { ChatbotPanel } from "@/features/chatbot"

/**
 * Floating chat button + chatbot panel portal.
 * This is a thin client component that can be imported in the
 * server layout.tsx without issues.
 */
export function ChatbotPortal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full bg-edu-accent text-edu-bg shadow-lg shadow-edu-accent/20 flex items-center justify-center hover:bg-edu-accent/90 active:scale-95 transition-all"
        aria-label="チャットボットを開く"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Chatbot Panel */}
      <ChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
