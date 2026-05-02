"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Edit3,
  GitFork,
  Clock,
  User,
  Link as LinkIcon,
  Shield,
  FileText,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useWikiSync } from "../useWikiSync"

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30" },
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  archived: { label: "Archived", className: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
}

const NAMESPACE_BADGE: Record<string, { label: string; className: string }> = {
  canon: { label: "Canon", className: "bg-amber-500/10 text-amber-400" },
  community: { label: "Community", className: "bg-blue-500/10 text-blue-400" },
  draft: { label: "Draft", className: "bg-zinc-500/10 text-zinc-400" },
}

export default function WikiSlugPage() {
  const params = useParams<{ slug: string }>()
  const { getPage, getEditHistory, forkPage, updatePage, syncState } = useWikiSync()

  const slug = decodeURIComponent(params.slug)
  const page = getPage(slug)

  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState("")

  const editHistory = useMemo(
    () => (page ? getEditHistory(page.docId) : []),
    [page, getEditHistory]
  )

  const handleStartEdit = () => {
    if (page) {
      setEditBody(page.body)
      setIsEditing(true)
    }
  }

  const handleSaveEdit = () => {
    if (page && editBody.trim()) {
      updatePage(page.docId, { body: editBody })
      setIsEditing(false)
    }
  }

  const handleFork = () => {
    if (page) {
      const forked = forkPage(page.docId)
      if (forked) {
        // In production: navigate to the forked page
      }
    }
  }

  if (!page) {
    return (
      <main className="min-h-screen bg-edu-bg pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <Link
            href="/lore/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to wiki
          </Link>
          <div className="edu-card p-8 text-center">
            <FileText className="w-8 h-8 text-edu-muted mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-edu-text mb-1">Page not found</h2>
            <p className="text-xs text-edu-muted">
              The page &quot;{slug}&quot; does not exist yet.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const status = STATUS_BADGE[page.metadata.status] ?? STATUS_BADGE.draft!
  const namespace = NAMESPACE_BADGE[page.metadata.namespace] ?? NAMESPACE_BADGE.draft!

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-edu-muted mb-6">
          <Link href="/lore/wiki" className="hover:text-edu-accent transition-colors">
            Wiki
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-edu-text">{page.metadata.title}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded ${namespace.className}`}>
                {namespace.label}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${status.className}`}>
                {status.label}
              </span>
              {page.metadata.genesisVaultHash && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400/70">
                  <Shield className="w-3 h-3" />
                  Genesis Vault
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold text-edu-text">{page.metadata.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-edu-muted">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {page.metadata.lastEditedBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(page.metadata.updatedAt).toLocaleDateString()}
              </span>
              <span>{page.metadata.editCount} edits</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 rounded-lg bg-edu-surface border border-edu-border px-3 py-1.5 text-[10px] text-edu-muted hover:text-edu-accent hover:border-edu-accent transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={handleFork}
              className="flex items-center gap-1.5 rounded-lg bg-edu-surface border border-edu-border px-3 py-1.5 text-[10px] text-edu-muted hover:text-edu-accent hover:border-edu-accent transition-colors"
            >
              <GitFork className="w-3 h-3" />
              Fork
            </button>
          </div>
        </div>

        {/* Structured Metadata Fields */}
        {Object.keys(page.fields).length > 0 && (
          <div className="edu-card p-4 mb-4">
            <h3 className="text-xs font-semibold text-edu-text mb-2">Metadata</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(page.fields).map(([key, value]) => (
                <div key={key} className="rounded bg-edu-surface px-2.5 py-1.5">
                  <span className="text-[9px] text-edu-muted uppercase tracking-wider block">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] text-edu-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="edu-card p-6 mb-4">
          {isEditing ? (
            <div>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={20}
                className="w-full bg-edu-surface border border-edu-border rounded-lg px-3 py-2 text-xs text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent resize-y font-mono mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-edu-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-edu-accent2 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-edu-surface border border-edu-border px-4 py-1.5 text-xs text-edu-muted hover:text-edu-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              {/* Simple markdown rendering for display */}
              {page.body.split("\n").map((line, i) => {
                if (line.startsWith("## "))
                  return (
                    <h2 key={i} className="text-sm font-bold text-edu-text mt-4 mb-2">
                      {line.slice(3)}
                    </h2>
                  )
                if (line.startsWith("- "))
                  return (
                    <li key={i} className="text-xs text-edu-muted ml-4 leading-relaxed">
                      {line.slice(2)}
                    </li>
                  )
                if (line.startsWith("# ")) return null // Skip h1 since we show it in the header
                if (line.trim() === "") return <br key={i} />
                return (
                  <p key={i} className="text-xs text-edu-muted leading-relaxed">
                    {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-edu-text font-medium">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )
              })}
            </div>
          )}
        </div>

        {/* Fork Source Indicator */}
        {page.metadata.forkedFrom && (
          <div className="rounded-lg border border-edu-accent/20 bg-edu-accent/5 p-3 mb-4">
            <div className="flex items-center gap-1.5 text-[10px] text-edu-accent">
              <GitFork className="w-3 h-3" />
              <span>Forked from doc:{page.metadata.forkedFrom}</span>
            </div>
          </div>
        )}

        {/* Genesis Vault Link */}
        {page.metadata.genesisVaultHash && (
          <div className="edu-card p-4 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-edu-text">Genesis Vault</span>
            </div>
            <p className="text-[10px] text-edu-muted mt-1">
              This canon page is anchored in the Genesis Vault with content hash:
            </p>
            <code className="text-[10px] text-amber-400/80 font-mono mt-1 block">
              {page.metadata.genesisVaultHash}
            </code>
            <button className="mt-2 inline-flex items-center gap-1 text-[10px] text-edu-accent hover:underline">
              <ExternalLink className="w-3 h-3" />
              View in Genesis Vault
            </button>
          </div>
        )}

        {/* Backlinks */}
        {page.backlinks.length > 0 && (
          <div className="edu-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-3.5 h-3.5 text-edu-accent" />
              <span className="text-xs font-medium text-edu-text">
                Backlinks ({page.backlinks.length})
              </span>
            </div>
            <div className="space-y-1">
              {page.backlinks.map((bl) => (
                <Link
                  key={bl.docId}
                  href={`/lore/wiki/${encodeURIComponent(bl.slug)}`}
                  className="flex items-center gap-1 text-[10px] text-edu-muted hover:text-edu-accent transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  {bl.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Edit History */}
        {editHistory.length > 0 && (
          <div className="edu-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-edu-accent" />
              <span className="text-xs font-medium text-edu-text">Edit History</span>
            </div>
            <div className="space-y-2">
              {editHistory.map((edit, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between text-[10px] border-b border-edu-border last:border-0 pb-2 last:pb-0"
                >
                  <div>
                    <span className="text-edu-text font-medium">{edit.userName}</span>
                    <span className="text-edu-muted ml-1.5">{edit.summary}</span>
                  </div>
                  <span className="text-edu-muted whitespace-nowrap ml-2">
                    {new Date(edit.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync Status */}
        <div className="flex items-center gap-2 text-[9px] text-edu-muted/60 mt-4">
          <span>doc:{page.docId.slice(0, 8)}</span>
          <span>·</span>
          <span>{syncState.isConnected ? "synced" : "offline"}</span>
          <span>·</span>
          <span>last sync: {new Date(syncState.lastSyncAt).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-edu-border mt-12 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/lore/wiki"
            className="inline-flex items-center gap-1.5 text-xs text-edu-muted hover:text-edu-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to wiki
          </Link>
        </div>
      </footer>
    </main>
  )
}
