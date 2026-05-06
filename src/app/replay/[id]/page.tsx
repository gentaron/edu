"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Users,
} from "lucide-react"
import { useAnnotationLayer } from "./useAnnotationLayer"

export default function ReplayPage() {
  const params = useParams<{ id: string }>()
  const {
    annotations,
    viewers,
    currentTurn,
    totalTurns,
    isSpectator,
    setCurrentTurn,
    addAnnotation,
    getAnnotationsForTurn,
    getAnnotationDensity,
    submitForVerification,
    toggleSpectatorMode,
  } = useAnnotationLayer(params.id)

  const [editorBody, setEditorBody] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const density = useMemo(() => getAnnotationDensity(), [getAnnotationDensity])
  const turnAnnotations = useMemo(
    () => getAnnotationsForTurn(currentTurn),
    [getAnnotationsForTurn, currentTurn],
  )

  const handleAddAnnotation = () => {
    if (editorBody.trim()) {
      addAnnotation(currentTurn, editorBody.trim())
      setEditorBody("")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        )
      case "pending_verification":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
            <AlertCircle className="w-3 h-3" />
            Pending Verification
          </span>
        )
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
            Draft
          </span>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-full bg-edu-surface border border-edu-border p-1.5 text-edu-muted hover:text-edu-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </a>
            <div>
              <h1 className="text-lg font-bold text-edu-text">
                Replay Viewer
              </h1>
              <p className="text-[10px] text-edu-muted font-mono">
                doc:{params.id} · Turn {currentTurn}/{totalTurns}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Spectator Mode Toggle */}
            <button
              onClick={toggleSpectatorMode}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                isSpectator
                  ? "border-edu-border bg-edu-surface text-edu-muted"
                  : "border-edu-accent/30 bg-edu-accent/10 text-edu-accent"
              }`}
            >
              {isSpectator ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  Spectator
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  Active
                </>
              )}
            </button>
            {/* Viewer Count */}
            <div className="flex items-center gap-1.5 rounded-full bg-edu-surface border border-edu-border px-3 py-1.5">
              <Users className="w-3 h-3 text-edu-muted" />
              <span className="text-[10px] text-edu-muted">
                {viewers.viewers.length + 1} watching
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Replay Area */}
          <div>
            {/* Battle Replay Visual */}
            <div className="edu-card p-6 mb-4">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder battle visual */}
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-30">&#x2694;</div>
                  <p className="text-xs text-edu-muted">
                    Turn {currentTurn} — Battle Replay
                  </p>
                </div>

                {/* Ephemeral Presence Cursors */}
                {!isSpectator &&
                  viewers.viewers
                    .filter((v) => !v.isSpectator)
                    .map((viewer) => (
                      <div
                        key={viewer.userId}
                        className="absolute top-4 right-4 flex items-center gap-1.5"
                        style={{ color: viewer.color }}
                      >
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: viewer.color }}
                        />
                        <span className="text-[10px] font-medium">
                          {viewer.displayName}
                        </span>
                        <span className="text-[9px] opacity-60">
                          T{viewer.cursorTurn}
                        </span>
                      </div>
                    ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="edu-card p-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTurn(Math.max(1, currentTurn - 1))}
                  disabled={currentTurn <= 1}
                  className="rounded bg-edu-surface border border-edu-border p-1 text-edu-muted hover:text-edu-accent disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-1">
                  {density.map((point) => {
                    if (point.turnIndex === 0) return null
                    const isActive = point.turnIndex === currentTurn
                    const hasAnnotations = point.count > 0
                    const hasUnverified = point.hasUnverified
                    return (
                      <button
                        key={point.turnIndex}
                        onClick={() => setCurrentTurn(point.turnIndex)}
                        className="relative flex-1 flex flex-col items-center gap-1"
                        title={`Turn ${point.turnIndex} — ${point.count} annotation${point.count !== 1 ? "s" : ""}`}
                      >
                        <div className="w-full h-1 rounded-full bg-edu-surface">
                          {isActive && (
                            <div className="h-full bg-edu-accent rounded-full transition-all" />
                          )}
                        </div>
                        <div
                          className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                            isActive
                              ? "border-edu-accent bg-edu-accent scale-125"
                              : hasAnnotations
                                ? hasUnverified
                                  ? "border-amber-400 bg-amber-400/30"
                                  : "border-edu-accent/50 bg-edu-accent/20"
                                : "border-edu-border bg-transparent"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentTurn(Math.min(totalTurns, currentTurn + 1))}
                  disabled={currentTurn >= totalTurns}
                  className="rounded bg-edu-surface border border-edu-border p-1 text-edu-muted hover:text-edu-accent disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Turn Annotations */}
            <div className="edu-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-edu-accent" />
                <span className="text-xs font-medium text-edu-text">
                  Annotations — Turn {currentTurn}
                </span>
                <span className="text-[10px] text-edu-muted">
                  ({turnAnnotations.length})
                </span>
              </div>

              {turnAnnotations.length === 0 ? (
                <p className="text-xs text-edu-muted text-center py-6">
                  No annotations for this turn.
                </p>
              ) : (
                <div className="space-y-3">
                  {turnAnnotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="rounded-lg border border-edu-border bg-edu-surface/50 p-3"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-edu-text">
                            {ann.authorName}
                          </span>
                          <span className="text-[9px] text-edu-muted">
                            {new Date(ann.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {getStatusBadge(ann.status)}
                      </div>
                      <p className="text-xs text-edu-muted leading-relaxed">
                        {ann.body}
                      </p>
                      {ann.status === "draft" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => submitForVerification(ann.id)}
                            className="text-[10px] text-edu-accent hover:underline"
                          >
                            Submit for verification
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Annotation Editor Panel */}
          <div className="space-y-4">
            {/* Spectator Info */}
            <div className="edu-card p-4">
              <h3 className="text-xs font-semibold text-edu-text mb-2">
                Live Viewers
              </h3>
              <div className="space-y-1.5">
                {viewers.viewers.map((viewer) => (
                  <div
                    key={viewer.userId}
                    className="flex items-center gap-2 text-[10px]"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: viewer.color }}
                    />
                    <span className="text-edu-muted">
                      {viewer.displayName}
                    </span>
                    <span className="text-edu-muted/50">
                      @ turn {viewer.cursorTurn}
                    </span>
                    {viewer.isSpectator && (
                      <span className="text-[9px] text-edu-muted/40 italic">
                        spectator
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="edu-card p-4 sticky top-20">
              <h3 className="text-xs font-semibold text-edu-text mb-2">
                Add Annotation
              </h3>
              <p className="text-[10px] text-edu-muted mb-3">
                Markdown supported. Annotations are stored in the CRDT and
                synced across all connected clients.
              </p>
              <textarea
                value={editorBody}
                onChange={(e) => setEditorBody(e.target.value)}
                placeholder="Describe what happened this turn..."
                rows={5}
                className="w-full bg-edu-surface border border-edu-border rounded-lg px-3 py-2 text-xs text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent resize-none mb-2"
              />
              <button
                onClick={handleAddAnnotation}
                disabled={!editorBody.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-edu-accent px-4 py-2 text-xs font-medium text-white hover:bg-edu-accent2 transition-colors disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                Add to Turn {currentTurn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
