import { NextResponse } from "next/server"
import { characterResponse } from "../../responses"
export const dynamic = "force-dynamic"
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  if (!/^(?:[0-9a-f]{2}){1,512}$/.test(key)) return NextResponse.json({ error: "Invalid character key" }, { status: 400, headers: { "Cache-Control": "no-store" } })
  return characterResponse(null, Buffer.from(key, "hex").toString("utf8"))
}
