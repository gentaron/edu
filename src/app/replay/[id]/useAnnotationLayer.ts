"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  AnnotationEntry,
  AnnotationDensityPoint,
  ReplayPresence,
  AnnotationStatus,
  DocumentId,
  UserId,
  Timestamp,
} from "@/lib/crdt/types"

// ─── Mock Data ─────────────────────────────────────────────────

const MOCK_ANNOTATIONS: AnnotationEntry[] = [
  {
    id: "ann-001",
    turnIndex: 3,
    authorId: "user-001" as unknown as UserId,
    authorName: "Alice",
    body: "Glacius activates **Frozen Citadel** — key defensive pivot. This is where the momentum shifted.",
    status: "verified",
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    zkProofHash: "0xabc123..." as unknown as import("@/lib/crdt/types").ContentHash,
  },
  {
    id: "ann-002",
    turnIndex: 5,
    authorId: "user-002" as unknown as UserId,
    authorName: "Bob",
    body: "Rime Warden's *Hoarfrost* dealt critical damage to Solarflare's shield. Combo window!",
    status: "pending_verification",
    createdAt: new Date(Date.now() - 1_800_000).toISOString(),
  },
  {
    id: "ann-003",
    turnIndex: 7,
    authorId: "user-001" as unknown as UserId,
    authorName: "Alice",
    body: "The opponent tried to counter with Ignis but the **Ice Weakness** debuff prevented the burst.",
    status: "draft",
    createdAt: new Date(Date.now() - 600_000).toISOString(),
  },
  {
    id: "ann-004",
    turnIndex: 12,
    authorId: "user-003" as unknown as UserId,
    authorName: "Carol",
    body: "Final turn — Hailstorm's overdrive finished the match. Clean sweep!",
    status: "pending_verification",
    createdAt: new Date(Date.now() - 300_000).toISOString(),
  },
]

const MOCK_VIEWERS: ReplayPresence = {
  viewers: [
    {
      userId: "user-002" as unknown as UserId,
      displayName: "Bob",
      cursorTurn: 5,
      color: "#a78bfa",
      isSpectator: false,
    },
    {
      userId: "user-003" as unknown as UserId,
      displayName: "Carol",
      cursorTurn: 10,
      color: "#34d399",
      isSpectator: true,
    },
  ],
}

// ─── Hook ──────────────────────────────────────────────────────

export function useAnnotationLayer(replayId: string) {
  const [annotations, setAnnotations] = useState<AnnotationEntry[]>(MOCK_ANNOTATIONS)
  const [viewers, setViewers] = useState<ReplayPresence>(MOCK_VIEWERS)
  const [currentTurn, setCurrentTurn] = useState(1)
  const [totalTurns] = useState(15)

  /** Add a new annotation to the CRDT document at the given turn */
  const addAnnotation = useCallback(
    (turnIndex: number, body: string) => {
      const newAnnotation: AnnotationEntry = {
        id: `ann-${Date.now()}`,
        turnIndex,
        authorId: "user-001" as unknown as UserId,
        authorName: "You",
        body,
        status: "draft",
        createdAt: new Date().toISOString(),
      }
      // In production: Automerge.change(doc, (d) => d.annotations.push(newAnnotation))
      setAnnotations((prev) => [...prev, newAnnotation])
    },
    [],
  )

  /** Update the body of an existing annotation */
  const updateAnnotation = useCallback((id: string, body: string) => {
    // In production: Automerge.change(doc, (d) => { const ann = d.annotations.find(...); ann.body = body })
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, body, status: "draft" as AnnotationStatus } : a)),
    )
  }, [])

  /** Get all annotations for a specific turn */
  const getAnnotationsForTurn = useCallback(
    (turnIndex: number): AnnotationEntry[] => {
      return annotations.filter((a) => a.turnIndex === turnIndex)
    },
    [annotations],
  )

  /** Get annotation density data for the timeline dots */
  const getAnnotationDensity = useCallback((): AnnotationDensityPoint[] => {
    const densityMap = new Map<number, { count: number; hasUnverified: boolean }>()
    for (let i = 0; i <= totalTurns; i++) {
      densityMap.set(i, { count: 0, hasUnverified: false })
    }
    for (const ann of annotations) {
      const entry = densityMap.get(ann.turnIndex)!
      entry.count++
      if (ann.status === "pending_verification" || ann.status === "draft") {
        entry.hasUnverified = true
      }
    }
    return Array.from(densityMap.entries()).map(([turnIndex, data]) => ({
      turnIndex,
      ...data,
    }))
  }, [annotations, totalTurns])

  /** Submit an annotation for ZK proof verification */
  const submitForVerification = useCallback((id: string) => {
    // In production: dispatch event to ZK circuit, await proof generation
    setAnnotations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "pending_verification" as AnnotationStatus }
          : a,
      ),
    )
  }, [])

  /** Toggle spectator mode — hides your cursor from other viewers */
  const toggleSpectatorMode = useCallback(() => {
    setViewers((prev) => ({
      ...prev,
      viewers: prev.viewers.map((v) =>
        v.userId === ("user-001" as unknown as UserId)
          ? { ...v, isSpectator: !v.isSpectator }
          : v,
      ),
    }))
  }, [])

  const isSpectator = useMemo(
    () =>
      viewers.viewers.find(
        (v) => v.userId === ("user-001" as unknown as UserId),
      )?.isSpectator ?? true,
    [viewers],
  )

  return {
    annotations,
    viewers,
    currentTurn,
    totalTurns,
    isSpectator,
    setCurrentTurn,
    addAnnotation,
    updateAnnotation,
    getAnnotationsForTurn,
    getAnnotationDensity,
    submitForVerification,
    toggleSpectatorMode,
  }
}
