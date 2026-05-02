"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  WikiPage,
  WikiPageMetadata,
  WikiNamespace,
  WikiPageStatus,
  WikiEditEntry,
  WikiSyncState,
  DocumentId,
  ContentHash,
  UserId,
  Timestamp,
} from "@/lib/crdt/types"

// ─── Mock Data ─────────────────────────────────────────────────

const MOCK_PAGES: WikiPage[] = [
  {
    docId: "wiki-001" as unknown as DocumentId,
    metadata: {
      title: "Glacius — The Eternal Sentinel",
      namespace: "canon",
      status: "published",
      slug: "glacius",
      createdAt: "2025-01-15T00:00:00Z",
      updatedAt: "2025-06-20T12:00:00Z",
      lastEditedBy: "user-001" as unknown as UserId,
      editCount: 23,
      genesisVaultHash: "0xgvh001" as unknown as ContentHash,
    },
    body: `# Glacius — The Eternal Sentinel

Glacius is one of the oldest known entities in the Eternal Dominion universe. Born from the primordial ice of the E16 star system, Glacius serves as the guardian of the Frost Dimension.

## Abilities

- **Frozen Citadel**: Creates an impenetrable ice barrier
- **Hoarfrost**: Freezes opponents in crystalline ice
- **Glacial Drift**: Passive regeneration during winter turns

## Lore

Glacius was the first guardian appointed by the Council of Elements during the First Convergence...`,
    fields: {
      element: "Ice",
      tier: "Tier 1",
      role: "Guardian",
      civilization: "Dioclenis",
      first_appearance: "Episode 1",
    },
    backlinks: [
      { docId: "wiki-010" as unknown as DocumentId, title: "Frost Dimension", slug: "frost-dimension" },
      { docId: "wiki-011" as unknown as DocumentId, title: "Dioclenis", slug: "dioclenis" },
    ],
  },
  {
    docId: "wiki-002" as unknown as DocumentId,
    metadata: {
      title: "Apolon — The Light Bearer",
      namespace: "canon",
      status: "published",
      slug: "apolon",
      createdAt: "2025-01-20T00:00:00Z",
      updatedAt: "2025-06-18T09:00:00Z",
      lastEditedBy: "user-002" as unknown as UserId,
      editCount: 18,
      genesisVaultHash: "0xgvh002" as unknown as ContentHash,
    },
    body: `# Apolon — The Light Bearer

Apolon is the central figure of the Light Element pantheon. Wielding the Radiant Blade, Apolon stands as the primary protagonist of the Eternal Dominion saga.

## Abilities

- **Radiant Slash**: A powerful light-based attack
- **Solar Flare**: Area-of-effect burst damage
- **Divine Shield**: Invulnerability for one turn`,
    fields: {
      element: "Light",
      tier: "Tier 1",
      role: "Protagonist",
      civilization: "Elyseon",
      first_appearance: "Episode 1",
    },
    backlinks: [
      { docId: "wiki-012" as unknown as DocumentId, title: "Elyseon", slug: "elyseon" },
      { docId: "wiki-013" as unknown as DocumentId, title: "Radiant Blade", slug: "radiant-blade" },
    ],
  },
  {
    docId: "wiki-003" as unknown as DocumentId,
    metadata: {
      title: "Community Tier List — Season 4",
      namespace: "community",
      status: "published",
      slug: "community-tier-list-s4",
      createdAt: "2025-05-01T00:00:00Z",
      updatedAt: "2025-06-15T18:00:00Z",
      lastEditedBy: "user-003" as unknown as UserId,
      editCount: 45,
    },
    body: `# Community Tier List — Season 4

This community-maintained tier list ranks all characters based on competitive performance.

## S Tier
- Apolon
- Glacius
- Umbra

## A Tier
- Solara
- Rime Warden`,
    fields: {
      season: "4",
      last_updated: "2025-06-15",
      contributors: "12",
    },
    backlinks: [],
  },
  {
    docId: "wiki-004" as unknown as DocumentId,
    metadata: {
      title: "Unreleased Element: Void",
      namespace: "draft",
      status: "draft",
      slug: "unreleased-void",
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-06-19T20:00:00Z",
      lastEditedBy: "user-001" as unknown as UserId,
      editCount: 5,
      forkedFrom: "wiki-010" as unknown as DocumentId,
    },
    body: `# Unreleased Element: Void

This is a speculative page about the potential Void element.

## Theories

- Void could be a counter-element to Light
- Void Walkers might appear in Season 5`,
    fields: {
      element: "Void (speculative)",
      status: "Theoretical",
    },
    backlinks: [],
  },
]

