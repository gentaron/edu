import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const cards = await db.pveCard.findMany();
  return NextResponse.json(cards);
}
