import { redirect } from "next/navigation"

/** Legacy fixed wealth table is superseded by per-character current positions in the Wiki. */
export default function RankingPage() { redirect("/wiki?category=キャラクター") }
