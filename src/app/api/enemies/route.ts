import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const enemies = await db.enemy.findMany();
  return NextResponse.json(enemies);
}
