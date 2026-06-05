/**
 * Card art generation pipeline using Ideogram 4 API
 * Generates images for all cards in the edu card game.
 *
 * Usage: bun run scripts/generate-card-art.ts
 *
 * Requires: IDEOGRAM_API_KEY environment variable
 */

import type { GameCard } from "@/types";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/v1/generate";

interface IdeogramRequest {
  prompt: string;
  style_type?: "GENERAL" | "REALISTIC" | "ANIME" | "3D" | "DESIGN";
  resolution?:
    | "1024x1024"
    | "768x1344"
    | "864x1152"
    | "1344x768"
    | "1152x864"
    | "1440x720"
    | "720x1440";
  num_images?: number;
}

interface IdeogramResponse {
  data: Array<{ url: string; is_safe: boolean }>;
}

function buildCardPrompt(
  cardName: string,
  rarity: string,
  flavorText: string
): string {
  const rarityStyles: Record<string, string> = {
    SR: "ultra-detailed anime illustration, golden accents, glowing aura, premium card art style, fantasy character portrait, dramatic lighting",
    R: "detailed anime illustration, silver-blue accents, card art style, character portrait, clean lines",
    C: "simple anime illustration, clean card art style, character portrait, flat colors",
  };
  const style = rarityStyles[rarity] ?? rarityStyles["C"];
  return `${style}. Character: ${cardName}. ${flavorText}. High quality, consistent art style with the E16 sci-fi universe aesthetic.`;
}

async function generateSingleCardArt(
  cardId: string,
  cardName: string,
  rarity: string,
  flavorText: string
): Promise<string | undefined> {
  const apiKey = process.env.IDEOGRAM_API_KEY;
  if (!apiKey) {
    console.error("IDEOGRAM_API_KEY not set. Skipping generation.");
    return undefined;
  }

  const body: IdeogramRequest = {
    prompt: buildCardPrompt(cardName, rarity, flavorText),
    style_type: "ANIME",
    resolution: "1024x1024",
    num_images: 1,
  };

  const response = await fetch(IDEOGRAM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error(`Failed to generate art for ${cardName}: ${response.status}`);
    return undefined;
  }

  const data = (await response.json()) as IdeogramResponse;
  const firstItem = data.data[0];
  return firstItem?.url;
}

// Rate limiting: 1 request per second
const rateLimiter = {
  lastRequest: 0,
  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    if (elapsed < 1_000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1_000 - elapsed)
      );
    }
    this.lastRequest = Date.now();
  },
};

async function main(): Promise<void> {
  console.log("Card Art Generation Pipeline — Ideogram 4");
  console.log("=========================================");

  // Import card data dynamically
  const { ALL_CARDS } = (await import(
    "../src/domains/cards/player-cards.data"
  )) as { ALL_CARDS: readonly GameCard[] };

  console.log(`Found ${ALL_CARDS.length} cards to process`);

  for (const card of ALL_CARDS) {
    await rateLimiter.wait();
    console.log(`Generating: ${card.name} (${card.rarity})...`);
    const url = await generateSingleCardArt(
      card.id,
      card.name,
      card.rarity,
      card.flavorText ?? ""
    );
    if (url) {
      console.log(`  ✓ Generated: ${url}`);
    } else {
      console.log(`  ✗ Failed (keeping existing image)`);
    }
  }

  console.log("Generation complete.");
}

main().catch(console.error);
