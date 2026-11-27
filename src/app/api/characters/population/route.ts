import { characterResponse } from "../responses"
export const dynamic = "force-dynamic"
export function GET() { return characterResponse("population", null) }
