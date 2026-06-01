"use client"

import { useState, useMemo, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  BookOpen,
  Users,
  FileText,
  GitFork,
  ArrowLeft,
  Crown,
  Shield,
  PenLine,
} from "lucide-react"
import { useWikiSync } from "./useWikiSync"
import type { WikiNamespace } from "@/lib/crdt/types"

const NAMESPACES: {
  key: WikiNamespace
  label: string
  description: string
  icon: typeof BookOpen
  color: string
  badgeColor: string
}[] = [
  {
    key: "canon",
    label: "Canon",
    description: "Verified lore entries from the Genesis Vault",
    icon: Crown,
    color: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-400",
  },
  {
    key: "community",
    label: "Community",
    description: "Community-maintained pages with PR model",
    icon: Users,
    color: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-400",
  },
  {
    key: "draft",
    label: "Draft",
    description: "Work-in-progress pages and forks",
    icon: PenLine,
    color: "text-zinc-400",
    badgeColor: "bg-zinc-500/10 text-zinc-400",
  },
]

function WikiLoading() {
  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-edu-surface rounded mb-2" />
          <div className="h-4 w-64 bg-edu-surface rounded mb-6" />
          <div className="h-10 bg-edu-surface rounded-lg mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-edu-surface rounded-lg mb-4" />
          ))}
        </div>
      </div>
    </main>
  )
}

function WikiLandingPage() {
  const router = useRouter()
  const { pages, syncState, getPagesByNamespace, searchPages } = useWikiSync()
  const [search, setSearch] = useState("")

  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    return searchPages(search.trim())
  }, [search, searchPages])

  return (
    <main className="min-h-screen bg-edu-bg pt-16 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-edu-text mb-1">Lore Wiki</h1>
            <p className="text-xs text-edu-muted">
              Collaborative lore encyclopedia with CRDT-based conflict-free editing.
              {syncState.activeEditors > 0 && (
                <span className="ml-1 text-edu-accent">
                  {syncState.activeEditors} editor{syncState.activeEditors !== 1 ? "s" : ""} active
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => router.push("/lore/wiki/new")}
            className="flex items-center gap-1.5 rounded-lg bg-edu-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-edu-accent2 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Page
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-edu-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lore pages..."
            className="w-full bg-edu-surface border border-edu-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-edu-text placeholder:text-edu-muted focus:outline-none focus:border-edu-accent"
          />
        </div>

        {/* Search Results */}
        {searchResults !== null ? (
          <div>
            <p className="text-xs text-edu-muted mb-4">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{search}&quot;
            </p>
            {searchResults.length === 0 ? (
              <p className="text-xs text-edu-muted text-center py-12">
                No pages found.
              </p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((page) => {
                  const ns = NAMESPACES.find((n) => n.key === page.metadata.namespace)
                  return (
                    <Link
                      key={page.docId}
                      href={`/lore/wiki/${encodeURIComponent(page.metadata.slug)}`}
                      className="block edu-card p-3 hover:border-edu-accent transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-edu-text">
                          {page.metadata.title}
                        </span>
                        {ns && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${ns.badgeColor}`}>
                            {ns.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-edu-muted leading-relaxed line-clamp-2">
                        {page.body.slice(0, 120)}...
                      </p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Namespace Sections */
          <div className="space-y-6">
            {NAMESPACES.map((ns) => {
              const nsPages = getPagesByNamespace(ns.key)
              const Icon = ns.icon
              return (
                <section key={ns.key} className="edu-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${ns.color}`} />
                      <h2 className="text-sm font-bold text-edu-text">{ns.label}</h2>
                      <span className="text-[10px] text-edu-muted">{nsPages.length}</span>
                    </div>
                    {ns.key === "community" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-edu-muted">
                        <GitFork className="w-3 h-3" />
                        Fork/PR model
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-edu-muted mb-3">{ns.description}</p>

                  {nsPages.length === 0 ? (
                    <p className="text-[10px] text-edu-muted text-center py-4">
                      No pages yet.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {nsPages.map((page) => (
                        <Link
                          key={page.docId}
                          href={`/lore/wiki/${encodeURIComponent(page.metadata.slug)}`}
                          className="flex items-center justify-between p-2 rounded hover:bg-edu-surface transition-colors group"
                        >
                          <div>
                            <span className="text-xs text-edu-text group-hover:text-edu-accent transition-colors">
                              {page.metadata.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] text-edu-muted">
                                {page.metadata.editCount} edits
                              </span>
                              {page.metadata.forkedFrom && (
                                <span className="text-[9px] text-edu-accent flex items-center gap-0.5">
                                  <GitFork className="w-2.5 h-2.5" />
                                  forked
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-edu-muted/50">
                            {new Date(page.metadata.updatedAt).toLocaleDateString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
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

export default function LoreWikiPageWrapper() {
  return (
    <Suspense fallback={<WikiLoading />}>
      <WikiLandingPage />
    </Suspense>
  )
}
