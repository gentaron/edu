import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSongById, deleteSong, updateSong } from "@/domains/music/music.repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const song = await getSongById(id);
  if (!song) {
    return NextResponse.json({ error: "曲が見つかりません" }, { status: 404 });
  }
  return NextResponse.json(song);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const song = await updateSong(id, body);
    return NextResponse.json(song);
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteSong(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
