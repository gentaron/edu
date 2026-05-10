import { NextRequest, NextResponse } from "next/server"
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

export async function POST(req: NextRequest) {
  try {
    const { entryId, lang = "ja" } = await req.json()

    if (!entryId) {
      return NextResponse.json({ error: "entryId is required" }, { status: 400 })
    }

    const entry = ALL_ENTRIES.find((e) => e.id === entryId)
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Build a compact list of all wiki entries for the AI to choose from
    const candidateList = ALL_ENTRIES.filter((e) => e.id !== entryId).map((e) => ({
      id: e.id,
      name: e.name,
      nameEn: e.nameEn || "",
      category: e.category,
      subCategory: e.subCategory || "",
      era: e.era || "",
      affiliation: e.affiliation || "",
    }))

    const displayName = lang === "en" && entry.nameEn ? entry.nameEn : entry.name
    const displayDesc =
      lang === "en" && entry.descriptionEn ? entry.descriptionEn : entry.description

    // Truncate description to keep prompt manageable
    const descSnippet = displayDesc.slice(0, 300)

    const systemPrompt =
      lang === "en"
        ? `You are a wiki curator for a fictional sci-fi universe called "EDU". Given a wiki entry, suggest the 6 most relevant/related wiki entries from the provided candidate list. Consider: shared locations, organizations, characters that interact, historical connections, technological relationships, and thematic links. Return ONLY a JSON array of entry IDs (strings), no explanation.`
        : `あなたは「EDU」という架空のSF宇宙のWikiキュレーターです。指定されたWikiエントリに対して、候補リストから最も関連性の高いエントリを6つ提案してください。判断基準：共有する場所、組織、交流するキャラクター、歴史的つながり、技術的関係、テーマ的リンク。JSON配列（文字列のIDのみ）で返してください。説明は不要。`

    const userMessage =
      lang === "en"
        ? `Current entry: "${displayName}" (${entry.category})\nDescription: ${descSnippet}\n\nCandidate entries:\n${JSON.stringify(candidateList)}\n\nReturn the 6 most related entry IDs as a JSON array.`
        : `現在のエントリ: 「${displayName}」（${entry.category}）\n概要: ${descSnippet}\n\n候補エントリ:\n${JSON.stringify(candidateList)}\n\n最も関連性の高い6つのエントリIDをJSON配列で返してください。`

    // If no API key, fall back to category-based suggestions
    if (!OPENROUTER_API_KEY) {
      const fallback = ALL_ENTRIES.filter((e) => e.category === entry.category && e.id !== entryId)
      const shuffled = fallback.sort(() => Math.random() - 0.5).slice(0, 6)
      return NextResponse.json({ related: shuffled.map((e) => e.id), source: "fallback" })
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://edu.gentaron.com",
        "X-Title": "EDU Wiki Related Entries",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter API error:", response.status, await response.text())
      // Fallback on error
      const fallback = ALL_ENTRIES.filter((e) => e.category === entry.category && e.id !== entryId)
      const shuffled = fallback.sort(() => Math.random() - 0.5).slice(0, 6)
      return NextResponse.json({ related: shuffled.map((e) => e.id), source: "fallback" })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()

    if (!content) {
      return NextResponse.json({ related: [], source: "empty" })
    }

    // Parse the AI response — extract JSON array from the response
    let ids: string[] = []
    try {
      // Try direct parse first
      const parsed = JSON.parse(content)
      ids = Array.isArray(parsed) ? parsed : []
    } catch {
      // Try extracting array from text
      const match = content.match(/\[[\s\S]*?\]/)
      if (match) {
        try {
          ids = JSON.parse(match[0])
        } catch {
          ids = []
        }
      }
    }

    // Validate IDs against actual entries
    const validIds = ids.filter((id) => ALL_ENTRIES.some((e) => e.id === id)).slice(0, 6)

    return NextResponse.json({ related: validIds, source: "ai" })
  } catch (error) {
    console.error("Wiki related API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
