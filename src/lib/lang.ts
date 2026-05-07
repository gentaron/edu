export type Lang = "ja" | "en"

export function tl(ja: string, en: string, lang: Lang): string {
  return lang === "ja" ? ja : en
}

const CATEGORY_EN: Record<string, string> = {
  キャラクター: "Characters",
  用語: "Terms",
  組織: "Organizations",
  地理: "Geography",
  技術: "Technology",
  歴史: "History",
}

const TIER_EN: Record<string, string> = {
  "神格・歴史的人物": "Divine & Historical Figures",
  歴史的人物: "Historical Figure",
  未分類: "Unclassified",
}

export function tlCategory(cat: string, lang: Lang): string {
  return lang === "en" && CATEGORY_EN[cat] ? CATEGORY_EN[cat] : cat
}

export function tlTier(tier: string, lang: Lang): string {
  return lang === "en" && TIER_EN[tier] ? TIER_EN[tier] : tier
}
