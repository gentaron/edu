import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** POST /api/game/create-deck — build a deck from card IDs */
export async function POST(req: NextRequest) {
  try {
    const { name, cardIds } = await req.json();
    if (!name || !Array.isArray(cardIds)) {
      return NextResponse.json({ error: "name and cardIds required" }, { status: 400 });
    }

    // Ensure all cards exist
    const cards = await prisma.card.findMany({ where: { id: { in: cardIds } } });
    if (cards.length === 0) {
      return NextResponse.json({ error: "No valid cards found" }, { status: 400 });
    }

    // Build deck: repeat to fill ~30 cards
    const deckCards: { cardId: string; count: number }[] = [];
    const targetSize = 30;
    let idx = 0;
    while (deckCards.reduce((s, d) => s + d.count, 0) < targetSize) {
      const card = cards[idx % cards.length];
      if (!card) {break;}
      const existing = deckCards.find((d) => d.cardId === card.id);
      if (existing) {
        if (existing.count < 3) {existing.count++;}
        else {idx++;}
      } else {
        deckCards.push({ cardId: card.id, count: 1 });
      }
      idx++;
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        cards: {
          create: deckCards,
        },
      },
      include: { cards: { include: { card: true } } },
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create deck" }, { status: 500 });
  }
}

/** GET /api/game/cards — list all cards */
export async function GET() {
  const cards = await prisma.card.findMany({ orderBy: { type: "asc" } });
  return NextResponse.json(cards);
}
