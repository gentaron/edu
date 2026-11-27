import { NextRequest } from "next/server"
import { characterResponse } from "./responses"
export const dynamic = "force-dynamic"
export function GET(req: NextRequest) {
  return characterResponse(req.nextUrl.searchParams.get("view"), req.nextUrl.searchParams.get("id"))
}
