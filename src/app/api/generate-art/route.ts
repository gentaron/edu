import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ALL_CARDS } from "@/domains/cards/cards.data";
import type { GameCard } from "@/types";

const GenerateArtSchema = z.object({
  cardId: z.string().min(1),
  style: z.enum(["ANIME", "REALISTIC", "DESIGN"]).default("ANIME"),
});

const IDEOGRAM_API_URL = "https://api.ideogram.ai/v1/generate";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = GenerateArtSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cardId, style } = parsed.data;
  const apiKey = process.env.IDEOGRAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Ideogram API key not configured" },
      { status: 503 }
    );
  }

  // Look up card data
  const card: GameCard | undefined = ALL_CARDS.find(
    (c) => String(c.id) === cardId
  );

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const response = await fetch(IDEOGRAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      prompt: `Anime card art of ${card.nameEn ? `${card.name} (${card.nameEn})` : card.name}, ${card.rarity} rarity, ${card.flavorText}. E16 sci-fi universe.`,
      style_type: style,
      resolution: "1024x1024",
      num_images: 1,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Ideogram API error" },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    data: Array<{ url: string }>;
  };
  const firstItem = data.data[0];
  const imageUrl = firstItem?.url;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "No image generated" },
      { status: 502 }
    );
  }

  return NextResponse.json({ cardId, imageUrl });
}
