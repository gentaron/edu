#!/usr/bin/env tsx
/**
 * Build-Time RAG Index Pipeline for EDU Browser-Native Chatbot (Phase 1)
 *
 * Reads EDU lore data from `src/domains/` TypeScript data files,
 * chunks each entry, embeds with multilingual-e5-small, and outputs
 * `public/rag/corpus.json` + `public/rag/manifest.json`.
 *
 * Usage:
 *   bun run build:rag            # Full rebuild (or skip if up-to-date)
 *   bun run build:rag --force    # Ignore cache, rebuild from scratch
 *   bun run build:rag --dry-run  # Report counts without writing files
 *
 * Content source: src/domains/wiki/*.data.ts (characters, organizations,
 *   geography, technology, terms, history) + civilizations/*.data.ts
 *
 * Privacy: any chunk containing ACL, meniscus, hamstring autograft,
 *   knee surgery, shoe sole, Concentrix, Booking.com, Cyberjaya
 *   (case-insensitive) is silently dropped.
 */

import * as fs from "node:fs"
import * as path from "node:path"
import * as crypto from "node:crypto"
import { fileURLToPath } from "node:url"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChunkKind =
  | "character"
  | "faction"
  | "timeline"
  | "rules"
  | "story"
  | "misc"

type ChunkLanguage = "ja" | "en" | "mixed"

type ChunkMetadata = {
  path: string
  headingPath: string[]
  kind: ChunkKind
  language: ChunkLanguage
  hash: string
}

type Chunk = {
  id: string
  text: string
  embedding: string // base64-encoded Float32Array
  metadata: ChunkMetadata
}

type CorpusFile = {
  version: 1
  model: string
  dimension: number
  chunks: Chunk[]
}

type ManifestFile = {
  version: 1
  buildHash: string
  chunkCount: number
  model: string
  dimension: number
  generatedAt: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MODEL_ID = "Xenova/multilingual-e5-small"
const DIMENSION = 384
const BATCH_SIZE = 32
const MAX_TOKENS_PER_CHUNK = 400
const OVERLAP_TOKENS = 50
const CORPUS_VERSION = 1

const PRIVACY_KEYWORDS = [
  "ACL",
  "meniscus",
  "hamstring autograft",
  "knee surgery",
  "shoe sole",
  "Concentrix",
  "Booking.com",
  "Cyberjaya",
]

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const FORCE = args.includes("--force")
const DRY_RUN = args.includes("--dry-run")

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PUBLIC_RAG = path.join(ROOT, "public", "rag")
const CORPUS_PATH = path.join(PUBLIC_RAG, "corpus.json")
const MANIFEST_PATH = path.join(PUBLIC_RAG, "manifest.json")

// ---------------------------------------------------------------------------
// Privacy check
// ---------------------------------------------------------------------------

const privacyRegex = new RegExp(
  PRIVACY_KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i",
)

function isPrivacyViolation(text: string): boolean {
  return privacyRegex.test(text)
}

// ---------------------------------------------------------------------------
// Simple tokenizer (whitespace + CJK character heuristic)
// This approximates the multilingual-e5-small tokenizer without needing
// to load it at chunk time. Good enough for ~400-token target splits.
// ---------------------------------------------------------------------------

function tokenize(text: string): string[] {
  // Split on whitespace, but also separate CJK characters individually
  const tokens: string[] = []
  const cjkRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9fff\uac00-\ud7af]/
  for (const word of text.split(/\s+/)) {
    if (cjkRegex.test(word)) {
      // Split CJK into individual characters (each ≈ 1 token)
      for (const char of word) {
        if (cjkRegex.test(char)) {
          tokens.push(char)
        } else {
          tokens.push(char)
        }
      }
    } else {
      tokens.push(word)
    }
  }
  return tokens
}

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------

/**
 * Split a text into chunks of approximately MAX_TOKENS_PER_CHUNK tokens
 * with OVERLAP_TOKENS overlap. For short texts (< MAX_TOKENS), returns
 * the text as a single chunk.
 */
