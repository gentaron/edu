"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Plus,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Clock,
  Users,
  Sparkles,
} from "lucide-react"
import type {
  DocumentId,
  DeckEntry,
  DeckSyncState,
  PresenceDevice,
} from "@/lib/crdt/types"

// ─── Mock Data ─────────────────────────────────────────────────

const MOCK_DEVICES: PresenceDevice[] = [
  {
    deviceId: "dev-001" as unknown as import("@/lib/crdt/types").DeviceId,
    userId: "user-001" as unknown as import("@/lib/crdt/types").UserId,
    displayName: "My PC",
    color: "#60a5fa",
    lastSeen: new Date().toISOString(),
    currentPath: "/decks",
  },
  {
    deviceId: "dev-002" as unknown as import("@/lib/crdt/types").DeviceId,
    userId: "user-001" as unknown as import("@/lib/crdt/types").UserId,
    displayName: "iPad",
    color: "#a78bfa",
    lastSeen: new Date().toISOString(),
    currentPath: "/decks/frost-legion",
  },
  {
    deviceId: "dev-003" as unknown as import("@/lib/crdt/types").DeviceId,
    userId: "user-002" as unknown as import("@/lib/crdt/types").UserId,
    displayName: "Partner Phone",
    color: "#34d399",
    lastSeen: new Date(Date.now() - 60_000).toISOString(),
  },
]

const MOCK_DECKS: DeckEntry[] = [
  {
    docId: "deck-001" as unknown as DocumentId,
    name: "Frost Legion",
    characters: [
      { id: "c1", name: "Glacius", element: "Ice", tier: "Tier 1" },
      { id: "c2", name: "Rime Warden", element: "Ice", tier: "Tier 2" },
      { id: "c3", name: "Frostbite", element: "Ice", tier: "Tier 2" },
      { id: "c4", name: "Blizzard", element: "Water", tier: "Tier 3" },
      { id: "c5", name: "Hailstorm", element: "Water", tier: "Tier 3" },
    ],
    lastModified: new Date(Date.now() - 300_000).toISOString(),
    owner: "user-001" as unknown as import("@/lib/crdt/types").UserId,
    collaboratorCount: 2,
    syncVersion: 14,
  },
  {
    docId: "deck-002" as unknown as DocumentId,
    name: "Apolon's Chosen",
    characters: [
      { id: "c6", name: "Apolon", element: "Light", tier: "Tier 1" },
      { id: "c7", name: "Solara", element: "Light", tier: "Tier 1" },
      { id: "c8", name: "Dawnblade", element: "Fire", tier: "Tier 2" },
      { id: "c9", name: "Radiant", element: "Light", tier: "Tier 2" },
      { id: "c10", name: "Eclipse", element: "Dark", tier: "Tier 3" },
    ],
    lastModified: new Date(Date.now() - 3_600_000).toISOString(),
    owner: "user-001" as unknown as import("@/lib/crdt/types").UserId,
    collaboratorCount: 0,
    syncVersion: 7,
  },
  {
    docId: "deck-003" as unknown as DocumentId,
    name: "Shadow Collective",
    characters: [
      { id: "c11", name: "Umbra", element: "Dark", tier: "Tier 1" },
      { id: "c12", name: "Void Walker", element: "Dark", tier: "Tier 2" },
      { id: "c13", name: "Nightfang", element: "Dark", tier: "Tier 2" },
    ],
    lastModified: new Date(Date.now() - 86_400_000).toISOString(),
    owner: "user-002" as unknown as import("@/lib/crdt/types").UserId,
    collaboratorCount: 1,
    syncVersion: 3,
  },
]

// ─── Hook ──────────────────────────────────────────────────────

export function useDeckSync() {
  const [decks, setDecks] = useState<DeckEntry[]>([])
  const [syncState, setSyncState] = useState<DeckSyncState>({
    connectedDevices: [],
    pendingChanges: 0,
    lastSyncAt: new Date().toISOString(),
    isSyncing: false,
  })
  const [connectedDevices, setConnectedDevices] = useState<PresenceDevice[]>([])

  /** Initialize mock CRDT repo and subscribe to document changes */
  const initializeRepo = useCallback(() => {
    // In production: create Automerge Repo, subscribe to sync peers
    setDecks(MOCK_DECKS)
    setSyncState((prev) => ({
      ...prev,
      connectedDevices: MOCK_DEVICES.map((d) => d.deviceId),
      lastSyncAt: new Date().toISOString(),
    }))
    setConnectedDevices(MOCK_DEVICES)
  }, [])

  /** Create a new deck document in the CRDT */
  const createDeck = useCallback((name: string) => {
    const newDeck: DeckEntry = {
      docId: `deck-${Date.now()}` as unknown as DocumentId,
      name,
      characters: [],
      lastModified: new Date().toISOString(),
      owner: "user-001" as unknown as import("@/lib/crdt/types").UserId,
      collaboratorCount: 0,
      syncVersion: 0,
    }
    // In production: Automerge.init() → Repo.create() → broadcast change
    setDecks((prev) => [newDeck, ...prev])
    setSyncState((prev) => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }))
  }, [])

  /** Force sync all pending CRDT changes to connected peers */
  const forceSync = useCallback(() => {
    setSyncState((prev) => ({ ...prev, isSyncing: true }))
    // Simulate network round-trip
    setTimeout(() => {
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        pendingChanges: 0,
        lastSyncAt: new Date().toISOString(),
      }))
    }, 800)
  }, [])

  useEffect(() => {
    initializeRepo()
  }, [initializeRepo])

  const deviceIcons = useMemo(() => {
    const icons: Record<string, typeof Monitor> = {}
    connectedDevices.forEach((d) => {
      const name = d.displayName.toLowerCase()
      if (name.includes("phone")) icons[d.deviceId] = Smartphone
      else if (name.includes("ipad") || name.includes("tablet"))
        icons[d.deviceId] = Tablet
      else icons[d.deviceId] = Monitor
    })
    return icons
  }, [connectedDevices])

  return {
    decks,
    syncState,
    connectedDevices,
    deviceIcons,
    createDeck,
    forceSync,
  }
}
