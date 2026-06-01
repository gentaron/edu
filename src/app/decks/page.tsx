"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react"
import { useDeckSync } from "./useDeckSync"

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DecksPage() {
  const { decks, syncState, connectedDevices, deviceIcons, createDeck, forceSync } =
    useDeckSync()
  const [showNewDeckInput, setShowNewDeckInput] = useState(false)
  const [newDeckName, setNewDeckName] = useState("")

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      createDeck(newDeckName.trim())
      setNewDeckName("")
      setShowNewDeckInput(false)
    }
  }

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-edu-text mb-1">Deck Collection</h1>
            <p className="text-xs text-edu-muted">
              Cross-device CRDT sync via Automerge
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-edu-surface border border-edu-border px-3 py-1.5">
              {syncState.isSyncing ? (
                <RefreshCw className="w-3 h-3 text-edu-accent animate-spin" />
              ) : (
                <Wifi className="w-3 h-3 text-emerald-400" />
              )}
              <span className="text-[10px] text-edu-muted">
                {syncState.connectedDevices.length} device{syncState.connectedDevices.length !== 1 ? "s" : ""} syncing
              </span>
            </div>
            <button
              onClick={forceSync}
              disabled={syncState.isSyncing}
              className="rounded-full bg-edu-surface border border-edu-border p-1.5 text-edu-muted hover:text-edu-accent hover:border-edu-accent transition-colors disabled:opacity-50"
              title="Force sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Connected Devices Presence */}
        <div className="edu-card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 text-edu-accent" />
            <span className="text-xs font-medium text-edu-text">Presence</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {connectedDevices.map((device) => {
              const Icon = deviceIcons[device.deviceId] || Monitor
              return (
                <div
                  key={device.deviceId}
                  className="flex items-center gap-1.5 rounded-full bg-edu-surface px-2.5 py-1"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <Icon className="w-3 h-3 text-edu-muted" />
                  <span className="text-[10px] text-edu-muted">{device.displayName}</span>
                  {device.currentPath && (
                    <span className="text-[9px] text-edu-accent/60">{device.currentPath}</span>
                  )}
                </div>
              )
            })}
          </div>
          {syncState.pendingChanges > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400">
              <WifiOff className="w-3 h-3" />
              <span>{syncState.pendingChanges} change{syncState.pendingChanges !== 1 ? "s" : ""} pending</span>
            </div>
          )}
        </div>

        {/* New Deck Input */}
        {showNewDeckInput ? (
          <div className="edu-card p-4 mb-4 flex gap-2">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
              placeholder="Deck name..."
              autoFocus
              className="flex-1 bg-edu-surface border border-edu-border rounded-lg px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent"
            />
            <button
              onClick={handleCreateDeck}
              className="rounded-lg bg-edu-accent px-4 py-2 text-xs font-medium text-white hover:bg-edu-accent2 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewDeckInput(false)}
              className="rounded-lg bg-edu-surface border border-edu-border px-3 py-2 text-xs text-edu-muted hover:text-edu-text transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewDeckInput(true)}
            className="w-full edu-card p-3 mb-4 flex items-center justify-center gap-2 text-xs text-edu-muted hover:text-edu-accent hover:border-edu-accent transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Deck
          </button>
        )}

        {/* Deck List */}
        <div className="space-y-2">
          {decks.map((deck) => (
            <Link
              key={deck.docId}
              href={`/card-game/select?deck=${encodeURIComponent(deck.docId)}`}
              className="block edu-card p-4 hover:border-edu-accent transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-edu-text group-hover:text-edu-accent transition-colors">
                    {deck.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-edu-muted">
                      {deck.characters.length} cards
                    </span>
                    {deck.collaboratorCount > 0 && (
                      <span className="text-[10px] text-edu-accent">
                        +{deck.collaboratorCount} collaborator{deck.collaboratorCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-edu-muted">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(deck.lastModified)}
                </div>
              </div>

              {/* Character Preview — show up to 5 */}
              <div className="flex gap-1.5 flex-wrap">
                {deck.characters.slice(0, 5).map((char) => (
                  <span
                    key={char.id}
                    className="rounded bg-edu-surface border border-edu-border px-2 py-0.5 text-[10px] text-edu-muted"
                  >
                    {char.name}
                  </span>
                ))}
                {deck.characters.length > 5 && (
                  <span className="text-[10px] text-edu-muted self-center">
                    +{deck.characters.length - 5}
                  </span>
                )}
              </div>

              {/* Sync version */}
              <div className="mt-2 flex items-center gap-1 text-[9px] text-edu-muted/60">
                <span>v{deck.syncVersion}</span>
                <span>·</span>
                <span>doc:{deck.docId.slice(0, 8)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-edu-border mt-12 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to home
          </Link>
        </div>
      </footer>
    </main>
  )
}
