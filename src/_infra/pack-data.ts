/* ═══════════════════════════════════════════════════════════════
   INFRA — Build-time Data Packer
   Usage: npx tsx src/_infra/pack-data.ts
   Reads L1 physical data files, encodes to EDU binary format,
   writes to public/data/*.edu
   ═══════════════════════════════════════════════════════════════ */

import * as fs from "node:fs"
import * as path from "node:path"
import { BinaryEncoder, crc32 } from "../l0-metal/binary-protocol"

// L1 Physical data imports (relative paths since tsx resolves tsconfig aliases)
import {
  WIKI_CHARACTERS,
  WIKI_CHARACTERS_NEW,
  WIKI_ORGANIZATIONS,
  WIKI_GEOGRAPHY,
  WIKI_TECHNOLOGY,
  WIKI_TERMS,
  WIKI_HISTORY,
} from "../l1-physical/wiki"
import { ALL_CARDS, ENEMIES } from "../l1-physical/cards"
import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
  CIVILIZATION_LEADERS,
} from "../l1-physical/civilizations"

// ─── Helpers ──────────────────────────────────────────────────

/** Convert an array of objects with `id` fields to a Map<string, unknown> */
function toIdMap<T extends { id: string }>(items: readonly T[]): Map<string, unknown> {
  const map = new Map<string, unknown>()
  for (const item of items) {
    map.set(item.id, item as unknown)
  }
  return map
}

interface PackedStats {
  filename: string
  entries: number
  binaryBytes: number
  jsonBytes: number
  ratio: string
}

function packAndWrite(name: string, entries: Map<string, unknown>, outDir: string): PackedStats {
  // Encode to binary
  const binaryBuf = BinaryEncoder.encode(entries)
  const binaryBytes = binaryBuf.byteLength

  // JSON size for comparison
  const jsonObj: Record<string, unknown> = {}
  for (const [k, v] of entries) {
    jsonObj[k] = v
  }
  const jsonStr = JSON.stringify(jsonObj)
  const jsonBytes = Buffer.byteLength(jsonStr, "utf-8")

  // Write binary file
  const outPath = path.join(outDir, `${name}.edu`)
  fs.writeFileSync(outPath, Buffer.from(binaryBuf))

  return {
    filename: `${name}.edu`,
    entries: entries.size,
    binaryBytes,
    jsonBytes,
    ratio: ((binaryBytes / jsonBytes) * 100).toFixed(1) + "%",
  }
}

// ─── Main ─────────────────────────────────────────────────────

function main(): void {
  const outDir = path.resolve(process.cwd(), "public", "data")
  fs.mkdirSync(outDir, { recursive: true })

  console.log("╔══════════════════════════════════════════════════╗")
  console.log("║       EDU Binary Data Packer                    ║")
  console.log("╚══════════════════════════════════════════════════╝\n")

  // 1. Wiki — merge all wiki data into one collection
  const wikiMap = new Map<string, unknown>()
  const allWiki = [
    ...WIKI_CHARACTERS,
    ...WIKI_CHARACTERS_NEW,
    ...WIKI_ORGANIZATIONS,
    ...WIKI_GEOGRAPHY,
    ...WIKI_TECHNOLOGY,
    ...WIKI_TERMS,
    ...WIKI_HISTORY,
  ]
  for (const entry of allWiki) {
    wikiMap.set(entry.id, entry as unknown)
  }

  // 2. Cards
  const cardsMap = toIdMap(ALL_CARDS)

  // 3. Enemies
  const enemiesMap = toIdMap(ENEMIES)

  // 4. Civilizations — merge all
  const civsMap = new Map<string, unknown>()
  const allCivs = [...TOP_CIVILIZATIONS, ...OTHER_CIVILIZATIONS, ...HISTORICAL_CIVILIZATIONS]
  for (const entry of allCivs) {
    civsMap.set(entry.id, entry as unknown)
  }

  // Pack all data sets
  const stats: PackedStats[] = [
    packAndWrite("wiki", wikiMap, outDir),
    packAndWrite("cards", cardsMap, outDir),
    packAndWrite("enemies", enemiesMap, outDir),
    packAndWrite("civilizations", civsMap, outDir),
  ]

  // Print stats table
  console.log("  File              Entries  Binary      JSON        Ratio")
  console.log("  ───────────────── ─────── ────────── ────────── ───────")
  let totalBinary = 0
  let totalJson = 0
  let totalEntries = 0
  for (const s of stats) {
    console.log(
      `  ${s.filename.padEnd(17)} ${String(s.entries).padStart(6)} ${String(s.binaryBytes).padStart(9)} ${String(s.jsonBytes).padStart(9)} ${s.ratio.padStart(6)}`
    )
    totalBinary += s.binaryBytes
    totalJson += s.jsonBytes
    totalEntries += s.entries
  }
  console.log("  ───────────────── ─────── ────────── ────────── ───────")
  const totalRatio = ((totalBinary / totalJson) * 100).toFixed(1) + "%"
  console.log(
    `  ${"TOTAL".padEnd(17)} ${String(totalEntries).padStart(6)} ${String(totalBinary).padStart(9)} ${String(totalJson).padStart(9)} ${totalRatio.padStart(6)}`
  )
  console.log(`\n  Output directory: ${outDir}\n`)
}

main()
