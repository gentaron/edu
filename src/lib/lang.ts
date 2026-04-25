export type Lang = "ja" | "en"

export function tl(ja: string, en: string, lang: Lang): string {
  return lang === "ja" ? ja : en
}
