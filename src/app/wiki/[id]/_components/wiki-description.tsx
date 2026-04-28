"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { ALL_ENTRIES } from "@/lib/wiki-data"

// ── Build the name→id lookup map ONCE at module level ──────────────────
// Each entry maps both its Japanese `name` and English `nameEn` (if present)
// to the entry's `id`. Names shorter than 3 chars are excluded to avoid
// spurious linking of very common particles / abbreviations.

interface NameEntry {
  name: string
  id: string
  length: number
}

const NAME_MAP: NameEntry[] = (() => {
  const map: NameEntry[] = []
  for (const entry of ALL_ENTRIES) {
    if (entry.name.length >= 3) {
      map.push({ name: entry.name, id: entry.id, length: entry.name.length })
    }
    if (entry.nameEn && entry.nameEn.length >= 3) {
      map.push({ name: entry.nameEn, id: entry.id, length: entry.nameEn.length })
    }
  }
  // Deduplicate — keep first occurrence (prefer Japanese name when same length)
  const seen = new Set<string>()
  const deduped: NameEntry[] = []
  for (const item of map) {
    const key = item.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(item)
    }
  }
  // Sort longest-first so greedy matching prefers longer names
  deduped.sort((a, b) => b.length - a.length)
  return deduped
})()

// Regex alternation of all names (longest first), escaped for safety
const NAME_PATTERN = new RegExp(
  `(${NAME_MAP.map((n) => n.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g"
)

// Quick lookup from matched name → entry id
const NAME_TO_ID = new Map<string, string>()
for (const item of NAME_MAP) {
  NAME_TO_ID.set(item.name, item.id)
  NAME_TO_ID.set(item.name.toLowerCase(), item.id)
}

// ── Component ─────────────────────────────────────────────────────────

interface WikiDescriptionProps {
  description: string
  entryId?: string
}

export default function WikiDescription({ description, entryId }: WikiDescriptionProps) {
  const segments = useMemo(() => tokenize(description, entryId), [description, entryId])

  return (
    <p className="text-sm sm:text-base text-white/65 leading-relaxed whitespace-pre-line font-light">
      {segments.map((seg, i) =>
        seg.type === "link" ? (
          <Link
            key={i}
            href={`/wiki/${encodeURIComponent(seg.id)}`}
            className="text-sky-400/80 hover:text-sky-300 underline decoration-sky-400/20 hover:decoration-sky-400/40 transition-colors"
          >
            {seg.text}
          </Link>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </p>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────

type Segment = { type: "text"; text: string } | { type: "link"; text: string; id: string }

function tokenize(text: string, currentEntryId?: string): Segment[] {
  const result: Segment[] = []
  let lastIndex = 0

  // Reset lastIndex (regex is global)
  NAME_PATTERN.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = NAME_PATTERN.exec(text)) !== null) {
    const matched = match[0]

    // Any text before this match is plain text
    if (match.index > lastIndex) {
      result.push({ type: "text", text: text.slice(lastIndex, match.index) })
    }

    // Look up the entry id
    const id = NAME_TO_ID.get(matched) ?? NAME_TO_ID.get(matched.toLowerCase())
    if (id && id !== currentEntryId) {
      result.push({ type: "link", text: matched, id })
    } else {
      // Fallback: treat as plain text (shouldn't happen but just in case)
      result.push({ type: "text", text: matched })
    }

    lastIndex = match.index + matched.length

    // Guard against zero-length matches
    if (matched.length === 0) {
      NAME_PATTERN.lastIndex++
    }
  }

  // Remaining text after the last match
  if (lastIndex < text.length) {
    result.push({ type: "text", text: text.slice(lastIndex) })
  }

  return result
}