const MOCK_EDIT_HISTORY: Record<string, WikiEditEntry[]> = {
  "wiki-001": [
    { userId: "user-001" as unknown as UserId, userName: "Alice", timestamp: "2025-06-20T12:00:00Z", summary: "Updated abilities section" },
    { userId: "user-002" as unknown as UserId, userName: "Bob", timestamp: "2025-06-18T10:00:00Z", summary: "Fixed typo in lore section" },
    { userId: "user-001" as unknown as UserId, userName: "Alice", timestamp: "2025-06-15T08:00:00Z", summary: "Added Hoarfrost ability details" },
  ],
}

// ─── Hook ──────────────────────────────────────────────────────

export function useWikiSync(initialSlug?: string) {
  const [pages, setPages] = useState<WikiPage[]>(MOCK_PAGES)
  const [syncState, setSyncState] = useState<WikiSyncState>({
    isConnected: true,
    activeEditors: 1,
    lastSyncAt: new Date().toISOString(),
    conflictCount: 0,
  })

  /** Get all pages filtered by namespace */
  const getPagesByNamespace = useCallback(
    (namespace: WikiNamespace): WikiPage[] => {
      return pages.filter((p) => p.metadata.namespace === namespace)
    },
    [pages],
  )

  /** Get a single page by slug */
  const getPage = useCallback(
    (slug: string): WikiPage | undefined => {
      return pages.find((p) => p.metadata.slug === slug)
    },
    [pages],
  )

  /** Search pages by title or body content */
  const searchPages = useCallback(
    (query: string): WikiPage[] => {
      const q = query.toLowerCase()
      return pages.filter(
        (p) =>
          p.metadata.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q),
      )
    },
    [pages],
  )

  /** Get edit history for a page */
  const getEditHistory = useCallback(
    (docId: string): WikiEditEntry[] => {
      return MOCK_EDIT_HISTORY[docId] ?? []
    },
    [],
  )

  /** Create a new wiki page (initialized as a new Automerge document) */
  const createPage = useCallback(
    (metadata: Partial<WikiPageMetadata>, body: string) => {
      const newPage: WikiPage = {
        docId: `wiki-${Date.now()}` as unknown as DocumentId,
        metadata: {
          title: metadata.title ?? "Untitled",
          namespace: metadata.namespace ?? "draft",
          status: "draft" as WikiPageStatus,
          slug: metadata.slug ?? `untitled-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: "user-001" as unknown as UserId,
          editCount: 0,
          ...metadata,
        },
        body,
        fields: {},
        backlinks: [],
      }
      // In production: Automerge Repo → create → broadcast
      setPages((prev) => [newPage, ...prev])
      setSyncState((prev) => ({ ...prev, activeEditors: prev.activeEditors + 1 }))
      return newPage
    },
    [],
  )

  /** Fork an existing page — creates a new document with copied content */
  const forkPage = useCallback(
    (sourceDocId: string) => {
      const source = pages.find((p) => p.docId === sourceDocId)
      if (!source) return null

      const forkedPage: WikiPage = {
        ...source,
        docId: `wiki-fork-${Date.now()}` as unknown as DocumentId,
        metadata: {
          ...source.metadata,
          status: "draft" as WikiPageStatus,
          namespace: "draft" as WikiNamespace,
          slug: `${source.metadata.slug}-fork-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEditedBy: "user-001" as unknown as UserId,
          editCount: 0,
          forkedFrom: source.docId,
          genesisVaultHash: undefined,
        },
        backlinks: [],
      }
      // In production: clone Automerge document via binary snapshot
      setPages((prev) => [...prev, forkedPage])
      return forkedPage
    },
    [pages],
  )

  /** Update a page's body and metadata */
  const updatePage = useCallback((docId: string, updates: Partial<WikiPage>) => {
    // In production: Automerge.change(doc, (d) => { ... })
    setPages((prev) =>
      prev.map((p) =>
        p.docId === docId
          ? {
              ...p,
              ...updates,
              metadata: { ...p.metadata, ...updates.metadata, updatedAt: new Date().toISOString() as Timestamp },
            }
          : p,
      ),
    )
  }, [])

  return {
    pages,
    syncState,
    getPagesByNamespace,
    getPage,
    searchPages,
    getEditHistory,
    createPage,
    forkPage,
    updatePage,
  }
}
