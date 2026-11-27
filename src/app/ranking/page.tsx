import { redirect } from "next/navigation"

/** Legacy fixed wealth table is superseded by the living Wiki. */
export default function RankingPage() { redirect("/wiki/state") }
