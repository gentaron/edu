/**
 * Phase θ — CRDT Surface Types
 *
 * TypeScript interfaces matching the Rust crate types from `edu-crdt-bridge`.
 * These are the canonical frontend type definitions for Automerge-backed
 * document models used across decks, replays, lore wiki, and moderation.
 */

// ─── Primitives ────────────────────────────────────────────────

/** Opaque document handle from the Automerge repo */
export type DocumentId = string & { readonly __brand: unique symbol }

/** Hex-encoded BLAKE3 hash used as content-addressable identifier */
export type ContentHash = string & { readonly __brand: unique symbol }

/** ISO-8601 datetime string */
export type Timestamp = string

/** UUID v4 */
export type UserId = string

/** Device fingerprint for presence tracking */
export type DeviceId = string

// ─── Deck Types ────────────────────────────────────────────────

export interface DeckCharacter {
  id: string
  name: string
  element: string
  tier: string
}

export interface DeckEntry {
  docId: DocumentId
  name: string
  characters: DeckCharacter[]
  lastModified: Timestamp
  owner: UserId
  collaboratorCount: number
  syncVersion: number
}

export interface DeckSyncState {
  connectedDevices: DeviceId[]
  pendingChanges: number
  lastSyncAt: Timestamp
  isSyncing: boolean
}

export interface PresenceDevice {
  deviceId: DeviceId
  userId: UserId
  displayName: string
  color: string
  lastSeen: Timestamp
  currentPath?: string
}

// ─── Replay & Annotation Types ─────────────────────────────────

export type AnnotationStatus = "draft" | "pending_verification" | "verified" | "rejected"

export interface AnnotationEntry {
  id: string
  turnIndex: number
  authorId: UserId
  authorName: string
  body: string
  status: AnnotationStatus
  createdAt: Timestamp
  zkProofHash?: ContentHash
  /** Cursor position within the turn for inline annotations */
  cursorOffset?: number
}

export interface AnnotationDensityPoint {
  turnIndex: number
  count: number
  hasUnverified: boolean
}

export interface ReplayPresence {
  viewers: Array<{
    userId: UserId
    displayName: string
    cursorTurn: number
    color: string
    isSpectator: boolean
  }>
}

// ─── Wiki Types ────────────────────────────────────────────────

export type WikiNamespace = "canon" | "community" | "draft"
export type WikiPageStatus = "draft" | "published" | "archived"

export interface WikiPageMetadata {
  title: string
  namespace: WikiNamespace
  status: WikiPageStatus
  slug: string
  createdAt: Timestamp
  updatedAt: Timestamp
  lastEditedBy: UserId
  editCount: number
  /** Genesis Vault content hash if this is a canon page */
  genesisVaultHash?: ContentHash
  /** Fork source docId if this was forked from another page */
  forkedFrom?: DocumentId
}

export interface WikiPage {
  docId: DocumentId
  metadata: WikiPageMetadata
  body: string
  /** Structured front-matter fields */
  fields: Record<string, string>
  /** Pages that link to this page */
  backlinks: Array<{
    docId: DocumentId
    title: string
    slug: string
  }>
}

export interface WikiEditEntry {
  userId: UserId
  userName: string
  timestamp: Timestamp
  summary: string
}

export interface WikiSyncState {
  isConnected: boolean
  activeEditors: number
  lastSyncAt: Timestamp
  conflictCount: number
}

// ─── Moderation Types ──────────────────────────────────────────

export type ModerationStatus = "pending" | "under_review" | "approved" | "rejected"
export type FlagReason = "inappropriate" | "copyright" | "balance" | "spam" | "other"

export interface ModerationFlag {
  reason: FlagReason
  reportedBy: UserId
  reporterName: string
  timestamp: Timestamp
  note?: string
}

export interface ModerationItem {
  id: string
  docId: DocumentId
  /** UGC card preview data */
  preview: {
    name: string
    description: string
    element: string
    power: number
    imageUrl?: string
  }
  submitter: {
    userId: UserId
    displayName: string
    submittedAt: Timestamp
  }
  flags: ModerationFlag[]
  status: ModerationStatus
  reviewedBy?: UserId
  reviewedAt?: Timestamp
  reviewNote?: string
}

export interface ModerationQueueState {
  items: ModerationItem[]
  activeModerators: Array<{
    userId: UserId
    displayName: string
    reviewingItemId?: string
  }>
  isConnected: boolean
}
