import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  const body = await req.json()
  const { systemPrompt, userPrompt } = body

  if (!systemPrompt || !userPrompt) {
    return NextResponse.json(
      { error: "systemPrompt and userPrompt are required" },
      { status: 400 },
    )
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    },
  )

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error")
    return NextResponse.json(
      { error: `Gemini API error (${res.status}): ${errText.substring(0, 200)}` },
      { status: 502 },
    )
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 })
  }

  return NextResponse.json({ text })
}
