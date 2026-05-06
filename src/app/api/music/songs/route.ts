import { NextResponse } from "next/server";
import { getSongs } from "@/domains/music/music.repository";

export async function GET() {
  try {
    const songs = await getSongs(100);
    return NextResponse.json(songs);
  } catch (err) {
    console.error("[music/songs]", err);
    return NextResponse.json({ error: "曲の取得に失敗しました" }, { status: 500 });
  }
}
