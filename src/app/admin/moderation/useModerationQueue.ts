"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  ModerationItem,
  ModerationStatus,
  ModerationFlag,
  ModerationQueueState,
  FlagReason,
  DocumentId,
  UserId,
  Timestamp,
} from "@/lib/crdt/types"

// ─── Mock Data ─────────────────────────────────────────────────

const MOCK_ITEMS: ModerationItem[] = [
  {
    id: "mod-001",
    docId: "ugc-001" as unknown as DocumentId,
    preview: {
      name: "Inferno Drake",
      description: "A massive dragon born from volcanic eruptions. Deals area damage to all enemies.",
      element: "Fire",
      power: 8500,
    },
    submitter: {
      userId: "user-010" as unknown as UserId,
      displayName: "DragonSlayer99",
      submittedAt: new Date(Date.now() - 3_600_000).toISOString(),
    },
    flags: [
      {
        reason: "balance",
        reportedBy: "user-020" as unknown as UserId,
        reporterName: "BalanceBot",
        timestamp: new Date(Date.now() - 1_800_000).toISOString(),
        note: "Power level exceeds Tier 1 maximum by 500",
      },
    ],
    status: "pending",
  },
  {
    id: "mod-002",
    docId: "ugc-002" as unknown as DocumentId,
    preview: {
      name: "Void Assassin",
      description: "Strikes from the shadows, dealing critical damage to isolated targets.",
      element: "Dark",
      power: 7200,
    },
    submitter: {
      userId: "user-011" as unknown as UserId,
      displayName: "ShadowMaster",
      submittedAt: new Date(Date.now() - 7_200_000).toISOString(),
    },
    flags: [
      {
        reason: "copyright",
        reportedBy: "user-021" as unknown as UserId,
        reporterName: "ContentGuard",
        timestamp: new Date(Date.now() - 5_400_000).toISOString(),
        note: "Description closely matches an existing character from another game",
      },
    ],
    status: "under_review",
    reviewedBy: "user-030" as unknown as UserId,
  },
  {
    id: "mod-003",
    docId: "ugc-003" as unknown as DocumentId,
    preview: {
      name: "Nature's Bloom",
      description: "Heals all allies and applies a regeneration buff for 3 turns.",
      element: "Nature",
      power: 4800,
    },
    submitter: {
      userId: "user-012" as unknown as UserId,
      displayName: "GardenKeeper",
      submittedAt: new Date(Date.now() - 14_400_000).toISOString(),
    },
    flags: [],
    status: "pending",
  },
  {
    id: "mod-004",
    docId: "ugc-004" as unknown as DocumentId,
    preview: {
      name: "Celestial Judge",
      description: "Passes judgment on the battlefield, instantly defeating the weakest enemy.",
      element: "Light",
      power: 9200,
    },
    submitter: {
      userId: "user-013" as unknown as UserId,
      displayName: "HolyRoller",
      submittedAt: new Date(Date.now() - 21_600_000).toISOString(),
    },
    flags: [
      {
        reason: "inappropriate",
        reportedBy: "user-022" as unknown as UserId,
        reporterName: "CommunityMod",
        timestamp: new Date(Date.now() - 10_800_000).toISOString(),
        note: "Name may be offensive in some cultural contexts",
      },
      {
        reason: "balance",
        reportedBy: "user-023" as unknown as UserId,
        reporterName: "AutoBalance",
        timestamp: new Date(Date.now() - 7_200_000).toISOString(),
      },
    ],
    status: "pending",
  },
]

const INITIAL_STATE: ModerationQueueState = {
  items: MOCK_ITEMS,
  activeModerators: [
    {
      userId: "user-030" as unknown as UserId,
      displayName: "ModBot",
      reviewingItemId: "mod-002",
    },
  ],
  isConnected: true,
}

// ─── Hook ──────────────────────────────────────────────────────

export function useModerationQueue() {
  const [queue, setQueue] = useState<ModerationQueueState>(INITIAL_STATE)

  /** Approve a UGC card — moves to verified state in the CRDT */
  const approveItem = useCallback((itemId: string) => {
    // In production: Automerge.change(doc, (d) => { d.items.find(id).status = "approved" })
    setQueue((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "approved" as ModerationStatus,
              reviewedBy: "user-001" as unknown as UserId,
              reviewedAt: new Date().toISOString() as Timestamp,
              reviewNote: "Approved by moderator",
            }
          : item,
      ),
      activeModerators: prev.activeModerators.map((m) =>
        m.reviewingItemId === itemId
          ? { ...m, reviewingItemId: undefined }
          : m,
      ),
    }))
  }, [])

  /** Reject a UGC card with an optional reason note */
  const rejectItem = useCallback((itemId: string, note?: string) => {
    // In production: Automerge.change(doc, (d) => { ... })
    setQueue((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "rejected" as ModerationStatus,
              reviewedBy: "user-001" as unknown as UserId,
              reviewedAt: new Date().toISOString() as Timestamp,
              reviewNote: note ?? "Rejected by moderator",
            }
          : item,
      ),
      activeModerators: prev.activeModerators.map((m) =>
        m.reviewingItemId === itemId
          ? { ...m, reviewingItemId: undefined }
          : m,
      ),
    }))
  }, [])

  /** Add a flag to a UGC card */
  const flagItem = useCallback((itemId: string, reason: FlagReason, note?: string) => {
    const flag: ModerationFlag = {
      reason,
      reportedBy: "user-001" as unknown as UserId,
      reporterName: "You",
      timestamp: new Date().toISOString() as Timestamp,
      note,
    }
    setQueue((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              flags: [...item.flags, flag],
              status: item.status === "pending"
                ? ("under_review" as ModerationStatus)
                : item.status,
            }
          : item,
      ),
    }))
  }, [])

  /** Filter queue items by status */
  const getItemsByStatus = useCallback(
    (status?: ModerationStatus): ModerationItem[] => {
      if (!status) return queue.items
      return queue.items.filter((item) => item.status === status)
    },
    [queue.items],
  )

  /** Start reviewing an item — marks it as under review */
  const startReview = useCallback((itemId: string) => {
    setQueue((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId && item.status === "pending"
          ? { ...item, status: "under_review" as ModerationStatus }
          : item,
      ),
      activeModerators: prev.activeModerators.map((m) =>
        m.userId === ("user-001" as unknown as UserId)
          ? { ...m, reviewingItemId: itemId }
          : m,
      ),
    }))
  }, [])

  const stats = useMemo(
    () => ({
      total: queue.items.length,
      pending: queue.items.filter((i) => i.status === "pending").length,
      underReview: queue.items.filter((i) => i.status === "under_review").length,
      approved: queue.items.filter((i) => i.status === "approved").length,
      rejected: queue.items.filter((i) => i.status === "rejected").length,
    }),
    [queue.items],
  )

  return {
    queue,
    stats,
    approveItem,
    rejectItem,
    flagItem,
    getItemsByStatus,
    startReview,
  }
}
