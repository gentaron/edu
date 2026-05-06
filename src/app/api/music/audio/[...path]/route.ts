import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GRADIO_URL =
  process.env.ACESTEP_GRADIO_URL ?? "http://localhost:8001";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const upstreamUrl = `${GRADIO_URL}/file=${path.join("/")}`;

  try {
    const res = await fetch(upstreamUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "音声ファイルが見つかりません" }, { status: 404 });
    }

    const contentType = res.headers.get("content-type") ?? "audio/mpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "音声の取得に失敗しました" }, { status: 500 });
  }
}
