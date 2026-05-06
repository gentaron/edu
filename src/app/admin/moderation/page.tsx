"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  X,
  Flag,
  Shield,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Users,
  Zap,
  Scale,
  MessageSquare,
} from "lucide-react"
import { useModerationQueue } from "./useModerationQueue"
import type { ModerationStatus, FlagReason } from "@/lib/crdt/types"

const STATUS_CONFIG: Record<
  ModerationStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  },
  under_review: {
    label: "Under Review",
    icon: Eye,
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  approved: {
    label: "Approved",
    icon: Check,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    icon: X,
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
}

const FLAG_REASON_LABELS: Record<FlagReason, string> = {
  inappropriate: "Inappropriate",
  copyright: "Copyright",
  balance: "Balance Issue",
  spam: "Spam",
  other: "Other",
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "text-red-400",
  Ice: "text-cyan-400",
  Light: "text-yellow-300",
  Dark: "text-purple-400",
  Nature: "text-green-400",
  Water: "text-blue-400",
  Electric: "text-amber-400",
}

type FilterTab = "all" | ModerationStatus

export default function ModerationPage() {
  const {
    queue,
    stats,
    approveItem,
    rejectItem,
    flagItem,
    getItemsByStatus,
    startReview,
  } = useModerationQueue()

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState("")
  const [flagDialogId, setFlagDialogId] = useState<string | null>(null)

  const filteredItems = useMemo(
    () => getItemsByStatus(activeFilter === "all" ? undefined : activeFilter),
    [activeFilter, getItemsByStatus],
  )

  const handleReject = (itemId: string) => {
    if (rejectNote.trim()) {
      rejectItem(itemId, rejectNote.trim())
    }
    setRejectingId(null)
    setRejectNote("")
  }

  const handleFlag = (itemId: string, reason: FlagReason) => {
    flagItem(itemId, reason)
    setFlagDialogId(null)
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "under_review", label: "In Review", count: stats.underReview },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ]

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-edu-text mb-1">
              UGC Moderation Queue
            </h1>
            <p className="text-xs text-edu-muted">
              Review user-generated cards. CRDT-synced across all active moderators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Active Moderators */}
            <div className="flex items-center gap-1.5 rounded-full bg-edu-surface border border-edu-border px-3 py-1.5">
              <Users className="w-3 h-3 text-edu-accent" />
              <span className="text-[10px] text-edu-muted">
                {queue.activeModerators.length} moderator{queue.activeModerators.length !== 1 ? "s" : ""} active
              </span>
            </div>
            {queue.isConnected ? (
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-red-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Offline
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-lg border p-2.5 text-center transition-colors ${
                activeFilter === tab.key
                  ? "border-edu-accent bg-edu-accent/10"
                  : "border-edu-border bg-edu-surface hover:border-edu-accent/30"
              }`}
            >
              <div
                className={`text-sm font-bold ${
                  activeFilter === tab.key ? "text-edu-accent" : "text-edu-text"
                }`}
              >
                {tab.count}
              </div>
              <div className="text-[9px] text-edu-muted">{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Active Moderators List */}
        {queue.activeModerators.length > 0 && (
          <div className="edu-card p-3 mb-4">
            <div className="flex items-center gap-1.5 text-[10px] text-edu-muted mb-2">
              <Shield className="w-3 h-3" />
              Active moderators
            </div>
            <div className="flex flex-wrap gap-2">
              {queue.activeModerators.map((mod) => (
                <div
                  key={mod.userId}
                  className="flex items-center gap-1.5 rounded-full bg-edu-surface px-2 py-0.5 text-[10px]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-edu-text">{mod.displayName}</span>
                  {mod.reviewingItemId && (
                    <span className="text-edu-muted">
                      reviewing {mod.reviewingItemId}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="edu-card p-8 text-center">
              <Check className="w-8 h-8 text-edu-muted mx-auto mb-2" />
              <p className="text-xs text-edu-muted">
                {activeFilter === "all"
                  ? "No items in the queue."
                  : `No items with status "${activeFilter}".`}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const statusConfig = STATUS_CONFIG[item.status]
              const StatusIcon = statusConfig.icon

              return (
                <div key={item.id} className="edu-card p-4">
                  <div className="flex gap-4">
                    {/* Card Preview */}
                    <div className="w-28 shrink-0">
                      <div className="aspect-[3/4] rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 border border-edu-border flex flex-col items-center justify-center p-2">
                        <div className="text-2xl mb-1">&#x1F0A1;</div>
                        <p className="text-[9px] text-edu-text font-medium text-center leading-tight">
                          {item.preview.name}
                        </p>
                        <p className={`text-[8px] ${ELEMENT_COLORS[item.preview.element] ?? "text-edu-muted"}`}>
                          {item.preview.element}
                        </p>
                        <p className="text-[8px] text-edu-muted mt-1">
                          PWR {item.preview.power}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-edu-text mb-0.5">
                            {item.preview.name}
                          </h3>
                          <p className="text-[10px] text-edu-muted line-clamp-2">
                            {item.preview.description}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${statusConfig.className}`}
                        >
                          <StatusIcon className="w-2.5 h-2.5" />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Submitter */}
                      <div className="flex items-center gap-2 text-[10px] text-edu-muted mb-2">
                        <span>by <span className="text-edu-text">{item.submitter.displayName}</span></span>
                        <span>·</span>
                        <span>{new Date(item.submitter.submittedAt).toLocaleTimeString()}</span>
                      </div>

                      {/* Flags */}
                      {item.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.flags.map((flag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-400"
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {FLAG_REASON_LABELS[flag.reason]}
                              {flag.note && (
                                <span className="text-amber-400/60 ml-1">
                                  — {flag.note.length > 30 ? `${flag.note.slice(0, 30)}...` : flag.note}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {item.status === "pending" || item.status === "under_review" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startReview(item.id)}
                            disabled={item.status === "under_review"}
                            className="flex items-center gap-1 rounded border border-edu-border bg-edu-surface px-2.5 py-1 text-[10px] text-edu-muted hover:text-edu-text hover:border-edu-accent/30 transition-colors disabled:opacity-40"
                          >
                            <Eye className="w-3 h-3" />
                            Review
                          </button>
                          <button
                            onClick={() => approveItem(item.id)}
                            className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingId(item.id)}
                            className="flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Reject
                          </button>
                          <button
                            onClick={() => setFlagDialogId(item.id)}
                            className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <Flag className="w-3 h-3" />
                            Flag
                          </button>
                        </div>
                      ) : (
                        item.reviewNote && (
                          <p className="text-[10px] text-edu-muted italic">
                            {item.reviewNote}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Reject Dialog */}
                  {rejectingId === item.id && (
                    <div className="mt-3 pt-3 border-t border-edu-border">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                          placeholder="Rejection reason (optional)..."
                          autoFocus
                          className="flex-1 bg-edu-surface border border-edu-border rounded-lg px-3 py-2 text-xs text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent"
                        />
                        <button
                          onClick={() => handleReject(item.id)}
                          className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-[10px] text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null)
                            setRejectNote("")
                          }}
                          className="rounded-lg bg-edu-surface border border-edu-border px-3 py-2 text-[10px] text-edu-muted hover:text-edu-text transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Flag Dialog */}
                  {flagDialogId === item.id && (
                    <div className="mt-3 pt-3 border-t border-edu-border">
                      <p className="text-[10px] text-edu-muted mb-2">Select flag reason:</p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          Object.entries(FLAG_REASON_LABELS) as [FlagReason, string][]
                        ).map(([reason, label]) => (
                          <button
                            key={reason}
                            onClick={() => handleFlag(item.id, reason)}
                            className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400 hover:bg-amber-500/20 transition-colors"
                          >
                            <Flag className="w-3 h-3" />
                            {label}
                          </button>
                        ))}
                        <button
                          onClick={() => setFlagDialogId(null)}
                          className="rounded-lg bg-edu-surface border border-edu-border px-3 py-1 text-[10px] text-edu-muted hover:text-edu-text transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-edu-border mt-12 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
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