function chunkText(text: string): string[] {
  const tokens = tokenize(text)
  if (tokens.length <= MAX_TOKENS_PER_CHUNK) {
    return [text]
  }

  const chunks: string[] = []
  let start = 0

  while (start < tokens.length) {
    const end = Math.min(start + MAX_TOKENS_PER_CHUNK, tokens.length)
    const chunkTokens = tokens.slice(start, end)
    chunks.push(chunkTokens.join(" "))
    start = end - OVERLAP_TOKENS
    if (start >= tokens.length - OVERLAP_TOKENS) break
  }

  return chunks
}

// ---------------------------------------------------------------------------
// Language detection (simple heuristic)
// ---------------------------------------------------------------------------

function detectLanguage(text: string): ChunkLanguage {
  const cjkCount = (text.match(/[\u3000-\u9fff\uac00-\ud7af]/g) || []).length
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length
  const total = text.length

  if (total === 0) return "mixed"

  const cjkRatio = cjkCount / total
  const latinRatio = latinCount / total

  if (cjkRatio > 0.1 && latinRatio > 0.1) return "mixed"
  if (cjkRatio > 0.05) return "ja"
  return "en"
}

// ---------------------------------------------------------------------------
// Kind inference from category/subCategory
// ---------------------------------------------------------------------------

function inferKind(
  category: string,
  _subCategory: string,
): ChunkKind {
  const cat = category.toLowerCase()
  if (cat.includes("キャラクター") || cat.includes("character")) return "character"
  if (
    cat.includes("組織") ||
    cat.includes("軍事") ||
    cat.includes("organization") ||
    cat.includes("faction")
  )
    return "faction"
  if (cat.includes("歴史") || cat.includes("history") || cat.includes("戦争") || cat.includes("時代"))
    return "timeline"
  if (cat.includes("card") || cat.includes("ルール") || cat.includes("rule"))
    return "rules"
  if (cat.includes("story") || cat.includes("物語"))
    return "story"
  return "misc"
}

// ---------------------------------------------------------------------------
// Content extraction from data files
// ---------------------------------------------------------------------------

/**
 * We dynamically import the TypeScript data modules using tsx.
 * Each wiki data file exports arrays of entries with id, name, nameEn,
 * category, subCategory, description, and optionally leaders.
 *
 * We also include civilization data for geographical/faction context.
 */

interface WikiEntryRaw {
  id: string
  name: string
  nameEn?: string
  category: string
  subCategory?: string
  description: string
  era?: string
  affiliation?: string
  tier?: string
  leaders?: Array<{ id: string; name: string; nameEn?: string; role?: string; era?: string }>
  sourceLinks?: Array<{ url: string; label: string }>
}

interface CardEntryRaw {
  id: string
  name: string
  nameEn?: string
  cost?: number
  attack?: number
  defense?: number
  description?: string
  ability?: string
  effect?: string
  category?: string
}

interface CivilizationEntryRaw {
  id: string
  name: string
  nameEn?: string
  description: string
  location?: string
  government?: string
  population?: string
  traits?: string[]
}

/**
 * Format a wiki entry into rich text suitable for chunking.
 * Includes the heading path and all metadata inline.
 */
function formatWikiEntry(entry: WikiEntryRaw): string {
  const lines: string[] = []
  lines.push(`## ${entry.name}`)
  if (entry.nameEn) lines.push(`### ${entry.nameEn}`)
  if (entry.era) lines.push(`**時代**: ${entry.era}`)
  if (entry.affiliation) lines.push(`**所属**: ${entry.affiliation}`)
  if (entry.tier) lines.push(`**Tier**: ${entry.tier}`)
  lines.push("") // blank line
  lines.push(entry.description)

  // Append leader details if present
  if (entry.leaders && entry.leaders.length > 0) {
    lines.push("")
    lines.push("### 主要人物")
    for (const leader of entry.leaders) {
      lines.push(`- ${leader.name}${leader.nameEn ? ` (${leader.nameEn})` : ""}: ${leader.role || ""} — ${leader.era || ""}`)
    }
  }

  return lines.join("\n")
}

/**
 * Format a card entry into text suitable for chunking.
 */
