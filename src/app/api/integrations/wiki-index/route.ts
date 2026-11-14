import { buildWikiIndex } from "@/domains/wiki/wiki-export"

export function GET(): Response {
  return Response.json(
    {
      schemaVersion: 1,
      kind: "fictional-wiki-index",
      source: "gentaron/edu",
      entries: buildWikiIndex(),
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  )
}
