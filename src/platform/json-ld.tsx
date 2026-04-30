import type { WikiEntry } from "@/types"

const BASE_URL = "https://edu-eternal-dominion-universe.vercel.app"

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eternal Dominion Universe",
    description: "E16連星系から地球AD2026へ — AURALIS 地球2026交信プロジェクト設定書 v2.0",
    url: BASE_URL,
    inLanguage: ["ja", "en"],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WikiArticleJsonLd({ entry }: { entry: WikiEntry }) {
  const schemaType =
    entry.category === "キャラクター"
      ? "Person"
      : entry.category === "組織"
        ? "Organization"
        : entry.category === "地理"
          ? "Place"
          : "Article"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: entry.name,
    ...(entry.nameEn && { alternateName: entry.nameEn }),
    description: entry.description.slice(0, 200),
    ...(entry.era && { temporalCoverage: entry.era }),
    ...(entry.affiliation && {
      affiliation: { "@type": "Organization", name: entry.affiliation },
    }),
    url: `${BASE_URL}/wiki/${encodeURIComponent(entry.id)}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/wiki/${encodeURIComponent(entry.id)}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