function formatCardEntry(entry: CardEntryRaw): string {
  const lines: string[] = []
  lines.push(`## ${entry.name}`)
  if (entry.nameEn) lines.push(`### ${entry.nameEn}`)
  lines.push(`**カテゴリ**: ${entry.category || "不明"}`)
  if (entry.cost !== undefined) lines.push(`**コスト**: ${entry.cost}`)
  if (entry.attack !== undefined) lines.push(`**攻撃力**: ${entry.attack}`)
  if (entry.defense !== undefined) lines.push(`**防御力**: ${entry.defense}`)
  lines.push("")
  if (entry.description) lines.push(entry.description)
  if (entry.ability) lines.push(`**能力**: ${entry.ability}`)
  if (entry.effect) lines.push(`**効果**: ${entry.effect}`)
  return lines.join("\n")
}

/**
 * Format a civilization entry into text suitable for chunking.
 */
function formatCivilizationEntry(entry: CivilizationEntryRaw): string {
  const lines: string[] = []
  lines.push(`## ${entry.name}`)
  if (entry.nameEn) lines.push(`### ${entry.nameEn}`)
  if (entry.location) lines.push(`**場所**: ${entry.location}`)
  if (entry.government) lines.push(`**政治体制**: ${entry.government}`)
  if (entry.population) lines.push(`**人口**: ${entry.population}`)
  if (entry.traits && entry.traits.length > 0) {
    lines.push(`**特徴**: ${entry.traits.join(", ")}`)
  }
  lines.push("")
  lines.push(entry.description)
  return lines.join("\n")
}

