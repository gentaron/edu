import { redirect } from "next/navigation"

/** The old time-slider observatory is withdrawn; present states live on each character's Wiki page. */
export default function LegacyObservatory() { redirect("/wiki?category=キャラクター") }