// ---------------------------------------------------------------------------
// SHA-256 helper
// ---------------------------------------------------------------------------

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex")
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== EDU RAG Index Builder ===")
  console.log(`Model: ${MODEL_ID}`)
  console.log(`Dimension: ${DIMENSION}`)
  console.log(`Force: ${FORCE}`)
  console.log(`Dry run: ${DRY_RUN}`)
  console.log("")

  // --- Step 1: Collect entries from data files ---
  console.log("[1/4] Collecting entries from data files...")

  // Dynamically import data modules via tsx
  // We need to resolve paths relative to the src directory
  const wikiDataDir = path.join(ROOT, "src", "domains", "wiki")
  const civDataDir = path.join(ROOT, "src", "domains", "civilizations")
  const cardsDataDir = path.join(ROOT, "src", "domains", "cards")

  const allEntries: Array<{
    text: string
    metadata: ChunkMetadata
  }> = []

  // Wiki data files
  const wikiDataFiles = [
    "characters.data",
    "characters-new.data",
    "organizations.data",
    "geography.data",
    "technology.data",
    "terms.data",
    "history.data",
  ]

  for (const fileName of wikiDataFiles) {
    const filePath = path.join(wikiDataDir, `${fileName}.ts`)
    if (!fs.existsSync(filePath)) {
      console.warn(`  [WARN] Skipping missing file: ${filePath}`)
      continue
    }

    try {
      const mod = await import(filePath)
      const firstKey = Object.keys(mod)[0]
      const data: WikiEntryRaw[] = (firstKey ? mod[firstKey] : undefined) || []
      for (const entry of data) {
        const text = formatWikiEntry(entry)
        allEntries.push({
          text,
          metadata: {
            path: `src/domains/wiki/${fileName}.ts`,
            headingPath: [entry.category || "unknown", entry.subCategory || "", entry.name],
            kind: inferKind(entry.category || "", entry.subCategory || ""),
            language: detectLanguage(text),
            hash: sha256(`${entry.id}:${entry.name}:${entry.description}`),
          },
        })
      }
      console.log(`  ${fileName}: ${data.length} entries`)
    } catch (err) {
      console.error(`  [ERROR] Failed to import ${fileName}:`, err)
    }
  }

  // Civilization data files
  const civDataFiles = [
    "civ.data",
    "civ-top.data",
    "civ-leaders.data",
    "civ-historical.data",
    "civ-other.data",
  ]

  for (const fileName of civDataFiles) {
    const filePath = path.join(civDataDir, `${fileName}.ts`)
    if (!fs.existsSync(filePath)) {
      continue
    }

    try {
      const mod = await import(filePath)
      const firstKey = Object.keys(mod)[0]
      const data: CivilizationEntryRaw[] = (firstKey ? mod[firstKey] : undefined) || []
      for (const entry of data) {
        const text = formatCivilizationEntry(entry)
        allEntries.push({
          text,
          metadata: {
            path: `src/domains/civilizations/${fileName}.ts`,
            headingPath: ["文明", entry.name],
            kind: "faction",
            language: detectLanguage(text),
            hash: sha256(`civ:${entry.id}:${entry.name}:${entry.description}`),
          },
        })
      }
      console.log(`  civilizations/${fileName}: ${data.length} entries`)
    } catch (err) {
      console.error(`  [ERROR] Failed to import ${fileName}:`, err)
    }
  }

  // Card data files (include card rules in the corpus)
  const cardFilesToInclude = [
    "cards-player.data",
    "enemies.data",
  ]

  for (const fileName of cardFilesToInclude) {
    const filePath = path.join(cardsDataDir, `${fileName}.ts`)
    if (!fs.existsSync(filePath)) {
      continue
    }

    try {
      const mod = await import(filePath)
      const firstKey = Object.keys(mod)[0]
      const data: CardEntryRaw[] = (firstKey ? mod[firstKey] : undefined) || []
      for (const entry of data) {
        const text = formatCardEntry(entry)
        allEntries.push({
          text,
          metadata: {
            path: `src/domains/cards/${fileName}.ts`,
            headingPath: ["カード", entry.name],
            kind: "rules",
            language: detectLanguage(text),
            hash: sha256(`card:${entry.id}:${entry.name}:${entry.description ?? ""}:${entry.ability ?? ""}`),
          },
        })
      }
      console.log(`  cards/${fileName}: ${data.length} entries`)
    } catch (err) {
      console.error(`  [ERROR] Failed to import ${fileName}:`, err)
    }
  }

  console.log(`  Total entries collected: ${allEntries.length}`)

  // --- Step 2: Chunk and apply privacy filter ---
  console.log("[2/4] Chunking and applying privacy filter...")

  const rawChunks: Array<{
    text: string
    metadata: ChunkMetadata
  }> = []

  let droppedByPrivacy = 0

  for (const entry of allEntries) {
    const textChunks = chunkText(entry.text)
    for (let i = 0; i < textChunks.length; i++) {
      const chunkText = textChunks[i]

      // Privacy check
      if (isPrivacyViolation(chunkText)) {
        console.error(`  [PRIVACY] Dropped chunk from ${entry.metadata.path} (chunk ${i})`)
        droppedByPrivacy++
        continue
      }

      rawChunks.push({
        text: chunkText,
        metadata: {
          ...entry.metadata,
          hash: sha256(`${entry.metadata.path}:${i}:${chunkText}`),
        },
      })
    }
  }

  console.log(`  Chunks created: ${rawChunks.length}`)
  if (droppedByPrivacy > 0) {
    console.log(`  Chunks dropped by privacy filter: ${droppedByPrivacy}`)
  }

  // Compute build hash from all chunk hashes
  const allHashes = rawChunks.map((c) => c.metadata.hash).sort().join("|")
  const buildHash = sha256(allHashes)

  // Check if we can skip (deterministic cache)
  if (!FORCE && !DRY_RUN) {
    try {
      if (fs.existsSync(MANIFEST_PATH)) {
        const existing: ManifestFile = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
        if (existing.buildHash === buildHash) {
          console.log("RAG index up to date — skipping build.")
          process.exit(0)
        }
      }
    } catch {
      // Manifest missing or corrupt — rebuild
    }
  }

  if (DRY_RUN) {
    console.log("")
    console.log("=== DRY RUN RESULTS ===")
    console.log(`  Entries: ${allEntries.length}`)
    console.log(`  Chunks: ${rawChunks.length}`)
    console.log(`  Privacy drops: ${droppedByPrivacy}`)
    console.log(`  Build hash: ${buildHash}`)
    console.log("")
    console.log("No files written. Exiting.")
    process.exit(0)
  }

  // --- Step 3: Embed chunks ---
  console.log(`[3/4] Embedding ${rawChunks.length} chunks with ${MODEL_ID}...`)

  // Dynamically import @xenova/transformers
  let pipeline: any
  try {
    const { pipeline: createPipeline } = await import("@xenova/transformers")
    pipeline = await createPipeline("feature-extraction", MODEL_ID, {
      // Use the repo's node_modules cache, not a global cache
      progress_callback: (progress: any) => {
        if (progress.status === "progress" && progress.progress !== undefined) {
          const pct = Math.round(progress.progress)
          if (pct % 25 === 0) {
            process.stdout.write(`  Downloading model: ${pct}%\r`)
          }
        }
      },
    })
    console.log("  Model loaded.")
  } catch (err) {
    console.error("  [ERROR] Failed to load embedding model:", err)
    console.error("  Make sure @xenova/transformers is installed as a dependency.")
    process.exit(1)
  }

  const chunks: Chunk[] = []

  for (let i = 0; i < rawChunks.length; i += BATCH_SIZE) {
    const batch = rawChunks.slice(i, i + BATCH_SIZE)
    const texts = batch.map((c) => `passage: ${c.text}`)

    try {
      const output = await pipeline(texts, {
        pooling: "mean",
        normalize: true,
      })

      // output is a Tensor; convert to Float32Array per chunk
      const embeddings: Float32Array[] =
        output.dims?.length === 2
          ? // Single batch: shape [batchSize, dim]
            Array.from({ length: batch.length }, (_, j) => {
              const arr = new Float32Array(DIMENSION)
              for (let d = 0; d < DIMENSION; d++) {
                arr[d] = output.data[j * DIMENSION + d] as number
              }
              return arr
            })
          : // Each chunk processed individually
            batch.map((_: any, j: number) => {
              const t = output[j] || output
              const data = t.data || t
              const arr = new Float32Array(DIMENSION)
              for (let d = 0; d < Math.min(DIMENSION, data.length); d++) {
                arr[d] = data[d] as number
              }
              return arr
            })

      for (let j = 0; j < batch.length; j++) {
        const id = String(chunks.length + 1).padStart(4, "0")
        const float32 = embeddings[j] || new Float32Array(DIMENSION)
        const base64 = Buffer.from(float32.buffer).toString("base64")

        chunks.push({
          id,
          text: batch[j].text,
          embedding: base64,
          metadata: batch[j].metadata,
        })
      }
    } catch (err) {
      console.error(`  [ERROR] Embedding batch starting at ${i}:`, err)
      process.exit(1)
    }

    // Progress reporting
    const done = Math.min(i + BATCH_SIZE, rawChunks.length)
    if (done % 100 < BATCH_SIZE || done === rawChunks.length) {
      console.log(`  Embedded: ${done}/${rawChunks.length}`)
    }
  }

  console.log(`  Total chunks embedded: ${chunks.length}`)

  // --- Step 4: Write output files ---
  console.log("[4/4] Writing output files...")

  // Ensure directory exists
  fs.mkdirSync(PUBLIC_RAG, { recursive: true })

  // Write corpus.json
  const corpus: CorpusFile = {
    version: CORPUS_VERSION,
    model: MODEL_ID,
    dimension: DIMENSION,
    chunks,
  }

  const corpusJson = JSON.stringify(corpus)
  fs.writeFileSync(CORPUS_PATH, corpusJson, "utf8")
  const corpusSizeMB = Buffer.byteLength(corpusJson) / (1024 * 1024)
  console.log(`  corpus.json: ${(corpusSizeMB).toFixed(2)} MB (${chunks.length} chunks)`)

  // Write manifest.json
  const manifest: ManifestFile = {
    version: CORPUS_VERSION,
    buildHash,
    chunkCount: chunks.length,
    model: MODEL_ID,
    dimension: DIMENSION,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8")
  console.log(`  manifest.json: buildHash=${buildHash.slice(0, 12)}... chunkCount=${chunks.length}`)

  // Check if corpus.json should be gitignored ( > 10 MB )
  if (corpusSizeMB > 10) {
    console.log("")
    console.log(`  [INFO] corpus.json is ${(corpusSizeMB).toFixed(2)} MB (> 10 MB).`)
    console.log("  Consider adding it to .gitignore.")
  }

  console.log("")
  console.log("=== RAG index build complete ===")
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
